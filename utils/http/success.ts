import { Context } from 'fresh'
import { State } from '@/utils.ts'
import { v7 as uuidv7 } from 'uuid'

/**
 * Comprehensive HTTP success response module providing standardized
 * response formats for all 2xx HTTP status codes.
 *
 * @module httpSuccess
 *
 * =============================================================================
 * HTTP SUCCESS HANDLER
 * =============================================================================
 *
 * 1. TYPES & INTERFACES
 *    - HttpSuccess
 *    - MetaBase
 *    - PaginationMeta
 *    - FinalResponse
 *
 * 2. INTERNAL UTILITIES
 *    - getResponseTime()
 *    - buildMeta()
 *    - buildResponse()
 *    - buildHeaders()
 *    - send()
 *
 * 3. SUCCESS RESPONSES (2xx)
 *    200 - OK
 *    200 - OK (No Data)
 *    200 - OK (With Custom Meta)
 *    201 - Created
 *    202 - Accepted
 *    202 - Accepted (With Data)
 *    203 - Non-Authoritative Information
 *    204 - No Content
 *    205 - Reset Content
 *    206 - Partial Content
 *    207 - Multi-Status
 *    208 - Already Reported
 *    226 - IM Used
 *
 *    Custom Response:
 *    - paginated() — 200 OK with pagination meta
 *
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * @example Basic Usage
 * ```ts
 * import { httpSuccess } from '@/utils/success.ts'
 *
 * // Simple OK response
 * return httpSuccess.ok(ctx, 'Fetch successful', undefined, { id: 123 })
 *
 * // OK without data
 * return httpSuccess.okNoData(ctx, 'Operation completed')
 *
 * // OK with custom extra metadata
 * return httpSuccess.okWithMeta(ctx, 'Done', { debug: true }, undefined, { result: 'X' })
 *
 * // Created
 * return httpSuccess.created(ctx, 'User created', undefined, { userId: 1 })
 *
 * // Paginated response
 * return httpSuccess.paginated(
 *   ctx,
 *   'Users fetched',
 *   { page: 1, limit: 10, total: 42, totalPages: 5 },
 *   undefined,
 *   users
 * )
 * ```
 *
 * =============================================================================
 * RESPONSE FORMAT
 * =============================================================================
 *
 * All success responses follow this standardized structure:
 *
 * ```json
 * {
 *   "meta": {
 *     "requestId": "019a99f0-3e90-7608-9b53-773fa7b1ca97",
 *     "path": "/api/users",
 *     "status": 200,
 *     "timestamp": "2025-11-19T10:30:00.000Z",
 *     "responseTimeMs": 12.34,
 *     "message": "Fetch successful",
 *     "extra": {
 *       "pagination": {
 *         "page": 1,
 *         "limit": 10,
 *         "total": 42,
 *         "totalPages": 5
 *       }
 *     }
 *   },
 *   "data": [
 *     { "id": 1, "name": "John Doe" }
 *   ]
 * }
 * ```
 *
 * For responses such as **204 No Content**, the body will be empty.
 *
 * =============================================================================
 * NOTES & CONVENTIONS
 * =============================================================================
 *
 * - All success responses always contain a `meta` object.
 * - `data` is always present unless the HTTP status requires otherwise (204, 205).
 * - `timestamp` uses `new Date().toISOString()` (UTC).
 * - `requestId` uses UUIDv7 to maintain monotonic ordering.
 * - `extra` may contain custom metadata such as pagination or debug info.
 * - Every response measures execution time using `performance.now()`.
 *
 * =============================================================================
 */

/** HTTP Success Responses Interface */
export interface HttpSuccess {
	ok<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	okNoData(ctx: Context<State>, message: string, headers?: HeadersInit): Response
	okWithMeta<T, M>(ctx: Context<State>, message: string, metaData: M, headers?: HeadersInit, data?: T): Response
	created<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	accepted(ctx: Context<State>, message?: string, headers?: HeadersInit): Response
	acceptedWithData<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	nonAuthoritativeInfo<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	noContent(ctx: Context<State>, headers?: HeadersInit): Response
	resetContent(ctx: Context<State>, headers?: HeadersInit): Response
	partialContent<T>(ctx: Context<State>, message: string, contentRange: string, headers?: HeadersInit, data?: T): Response
	multiStatus<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	alreadyReported<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	imUsed<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response
	paginated<T extends ReadonlyArray<unknown>>(ctx: Context<State>, message: string, pagination: PaginationMeta, headers?: HeadersInit, data?: T): Response
}

/** Unified meta structure */
export interface MetaBase {
	readonly requestId: string
	readonly path: string
	readonly status: number
	readonly timestamp: string
	readonly responseTimeMs: number
	readonly message: string
	readonly extra?: unknown
}

/** Pagination metadata */
export interface PaginationMeta {
	readonly page: number
	readonly limit: number
	readonly total: number
	readonly totalPages: number
}

/** Final response format */
export interface FinalResponse<T = unknown> {
	readonly meta: MetaBase
	readonly data: T | null
}

/**
 * Computes the elapsed time for the request.
 */
function getResponseTime(ctx: Context<State>): number {
	return parseFloat((performance.now() - ctx.state.request.startTime).toFixed(2))
}

/**
 * Creates the unified `meta` object.
 */
function buildMeta(ctx: Context<State>, status: number, message: string, extra?: unknown): MetaBase {
	return {
		requestId: uuidv7({ msecs: Date.now() }),
		path: ctx.url.pathname,
		status,
		timestamp: new Date().toISOString(),
		responseTimeMs: getResponseTime(ctx),
		message,
		extra,
	}
}

/**
 * Produces the final standard response wrapper.
 */
function buildResponse<T>(meta: MetaBase, data: T | null): FinalResponse<T> {
	return { meta, data }
}

/**
 * Merges default headers with custom headers.
 */
function buildHeaders(ctx: Context<State>, headers?: HeadersInit): HeadersInit {
	return {
		'Content-Type': 'application/json',
		'X-Response-Time': String(getResponseTime(ctx)),
		...headers,
	}
}

/**
 * Final JSON Response generator.
 */
function send<T>(ctx: Context<State>, status: number, meta: MetaBase, data: T | null, headers?: HeadersInit): Response {
	return Response.json(buildResponse(meta, data), {
		status,
		headers: buildHeaders(ctx, headers),
	})
}

export const httpSuccess: HttpSuccess = {
	/** 200 OK — with optional data */
	ok<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 200, message)
		return send(ctx, 200, meta, data ?? null, headers)
	},

	/** 200 OK — without data */
	okNoData(ctx: Context<State>, message: string, headers?: HeadersInit): Response {
		const meta: MetaBase = buildMeta(ctx, 200, message)
		return send(ctx, 200, meta, null, headers)
	},

	/** 200 OK — with metadata */
	okWithMeta<T, M>(ctx: Context<State>, message: string, metaData: M, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 200, message, metaData)
		return send(ctx, 200, meta, data ?? null, headers)
	},

	/** 201 Created */
	created<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 201, message)
		return send(ctx, 201, meta, data ?? null, headers)
	},

	/** 202 Accepted */
	accepted(ctx: Context<State>, message = 'Request accepted for processing', headers?: HeadersInit): Response {
		const meta: MetaBase = buildMeta(ctx, 202, message)
		return send(ctx, 202, meta, null, headers)
	},

	/** 202 Accepted + data */
	acceptedWithData<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 202, message)
		return send(ctx, 202, meta, data ?? null, headers)
	},

	/** 203 Non-Authoritative Information */
	nonAuthoritativeInfo<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 203, message)
		return send(ctx, 203, meta, data ?? null, headers)
	},

	/** 204 No Content */
	noContent(ctx: Context<State>, headers?: HeadersInit): Response {
		const mergedHeaders = buildHeaders(ctx, headers)
		return new Response(null, { status: 204, headers: mergedHeaders })
	},

	/** 205 Reset Content */
	resetContent(ctx: Context<State>, headers?: HeadersInit): Response {
		const mergedHeaders = buildHeaders(ctx, headers)
		return new Response(null, { status: 205, headers: mergedHeaders })
	},

	/** 206 Partial Content */
	partialContent<T>(ctx: Context<State>, message: string, contentRange: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 206, message)
		const newHeaders = { ...headers, 'Content-Range': contentRange }
		return send(ctx, 206, meta, data ?? null, newHeaders)
	},

	/** 207 Multi-Status */
	multiStatus<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 207, message)
		return send(ctx, 207, meta, data ?? null, headers)
	},

	/** 208 Already Reported */
	alreadyReported<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 208, message)
		return send(ctx, 208, meta, data ?? null, headers)
	},

	/** 226 IM Used */
	imUsed<T>(ctx: Context<State>, message: string, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 226, message)
		return send(ctx, 226, meta, data ?? null, headers)
	},

	/** Paginated (200 OK with pagination meta) */
	paginated<T extends ReadonlyArray<unknown>>(ctx: Context<State>, message: string, pagination: PaginationMeta, headers?: HeadersInit, data?: T): Response {
		const meta: MetaBase = buildMeta(ctx, 200, message, { pagination })
		return send(ctx, 200, meta, data ?? null, headers)
	},
} as const

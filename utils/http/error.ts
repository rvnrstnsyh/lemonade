import { Context } from 'fresh'
import { State } from '@/utils.ts'

/**
 * Comprehensive HTTP error handler providing standardized error responses
 * for all HTTP status codes (4xx and 5xx).
 *
 * @module httpError
 *
 * =============================================================================
 * HTTP ERROR HANDLER
 * =============================================================================
 *
 * 1. TYPES & INTERFACES
 *    - ApiError
 *    - ErrorResponse
 *    - ErrorWithDetailsOptions
 *    - SimpleErrorOptions
 *    - HttpError
 *
 * 2. UTILITIES
 *    - createErrorResponse()
 *
 * 3. CLIENT ERRORS (4xx)
 *    400 - Bad Request
 *    401 - Unauthorized
 *    402 - Payment Required
 *    403 - Forbidden
 *    404 - Not Found
 *    405 - Method Not Allowed
 *    406 - Not Acceptable
 *    407 - Proxy Authentication Required
 *    408 - Request Timeout
 *    409 - Conflict
 *    410 - Gone
 *    411 - Length Required
 *    412 - Precondition Failed
 *    413 - Payload Too Large
 *    414 - URI Too Long
 *    415 - Unsupported Media Type
 *    416 - Range Not Satisfiable
 *    417 - Expectation Failed
 *    418 - I'm a Teapot
 *    421 - Misdirected Request
 *    422 - Unprocessable Entity
 *    423 - Locked
 *    424 - Failed Dependency
 *    425 - Too Early
 *    426 - Upgrade Required
 *    428 - Precondition Required
 *    429 - Too Many Requests
 *    431 - Request Header Fields Too Large
 *    451 - Unavailable For Legal Reasons
 *
 * 4. SERVER ERRORS (5xx)
 *    500 - Internal Server Error
 *    501 - Not Implemented
 *    502 - Bad Gateway
 *    503 - Service Unavailable
 *    504 - Gateway Timeout
 *    505 - HTTP Version Not Supported
 *    506 - Variant Also Negotiates
 *    507 - Insufficient Storage
 *    508 - Loop Detected
 *    510 - Not Extended
 *    511 - Network Authentication Required
 *
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 *
 * @example Basic Usage
 * ```typescript
 * import { httpError } from '@/utils/errors.ts'
 *
 * ## Simple error
 * return httpError.notFound(ctx, 'User not found')
 *
 * ## With validation errors
 * return httpError.unprocessableEntity(ctx, 'Validation failed', [
 *   { field: 'email', message: 'Invalid email format' }
 * ])
 *
 * ## With rate limiting
 * return httpError.tooManyRequests(ctx, 'Rate limit exceeded', 60)
 * ```
 *
 * =============================================================================
 * RESPONSE FORMAT
 * =============================================================================
 *
 * All error responses follow this structure:
 *
 * ```json
 * {
 *   "status": 404,
 *   "message": "Resource not found",
 *   "timestamp": "2025-11-18T10:30:00.000Z",
 *   "responseTimeMs": 12.34,
 *   "code": "NOT_FOUND",
 *   "details": "Additional context",
 *   "errors": [
 *     { "field": "email", "message": "Invalid format" }
 *   ]
 * }
 * ```
 *
 * =============================================================================
 */

/**
 * Individual API error structure.
 */
interface ApiError {
	readonly message: string
	readonly field?: string
}

/**
 * Base error response structure.
 */
interface ErrorResponse {
	readonly meta: {
		readonly requestId: string
		readonly path: string
		readonly status: number
		readonly message: string
		readonly timestamp: string
		readonly responseTimeMs: number
		readonly errors?: ReadonlyArray<ApiError>
		readonly code?: string
		readonly details?: string
	}
}

/**
 * Options for error response with errors array.
 */
interface ErrorWithDetailsOptions {
	readonly message: string
	readonly errors: ReadonlyArray<ApiError>
	readonly code?: string
	readonly details?: string
}

/**
 * Options for simple error response.
 */
interface SimpleErrorOptions {
	readonly message: string
	readonly code?: string
	readonly details?: string
}

interface HttpError {
	// ==================== 4xx Client Errors ====================
	badRequest(ctx: Context<State>, message?: string, errors?: ReadonlyArray<ApiError>, code?: string, headers?: HeadersInit): Response
	unauthorized(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	paymentRequired(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	forbidden(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	notFound(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	methodNotAllowed(ctx: Context<State>, message?: string, allowedMethods?: ReadonlyArray<string>, headers?: HeadersInit): Response
	notAcceptable(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	proxyAuthRequired(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	requestTimeout(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	conflict(ctx: Context<State>, message?: string, errors?: ReadonlyArray<ApiError>, code?: string, headers?: HeadersInit): Response
	gone(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	lengthRequired(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	preconditionFailed(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	payloadTooLarge(ctx: Context<State>, message?: string, maxSize?: string, headers?: HeadersInit): Response
	uriTooLong(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	unsupportedMediaType(ctx: Context<State>, message?: string, supportedTypes?: ReadonlyArray<string>, headers?: HeadersInit): Response
	rangeNotSatisfiable(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	expectationFailed(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	imATeapot(ctx: Context<State>, message?: string, headers?: HeadersInit): Response
	misdirectedRequest(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	unprocessableEntity(ctx: Context<State>, message?: string, errors?: ReadonlyArray<ApiError>, code?: string, headers?: HeadersInit): Response
	locked(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	failedDependency(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	tooEarly(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	upgradeRequired(ctx: Context<State>, message?: string, requiredProtocol?: string, headers?: HeadersInit): Response
	preconditionRequired(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	tooManyRequests(ctx: Context<State>, message?: string, retryAfter?: number, headers?: HeadersInit): Response
	requestHeaderFieldsTooLarge(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	unavailableForLegalReasons(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	// ==================== 5xx Server Errors ====================
	internalServerError(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	notImplemented(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	badGateway(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	serviceUnavailable(ctx: Context<State>, message?: string, retryAfter?: number, headers?: HeadersInit): Response
	gatewayTimeout(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	httpVersionNotSupported(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	variantAlsoNegotiates(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	insufficientStorage(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	loopDetected(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
	notExtended(ctx: Context<State>, message?: string, code?: string, headers?: HeadersInit): Response
	networkAuthenticationRequired(ctx: Context<State>, message?: string, code?: string, details?: string, headers?: HeadersInit): Response
}

/**
 * Creating an error response
 */
function createErrorResponse(
	ctx: Context<State>,
	status: number,
	options: SimpleErrorOptions | ErrorWithDetailsOptions,
	headers?: HeadersInit,
): Response {
	const responseTimeMs: number = parseFloat((performance.now() - ctx.state.request.startTime).toFixed(2))
	const response: ErrorResponse = {
		meta: {
			requestId: ctx.state.request._id,
			path: ctx.url.pathname,
			status,
			message: options.message,
			timestamp: new Date().toISOString(),
			responseTimeMs,
			...(options.code && { code: options.code }),
			...(options.details && { details: options.details }),
			...('errors' in options && options.errors.length > 0 && { errors: options.errors }),
		},
	}
	const defaultHeaders: HeadersInit = {
		'X-Response-Time': String(responseTimeMs),
		'Content-Type': 'application/json',
	}

	return Response.json(response, { status, headers: { ...defaultHeaders, ...headers } })
}

/**
 * Complete Error Handler for all HTTP status codes.
 */
export const httpError: HttpError = {
	// ==================== 4xx Client Errors ====================

	/**
	 * 400 Bad Request
	 * Invalid or malformed request.
	 */
	badRequest(
		ctx: Context<State>,
		message: string = '400 Bad Request',
		errors?: ReadonlyArray<ApiError>,
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			400,
			{ message, code: code || 'BAD_REQUEST', ...(errors && { errors }) },
			headers,
		)
	},

	/**
	 * 401 Unauthorized
	 * Authentication required or failed.
	 */
	unauthorized(
		ctx: Context<State>,
		message: string = '401 Unauthorized',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			401,
			{ message, code: code || 'UNAUTHORIZED', details },
			headers,
		)
	},

	/**
	 * 402 Payment Required
	 * Payment is required to access resources.
	 */
	paymentRequired(
		ctx: Context<State>,
		message: string = '402 Payment Required',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			402,
			{ message, code: code || 'PAYMENT_REQUIRED', details },
			headers,
		)
	},

	/**
	 * 403 Forbidden
	 * User does not have permission.
	 */
	forbidden(
		ctx: Context<State>,
		message: string = '403 Forbidden',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			403,
			{ message, code: code || 'FORBIDDEN', details },
			headers,
		)
	},

	/**
	 * 404 Not Found
	 * Resource not found.
	 */
	notFound(
		ctx: Context<State>,
		message: string = '404 Not Found',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			404,
			{ message, code: code || 'NOT_FOUND', details },
			headers,
		)
	},

	/**
	 * 405 Method Not Allowed
	 * HTTP method is not allowed for this endpoint.
	 */
	methodNotAllowed(
		ctx: Context<State>,
		message: string = '405 Method Not Allowed',
		allowedMethods?: ReadonlyArray<string>,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			405,
			{ message, code: 'METHOD_NOT_ALLOWED', details: allowedMethods ? `Allowed methods: ${allowedMethods.join(', ')}` : undefined },
			{ ...headers, ...(allowedMethods && { 'Allow': allowedMethods.join(', ') }) },
		)
	},

	/**
	 * 406 Not Acceptable
	 * The server was unable to produce a response acceptable to the client.
	 */
	notAcceptable(
		ctx: Context<State>,
		message: string = '406 Not Acceptable',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			406,
			{ message, code: code || 'NOT_ACCEPTABLE', details },
			headers,
		)
	},

	/**
	 * 407 Proxy Authentication Required
	 * Proxy authentication is required.
	 */
	proxyAuthRequired(
		ctx: Context<State>,
		message: string = '407 Proxy Authentication Required',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			407,
			{ message, code: code || 'PROXY_AUTH_REQUIRED' },
			headers,
		)
	},

	/**
	 * 408 Request Timeout
	 * Request timeout.
	 */
	requestTimeout(
		ctx: Context<State>,
		message: string = '408 Request Timeout',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			408,
			{ message, code: code || 'REQUEST_TIMEOUT', details },
			headers,
		)
	},

	/**
	 * 409 Conflict
	 * Request conflict with current state.
	 */
	conflict(
		ctx: Context<State>,
		message: string = '409 Conflict',
		errors?: ReadonlyArray<ApiError>,
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			409,
			{ message, code: code || 'CONFLICT', ...(errors && { errors }) },
			headers,
		)
	},

	/**
	 * 410 Gone
	 * The resource is no longer permanently available.
	 */
	gone(
		ctx: Context<State>,
		message: string = '410 Gone',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			410,
			{ message, code: code || 'GONE', details },
			headers,
		)
	},

	/**
	 * 411 Length Required
	 * Content-Length header is required.
	 */
	lengthRequired(
		ctx: Context<State>,
		message: string = '411 Length Required',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			411,
			{ message, code: code || 'LENGTH_REQUIRED' },
			headers,
		)
	},

	/**
	 * 412 Precondition Failed
	 * The given precondition failed.
	 */
	preconditionFailed(
		ctx: Context<State>,
		message: string = '412 Precondition Failed',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			412,
			{ message, code: code || 'PRECONDITION_FAILED', details },
			headers,
		)
	},

	/**
	 * 413 Payload Too Large
	 * Request entity too large.
	 */
	payloadTooLarge(
		ctx: Context<State>,
		message: string = '413 Payload Too Large',
		maxSize?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			413,
			{ message, code: 'PAYLOAD_TOO_LARGE', details: maxSize ? `Maximum allowed size: ${maxSize}` : undefined },
			headers,
		)
	},

	/**
	 * 414 URI Too Long
	 * URI is too long.
	 */
	uriTooLong(
		ctx: Context<State>,
		message: string = '414 URI Too Long',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			414,
			{ message, code: code || 'URI_TOO_LONG' },
			headers,
		)
	},

	/**
	 * 415 Unsupported Media Type
	 * Media type not supported.
	 */
	unsupportedMediaType(
		ctx: Context<State>,
		message: string = '415 Unsupported Media Type',
		supportedTypes?: ReadonlyArray<string>,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			415,
			{ message, code: 'UNSUPPORTED_MEDIA_TYPE', details: supportedTypes ? `Supported types: ${supportedTypes.join(', ')}` : undefined },
			headers,
		)
	},

	/**
	 * 416 Range Not Satisfiable
	 * The requested range cannot be met.
	 */
	rangeNotSatisfiable(
		ctx: Context<State>,
		message: string = '416 Range Not Satisfiable',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			416,
			{ message, code: code || 'RANGE_NOT_SATISFIABLE', details },
			headers,
		)
	},

	/**
	 * 417 Expectation Failed
	 * The expectations given cannot be met.
	 */
	expectationFailed(
		ctx: Context<State>,
		message: string = '417 Expectation Failed',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			417,
			{ message, code: code || 'EXPECTATION_FAILED' },
			headers,
		)
	},

	/**
	 * 418 I'm a teapot (RFC 2324 - April Fools' joke).
	 */
	imATeapot(
		ctx: Context<State>,
		message: string = "418 I'm a teapot",
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			418,
			{ message, code: 'IM_A_TEAPOT' },
			headers,
		)
	},

	/**
	 * 421 Misdirected Request
	 * The request was directed to a server that was unable to provide a response.
	 */
	misdirectedRequest(
		ctx: Context<State>,
		message: string = '421 Misdirected Request',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			421,
			{ message, code: code || 'MISDIRECTED_REQUEST' },
			headers,
		)
	},

	/**
	 * 422 Unprocessable Entity
	 * Request well-formed but semantic errors (validation).
	 */
	unprocessableEntity(
		ctx: Context<State>,
		message: string = '422 Unprocessable Entity',
		errors?: ReadonlyArray<ApiError>,
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			422,
			{
				message,
				code: code || 'UNPROCESSABLE_ENTITY',
				...(errors && errors.length > 0 && { errors }),
			},
			headers,
		)
	},

	/**
	 * 423 Locked
	 * Accessed resource is locked.
	 */
	locked(
		ctx: Context<State>,
		message: string = '423 Locked',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			423,
			{ message, code: code || 'LOCKED', details },
			headers,
		)
	},

	/**
	 * 424 Failed Dependency
	 * The request failed because the previous request failed.
	 */
	failedDependency(
		ctx: Context<State>,
		message: string = '424 Failed Dependency',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			424,
			{ message, code: code || 'FAILED_DEPENDENCY', details },
			headers,
		)
	},

	/**
	 * 425 Too Early
	 * The server does not want to process a request that may be replayed.
	 */
	tooEarly(
		ctx: Context<State>,
		message: string = '425 Too Early',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			425,
			{ message, code: code || 'TOO_EARLY' },
			headers,
		)
	},

	/**
	 * 426 Upgrade Required
	 * Client must upgrade protocol.
	 */
	upgradeRequired(
		ctx: Context<State>,
		message: string = '426 Upgrade Required',
		requiredProtocol?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			426,
			{ message, code: 'UPGRADE_REQUIRED', details: requiredProtocol ? `Required protocol: ${requiredProtocol}` : undefined },
			{ ...headers, ...(requiredProtocol && { 'Upgrade': requiredProtocol }) },
		)
	},

	/**
	 * 428 Precondition Required
	 * Request must be conditional.
	 */
	preconditionRequired(
		ctx: Context<State>,
		message: string = '428 Precondition Required',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			428,
			{ message, code: code || 'PRECONDITION_REQUIRED', details },
			headers,
		)
	},

	/**
	 * 429 Too Many Requests
	 * User sent too many requests.
	 */
	tooManyRequests(
		ctx: Context<State>,
		message: string = '429 Too Many Requests',
		retryAfter?: number,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			429,
			{ message, code: 'RATE_LIMIT_EXCEEDED', details: retryAfter ? `Retry after ${retryAfter} seconds` : undefined },
			{ ...headers, ...(retryAfter && { 'Retry-After': retryAfter.toString() }) },
		)
	},

	/**
	 * 431 Request Header Fields Too Large
	 * Request header fields are too large.
	 */
	requestHeaderFieldsTooLarge(
		ctx: Context<State>,
		message: string = '431 Request Header Fields Too Large',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			431,
			{ message, code: code || 'HEADER_FIELDS_TOO_LARGE' },
			headers,
		)
	},

	/**
	 * 451 Unavailable For Legal Reasons
	 * Resource not available for legal reasons.
	 */
	unavailableForLegalReasons(
		ctx: Context<State>,
		message: string = '451 Unavailable For Legal Reasons',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			451,
			{ message, code: code || 'LEGAL_RESTRICTION', details },
			headers,
		)
	},

	// ==================== 5xx Server Errors ====================

	/**
	 * 500 Internal Server Error
	 * Generic server error.
	 */
	internalServerError(
		ctx: Context<State>,
		message: string = '500 Internal Server Error',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			500,
			{ message, code: code || 'INTERNAL_SERVER_ERROR', details },
			headers,
		)
	},

	/**
	 * 501 Not Implemented
	 * The server does not recognize the method or does not support it.
	 */
	notImplemented(
		ctx: Context<State>,
		message: string = '501 Not Implemented',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			501,
			{ message, code: code || 'NOT_IMPLEMENTED', details },
			headers,
		)
	},

	/**
	 * 502 Bad Gateway
	 * The server received an invalid response from the upstream server.
	 */
	badGateway(
		ctx: Context<State>,
		message: string = '502 Bad Gateway',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			502,
			{ message, code: code || 'BAD_GATEWAY', details },
			headers,
		)
	},

	/**
	 * 503 Service Unavailable
	 * Server temporarily unavailable (maintenance, overloaded).
	 */
	serviceUnavailable(
		ctx: Context<State>,
		message: string = '503 Service Unavailable',
		retryAfter?: number,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			503,
			{
				message,
				code: 'SERVICE_UNAVAILABLE',
				details: retryAfter ? `Service will be available after ${retryAfter} seconds` : 'Service is temporarily unavailable',
			},
			{ ...headers, ...(retryAfter && { 'Retry-After': retryAfter.toString() }) },
		)
	},

	/**
	 * 504 Gateway Timeout
	 * The server did not receive a timely response from upstream.
	 */
	gatewayTimeout(
		ctx: Context<State>,
		message: string = '504 Gateway Timeout',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			504,
			{ message, code: code || 'GATEWAY_TIMEOUT', details },
			headers,
		)
	},

	/**
	 * 505 HTTP Version Not Supported
	 * HTTP version not supported.
	 */
	httpVersionNotSupported(
		ctx: Context<State>,
		message: string = '505 HTTP Version Not Supported',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			505,
			{ message, code: code || 'HTTP_VERSION_NOT_SUPPORTED' },
			headers,
		)
	},

	/**
	 * 506 Variant Also Negotiates
	 * Server configuration error.
	 */
	variantAlsoNegotiates(
		ctx: Context<State>,
		message: string = '506 Variant Also Negotiates',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			506,
			{ message, code: code || 'VARIANT_ALSO_NEGOTIATES' },
			headers,
		)
	},

	/**
	 * 507 Insufficient Storage
	 * The server does not have enough storage.
	 */
	insufficientStorage(
		ctx: Context<State>,
		message: string = '507 Insufficient Storage',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			507,
			{ message, code: code || 'INSUFFICIENT_STORAGE', details },
			headers,
		)
	},

	/**
	 * 508 Loop Detected
	 * Server detected an infinite loop.
	 */
	loopDetected(
		ctx: Context<State>,
		message: string = '508 Loop Detected',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			508,
			{ message, code: code || 'LOOP_DETECTED', details },
			headers,
		)
	},

	/**
	 * 510 Not Extended
	 * Further extensions required.
	 */
	notExtended(
		ctx: Context<State>,
		message: string = '510 Not Extended',
		code?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			510,
			{ message, code: code || 'NOT_EXTENDED' },
			headers,
		)
	},

	/**
	 * 511 Network Authentication Required
	 * Client must authenticate for network access.
	 */
	networkAuthenticationRequired(
		ctx: Context<State>,
		message: string = '511 Network Authentication Required',
		code?: string,
		details?: string,
		headers?: HeadersInit,
	): Response {
		return createErrorResponse(
			ctx,
			511,
			{ message, code: code || 'NETWORK_AUTH_REQUIRED', details },
			headers,
		)
	},
} as const

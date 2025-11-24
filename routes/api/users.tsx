import { Context } from 'fresh'
import { define, State } from '@/utils.ts'
import { httpSuccess } from '@/utils/http/success.ts'
import { createPagination, PaginationResult } from '@/utils/common/pagination.ts'

export const handler: RouteHandlers = define.handlers({
	GET(ctx: Context<State>): Response | Promise<Response> {
		// Get page and limit from query
		const url: URL = new URL(ctx.req.url)
		const page: number = Number(url.searchParams.get('page'))
		const limit: number = Number(url.searchParams.get('limit'))
		// Total sample of database
		const total: number = 42
		// Generate pagination meta
		const pagination: PaginationResult = createPagination({ page, limit }, total)
		// Dummy data according to offset + limit
		const data: Array<{ id: number; name: string }> = Array.from({ length: pagination.limit }, (_, i): { id: number; name: string } => ({
			id: pagination.offset + i + 1,
			name: `User ${pagination.offset + i + 1}`,
		}))

		return httpSuccess.paginated(ctx, 'Users fetched successfully', pagination, undefined, data)
	},
})

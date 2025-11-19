export interface PaginationInput {
	page?: number
	limit?: number
}

export interface PaginationResult {
	page: number
	limit: number
	offset: number
	total: number
	totalPages: number
}

export function createPagination(input: PaginationInput, total: number, defaultLimit = 10): PaginationResult {
	const page: number = Math.max(1, Number(input.page) || 1)
	const limit: number = Math.max(1, Number(input.limit) || defaultLimit)
	const totalPages: number = Math.max(1, Math.ceil(total / limit))

	return { page, limit, offset: (page - 1) * limit, total, totalPages }
}

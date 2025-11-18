import { Context } from 'fresh'
import { define, State } from '@/utils.ts'

export const handler: RouteHandlers = define.handlers({
	GET(ctx: Context<State>) {
		const name: string = ctx.params.name
		const responseTime: string = (performance.now() - ctx.state.request.startTime).toFixed(2)

		return Response.json({
			status: 200,
			message: `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
			timestamp: new Date().toISOString(),
			responseTime: responseTime + ' ms',
			data: {
				name: name,
			},
		}, { status: 200, headers: { 'X-Response-Time': responseTime } })
	},
})

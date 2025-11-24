import { Context } from 'fresh'
import { State } from '@/utils.ts'

declare global {
	interface RouteHandlers {
		GET?(ctx: Context<State>): Response | Promise<Response>
		POST?(ctx: Context<State>): Response | Promise<Response>
		PUT?(ctx: Context<State>): Response | Promise<Response>
		PATCH?(ctx: Context<State>): Response | Promise<Response>
		DELETE?(ctx: Context<State>): Response | Promise<Response>
		HEAD?(ctx: Context<State>): Response | Promise<Response>
		OPTIONS?(ctx: Context<State>): Response | Promise<Response>
		CONNECT?(ctx: Context<State>): Response | Promise<Response>
		TRACE?(ctx: Context<State>): Response | Promise<Response>
	}
}

export {}

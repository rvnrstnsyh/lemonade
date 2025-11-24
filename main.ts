import { v7 as uuidv7 } from 'uuid'
import { define, type State } from '@/utils.ts'
import { httpError } from '@/utils/http/error.ts'
import { App, Context, cors, csrf, staticFiles, trailingSlashes } from 'fresh'

export const app: App<State> = new App<State>()

// Get the primary hostname from the environment variables.
const hostname: string | undefined = Deno.env.get('APP_HOSTNAME')
// Check if the environment is in development mode.
const isDev: boolean = Deno.env.get('MODE') === 'development'

/**
 * Utility function to create a regex for validating allowed origins.
 * - Supports http/https
 * - Allows optional subdomains and port numbers
 * - Escapes special characters to prevent regex injection
 */
function makeOriginRegex(host: string): RegExp {
	return new RegExp(
		`^https?:\\/\\/([a-zA-Z0-9-]+\\.)?${host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?::\\d+)?$`,
	)
}

/**
 * Validate if an origin is allowed.
 * - Allows any subdomain of APP_HOSTNAME
 * - Allows localhost/127.0.0.1 during development mode
 */
function allowedOrigins(origin: string): boolean {
	// Allow localhost and 127.0.0.1 only in development mode
	if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
		return true
	}
	if (!hostname) return false
	return makeOriginRegex(hostname).test(origin)
}

app
	// Disable trailing slashes
	.use(trailingSlashes('never'))
	// Enable CORS protection
	.use(cors({
		origin: (origin: string, _ctx: Context<State>): string | undefined => {
			if (!origin) return undefined
			// Return the origin only if it's allowed, otherwise undefined (CORS denied)
			return allowedOrigins(origin) ? origin : undefined
		},
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	}))
	// Enable CSRF protection
	.use(csrf({
		origin: (origin: string | undefined): boolean => {
			if (!origin) return false
			// Return true only if origin is valid
			return allowedOrigins(origin)
		},
	}))
	// Serve static files (CSS, JS, images, etc.)
	.use(staticFiles())
	.use(define.middleware(async (ctx: Context<State>): Promise<Response> => {
		ctx.state.request = {
			_id: uuidv7({ msecs: new Date().getTime() }),
			startTime: performance.now(),
		}
		const response: Response = await ctx.next()
		// deno-lint-ignore no-console
		console.log(`${new Date().toISOString()} - ${ctx.req.method} ${ctx.req.url} - ${(performance.now() - ctx.state.request.startTime).toFixed(2)}ms`)
		return response
	}))
	.notFound((ctx: Context<State>): Response => httpError.notFound(ctx, '404 Not Found'))
	.onError('*', (ctx: Context<State>): Response => {
		// deno-lint-ignore no-console
		console.log(ctx.error)
		return httpError.internalServerError(ctx, '500 Internal Server Error')
	})
	// Include file-system based routes here
	.fsRoutes()

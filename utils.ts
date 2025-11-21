import { createDefine, Define } from 'fresh'

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State<T = unknown> {
	request: {
		startTime: number
		body?: T
	}
}

export const define: Define<State> = createDefine<State>()

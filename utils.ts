import { createDefine, Define } from 'fresh'

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
	request: {
		startTime: number
	}
}

export const define: Define<State> = createDefine<State>()

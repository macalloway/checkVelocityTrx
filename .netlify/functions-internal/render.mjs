import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.0348563a.js","app":"_app/immutable/entry/app.b7fb485e.js","imports":["_app/immutable/entry/start.0348563a.js","_app/immutable/chunks/index.00b09eb9.js","_app/immutable/chunks/singletons.bb695c53.js","_app/immutable/entry/app.b7fb485e.js","_app/immutable/chunks/index.00b09eb9.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});

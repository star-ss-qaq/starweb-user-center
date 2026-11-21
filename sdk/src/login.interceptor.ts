import {
	Context,
	getSfRequest,
	LocationTo,
	type Interceptor,
} from "@thestarweb/star-framework-app-web";
import { getMetadata, initMetadata } from "@thestarweb/star-framework-utils";
import { parseCookie, stringifyCookie } from "cookie";

const metaKey = Symbol();
export function RequireLogin(): ClassDecorator &
	MethodDecorator &
	PropertyDecorator {
	return function (target: object, key?: PropertyKey) {
		initMetadata(target, metaKey, key, []);
	};
}
export interface LoginInfo {
	username: string;
	uid: string;
}
// @side-only server
export function createLoginInterceptor(baseUrl: string): Interceptor {
	return async (prop, next) => {
		const cookie = prop.header.cookie
			? parseCookie(prop.header.cookie)
			: Object.create(null);
		if (cookie.token) {
			const user = await getSfRequest().post(
				"@thestarweb/star-web-user-center-server:/check",
				{
					// @ts-ignore
					header: {
						cookie: stringifyCookie(cookie.token),
					},
				},
			);
			if (user) {
				prop.context.user = user;
				prop.context.uid = user.uid;
			}
		}
		let shouldLogin = false;
		prop.route.allRoute.forEach((r) => {
			const classMeta = getMetadata(r.obj, metaKey, undefined, undefined);
			if (classMeta) {
				shouldLogin = true;
			}
			const keyMeta = getMetadata(r.obj, metaKey, r.propertyKey, undefined);
			if (keyMeta) {
				shouldLogin = true;
			}
		});
		if (shouldLogin && !prop.context.user) {
			return new LocationTo(
				new URL(
					`login?from=${encodeURIComponent(prop.url.pathname + prop.url.search + prop.url.hash)}`,
					baseUrl,
				).toString(),
			);
		}
		return next(prop);
	};
}
export function Uid() {
	return Context("uid");
}
export function User() {
	return Context("user");
}

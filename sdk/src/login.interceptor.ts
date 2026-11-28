import {
	Context,
	getSfRequest,
	ResponseWithMeta,
	type Interceptor,
} from "@thestarweb/star-framework-app-web";
import { RouteInfo } from "@thestarweb/star-framework-route";
import { getMetadata, initMetadata } from "@thestarweb/star-framework-utils";
import { parseCookie, stringifyCookie } from "cookie";
import { PermissionNames } from "./types";

const metaKey = Symbol();
export function RequireLogin(
	withPermission?: PermissionNames,
): ClassDecorator & MethodDecorator & PropertyDecorator {
	return function (target: object, key?: PropertyKey) {
		const m = initMetadata(target, metaKey, key, []);
		if (withPermission) {
			m.push(withPermission);
		}
	};
}
export function checkShouldLogin(route: RouteInfo) {
	let shouldLogin = false;
	let withPermission: string[] = [];
	route.allRoute.forEach((r) => {
		const classMeta = getMetadata<undefined | string[]>(
			r.obj,
			metaKey,
			undefined,
			undefined,
		);
		if (classMeta) {
			withPermission.push(...classMeta);
			shouldLogin = true;
		}
		const keyMeta = getMetadata<undefined | string[]>(
			r.obj,
			metaKey,
			r.propertyKey,
			undefined,
		);
		if (keyMeta) {
			withPermission.push(...keyMeta);
			shouldLogin = true;
		}
	});
	return { shouldLogin, withPermission };
}

export interface LoginInfo {
	username: string;
	uid: number;
}
// @side-only server
export function createLoginInterceptor(baseUrl: string): Interceptor {
	return async (prop, next) => {
		const cookie = prop.header.cookie
			? parseCookie(prop.header.cookie)
			: Object.create(null);
		let { shouldLogin } = checkShouldLogin(prop.route);
		if (cookie.token) {
			const user = await getSfRequest().post(
				"@thestarweb/star-web-user-center-server:/check",
				{
					// @ts-ignore
					header: {
						cookie: stringifyCookie({ token: cookie.token }),
						"user-agent": prop.header["user-agent"],
					},
				},
			);
			if (user) {
				prop.context.user = user;
				prop.context.uid = user.uid;
			}
		}
		if (shouldLogin && !prop.context.user) {
			return new ResponseWithMeta(null, { code: 401 });
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

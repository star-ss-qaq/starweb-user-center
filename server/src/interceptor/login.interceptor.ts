import { LoginService } from "@/service/login.service";
import {
	Context,
	LocationTo,
	type Interceptor,
} from "@thestarweb/star-framework-app-web";
import { getMetadata, initMetadata } from "@thestarweb/star-framework-utils";
import { setCookie } from "./cookie.interceptor";
import { checkShouldLogin } from "@thestarweb/star-web-user-center-sdk";
import { PermissionService } from "@/service/permission.service";

export interface LoginInfo {
	username: string;
	uid: number;
}
// @side-only server
export function createLoginInterceptor(
	loginService: LoginService,
	permissionService: PermissionService,
): Interceptor {
	return async (prop, next) => {
		if (prop.context.cookie?.token) {
			const user = await loginService.checkToken(
				prop.context.cookie.token,
				prop.header["user-agent"],
				prop.context.ip,
			);
			if (user) {
				prop.context.user = user;
				prop.context.uid = user.uid;
				if (user.newToken) {
					setCookie({ name: "token", value: user.newToken });
				}
			}
		}
		let { shouldLogin, withPermission } = checkShouldLogin(prop.route);
		if (shouldLogin && !prop.context.user) {
			return new LocationTo(
				`${prop.context.prefix}login?from=${encodeURIComponent(prop.url.pathname + prop.url.search + prop.url.hash)}`,
			);
		}
		if (withPermission.length > 0) {
			if (!prop.context.user) {
				return new LocationTo(
					`${prop.context.prefix}login?from=${encodeURIComponent(prop.url.pathname + prop.url.search + prop.url.hash)}`,
				);
			}
			const res = await Promise.all(
				withPermission.map((i) =>
					permissionService.checkPermission(prop.context.user.uid, "sucs", i),
				),
			);
			if (res.some((i) => !i)) {
				throw new Error("权限不足");
			}
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

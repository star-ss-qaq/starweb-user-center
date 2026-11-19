import { LoginService } from "@/service/login.service";
import {
	Context,
	LocationTo,
	type Interceptor,
} from "@thestarweb/star-framework-app-web";
import { getMetadata, initMetadata } from "@thestarweb/star-framework-utils";
import { setCookie } from "./cookie.interceptor";

const metaKey = Symbol();
export function RequireLogin(): ClassDecorator &
	MethodDecorator &
	PropertyDecorator {
	return function (target: object, key?: PropertyKey) {
		initMetadata(target, metaKey, key, []);
	};
}
// @side-only server
export function createLoginInterceptor(
	loginService: LoginService,
): Interceptor {
	return async (prop, next) => {
		if (prop.context.cookie?.token) {
			const user = await loginService.checkToken(prop.context.cookie.token);
			if (user) {
				prop.context.user = user;
				prop.context.uid = user.uid;
				if (user.newToken) {
					setCookie({ name: "token", value: user.newToken });
				}
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
			return new LocationTo("/login");
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

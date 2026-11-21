import { Interceptor } from "@thestarweb/star-framework-app-web";
import { AsyncLocalStorage } from "async_hooks";
import { Cookies, parseCookie, SetCookie, stringifySetCookie } from "cookie";
const cookieContext = new AsyncLocalStorage<{
	cookie: Cookies;
	setCookies: Record<string, SetCookie>;
}>();

export const cookieInterceptor: Interceptor = async (prop, next) => {
	const cookie = prop.header.cookie
		? parseCookie(prop.header.cookie)
		: Object.create(null);
	const setCookies: Record<string, SetCookie> = Object.create(null);
	const ret = await cookieContext.run({ cookie, setCookies }, next, {
		...prop,
		context: { ...prop.context, cookie },
	});
	if (Object.keys(setCookies).length > 0) {
		return {
			...ret,
			header: {
				...ret.header,
				"set-cookie": Object.values(setCookies).map((c) =>
					stringifySetCookie(c),
				),
			},
		};
	}
	return ret;
};
export function setCookie(cookie: SetCookie) {
	const context = cookieContext.getStore();
	if (context) {
		context.setCookies[cookie.name] = cookie;
	}
}

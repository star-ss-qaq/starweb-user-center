export function parseJWT(jwt: string) {
	try {
		return JSON.parse(decodeURIComponent(escape(atob(jwt.split(".")[1]))));
	} catch {}
}

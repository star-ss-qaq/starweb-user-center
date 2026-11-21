import Cookies from "js-cookie";
import { LoginInfo } from "./login.interceptor";

export function initWeb(
	baseUrl: string,
	onChange: (user?: LoginInfo, ak?: string) => void,
) {
	const iframe = document.createElement("iframe");
	iframe.style.display = "none";
	const url = new URL("./token-message", baseUrl);
	iframe.src = url.toString();
	window.addEventListener("message", (ev) => {
		if (ev.origin === url.origin) {
			Cookies.set("token", ev.data.authToken!);
			onChange(ev.data);
		}
	});
	document.body.append(iframe);
}

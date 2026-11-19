import { AddInterceptor, SubRoute } from "@thestarweb/star-framework-app-web";
import { Inject } from "@thestarweb/star-framework-di";
import { PublicRoute } from "./public/index.js";
import { cookieInterceptor } from "@/interceptor/cookie.interceptor.js";
import { HomeRoute } from "./home/index.js";
import { addInterceptor } from "@thestarweb/star-framework-app-web/src/interceptor/index.js";
import { createLoginInterceptor } from "@/interceptor/login.interceptor.js";
import { LoginService } from "@/service/login.service.js";

@AddInterceptor([cookieInterceptor])
export class Route {
	constructor(private loginService: SFSideOnly<"server", LoginService>) {
		SFSideSwitch({
			server: addInterceptor(
				[cookieInterceptor, createLoginInterceptor(this.loginService)],
				this,
			),
		});
	}
	@Inject()
	@SubRoute("")
	public!: PublicRoute;

	@Inject()
	@SubRoute("home")
	home!: HomeRoute;
}

import { LoginProp, LoginService } from "@/service/login.service";
import {
	Body,
	Get,
	LocationTo,
	Post,
	View,
} from "@thestarweb/star-framework-app-web";
import { VueRender } from "@thestarweb/star-framework-app-web-vue";
import { Inject } from "@thestarweb/star-framework-di";

export class PublicRoute {
	@SFSideOnly("server")
	@Inject()
	loginService!: LoginService;
	@Get("/")
	index() {
		return new LocationTo("/login");
	}
	@View("login", new VueRender(() => import("@/view/public/login.vue")))
	loginPage() {
		//
	}
	@Post("login")
	async login(@Body() prop: LoginProp) {
		return await this.loginService.login(prop);
	}
}

import { LoginInfo, User } from "@/interceptor/login.interceptor";
import { LoginProp, LoginService } from "@/service/login.service";
import {
	Body,
	Get,
	Header,
	Ip,
	LocationTo,
	Post,
	View,
} from "@thestarweb/star-framework-app-web";
import { VueRender } from "@thestarweb/star-framework-app-web-vue";
import { Prefix } from "@thestarweb/star-framework-app-web/src/params";
import { Inject } from "@thestarweb/star-framework-di";

export class PublicRoute {
	@SFSideOnly("server")
	@Inject()
	loginService!: LoginService;
	@Get("/")
	index(@Prefix() prefix: string, @User() user?: any) {
		if (user) {
			return new LocationTo(`${prefix}home`);
		}
		return new LocationTo(`${prefix}login`);
	}
	@View("login", new VueRender(() => import("@/view/public/login.vue")))
	loginPage() {
		//
	}
	@Post("login")
	async login(
		@Body() prop: Omit<LoginProp, "ip" | "ua">,
		@Ip() ip: string,
		@Header("user-agent") ua: string,
	) {
		return await this.loginService.login({ ...prop, ip, ua });
	}

	@View("register", new VueRender(() => import("@/view/public/register.vue")))
	register: undefined;

	@Post("refreshToken")
	async refreshToken(
		@Body() token: string,
		@Ip() ip: string,
		@Header("user-agent") ua: string,
	) {
		return await this.loginService.refresh(token, ip, ua);
	}
	@Post("check")
	check(@User() user?: LoginInfo): LoginInfo {
		return user!;
	}

	@View(
		"/token-message",
		new VueRender(() => import("@/view/token-message.vue")),
	)
	tokenMessage(@Header("referer") referer: string) {
		const url = new URL(referer);
		return { origin: url.origin };
	}
}

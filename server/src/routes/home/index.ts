import { RequireLogin } from "@/interceptor/login.interceptor";
import { Layout, View } from "@thestarweb/star-framework-app-web";
import { VueRender } from "@thestarweb/star-framework-app-web-vue";

@Layout(new VueRender(() => import("@/view/home/layout.vue")))
@RequireLogin()
export class HomeRoute {
	@View("", new VueRender(() => import("@/view/home/index.vue")))
	index() {
		//
	}
	@View("safe", new VueRender(() => import("@/view/home/safe.vue")))
	safe() {
		//
	}
}

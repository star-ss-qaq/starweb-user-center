import { Layout, View } from "@thestarweb/star-framework-app-web";
import { VueRender } from "@thestarweb/star-framework-app-web-vue";
import { RequireLogin } from "@thestarweb/star-web-user-center-sdk";

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

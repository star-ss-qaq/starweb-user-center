<template>
	<sf-route />
</template>
<script setup lang="ts">
import { authTokenKey, refreshTokenKey } from "@/const/keys";
import { onMounted, ref, provide, shallowRef, watch } from "vue";
import Cookies from "js-cookie";
import { useRequest } from "@thestarweb/star-framework-app-web-vue";
import type { LoginInfo } from "@/interceptor/login.interceptor";
import { parseJWT } from "@/utils/parse-jwt";

const request = useRequest();
const user = shallowRef<null | LoginInfo>(null);
provide("user", user);

let ignoreChange = false;
async function check() {
	const refreshToken = localStorage.getItem(refreshTokenKey);
	if (refreshToken) {
		let needRefresh = true;
		const ak = Cookies.get(authTokenKey);
		if (ak) {
			const ret = parseJWT(ak);
			if (ret) {
				// TODO 需要检查ak是否过期
				user.value = ret;
				needRefresh = false;
			}
		}
		if (needRefresh) {
			const res = await request.post("self:/refreshToken", {
				body: refreshToken,
			});
			if (res.success) {
				localStorage.setItem(refreshTokenKey, res.refreshToken!);
				Cookies.set(authTokenKey, res.authToken!);
				const ret = parseJWT(res.authToken!);
				user.value = ret;
			} else {
				localStorage.removeItem(refreshTokenKey);
				Cookies.remove(authTokenKey);
				user.value = null;
			}
		}
	}
}
onMounted(() => {
	check();
	let channel = new BroadcastChannel("hello");
	channel.addEventListener("message", (ev) => {
		if (ignoreChange) {
			ignoreChange = false;
			return;
		}
		check();
	});
	watch(user, () => {
		if (ignoreChange) {
			ignoreChange = false;
			return;
		}
		ignoreChange = true;
		channel.postMessage("");
	});
});
</script>

<template>
	<div class="login-box" @keypress.enter="handleLogin">
		<h1>登录</h1>
		<Input v-model="data.username" placeholder="用户名" />
		<Input v-model="data.password" placeholder="密码" type="password" />
		<Button theme="primary" :loading="loading" @click="handleLogin">
			登录
		</Button>
		<Button :href="`${prefix}register`">注册</Button>
	</div>
	<footer>
		<Version />
	</footer>
</template>

<script setup lang="ts">
import Version from "@/component/version.vue";
import { authTokenKey, refreshTokenKey } from "@/const/keys";
import { LoginInfo } from "@/interceptor/login.interceptor";
import { LoginMode } from "@/service/login.service";
import { parseJWT } from "@/utils/parse-jwt";
import { usePrefix, useRequest } from "@thestarweb/star-framework-app-web-vue";
import { Button, Input, notification } from "@thestarweb/ui";
import Cookies from "js-cookie";
import { inject, reactive, Ref, ref, watch } from "vue";

const user = inject<Ref<LoginInfo>>("user");
const prefix = usePrefix();
watch(
	() => user,
	() => {
		if (user?.value) {
			const to =
				new URL(location.href).searchParams.get("from") || `${prefix}home`;
			if (to.startsWith("/")) {
				history.pushState(null, "", to);
			} else {
				location.href = to;
			}
		}
	},
	{ deep: true },
);

const data = reactive({ username: "", password: "", mode: LoginMode.UserName });
const request = useRequest();
const loading = ref(false);
async function handleLogin() {
	if (loading.value) return;
	if (!data.username) {
		return;
	}
	if (!data.password) {
		return;
	}
	loading.value = true;
	try {
		const res = await request.post("self:/login", { body: data });
		if (res.success) {
			Cookies.set(authTokenKey, res.authToken);
			localStorage.setItem(refreshTokenKey, res.refreshToken);
			user!.value = parseJWT(authTokenKey);
		} else {
			notification({
				theme: "danger",
				title: "登录失败",
				message: "登录信息有误，请重新输入",
			});
		}
	} catch (e) {
		notification({
			theme: "warning",
			title: "登录失败",
			message:
				e instanceof Error && e.message
					? e.message
					: "服务器响应异常，请稍后重试",
		});
		throw e;
	} finally {
		loading.value = false;
	}
}
</script>
<style scoped>
h1 {
	margin: 0;
}
.login-box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border: 1px solid var(--star-ui-border-color-bold);
	display: flex;
	flex-direction: column;
	padding: calc(2 * var(--star-ui-default-padding));
	gap: var(--star-ui-default-padding);
	border-radius: var(--star-ui-border-radius-base);
}
.login-box-button {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
footer {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translate(-50%, -100%);
}
</style>

<template>
	<div class="login-box" @keypress.enter="handleLogin">
		<h1>登录</h1>
		<Input v-model="data.username" placeholder="用户名" />
		<Input v-model="data.password" placeholder="密码" type="password" />
		<Button theme="primary" @click="handleLogin">登录</Button>
		<Button href="/register">注册</Button>
	</div>
</template>

<script setup lang="ts">
import { LoginMode } from "@/service/login.service";
import { useRequest } from "@thestarweb/star-framework-app-web-vue";
import { Button, Input, Select } from "@thestarweb/ui";
import { reactive, ref } from "vue";
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
</style>

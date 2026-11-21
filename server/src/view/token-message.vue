<template><div></div></template>
<script setup lang="ts">
import { inject, onMounted } from "vue";
import Cookies from "js-cookie";
import { authTokenKey } from "@/const/keys";
import { LoginInfo } from "@/interceptor/login.interceptor";

const { origin } = defineProps<{ origin: string }>();
const user = inject<null | LoginInfo>("user");
function sendData() {
	const ak = Cookies.get(authTokenKey);
	window.parent.postMessage(
		{
			ak,
			user,
		},
		origin,
	);
}
onMounted(() => {
	sendData();
});
</script>

<template><div></div></template>
<script setup lang="ts">
import { inject, onMounted, Ref, watch } from "vue";
import Cookies from "js-cookie";
import { authTokenKey } from "@/const/keys";
import { LoginInfo } from "@/interceptor/login.interceptor";

const { origin } = defineProps<{ origin: string }>();
const user = inject<Ref<null | LoginInfo>>("user");
function sendData() {
	const ak = Cookies.get(authTokenKey);
	window.parent.postMessage(
		{
			ak,
			user: user?.value,
		},
		origin,
	);
}
onMounted(() => {
	if (origin) {
		sendData();
		watch(
			() => user,
			() => sendData(),
			{ deep: true },
		);
	}
});
</script>

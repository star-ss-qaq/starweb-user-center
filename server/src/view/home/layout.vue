<template>
	<Page :menu="menu">
		<sf-route />
		<footer>
			<Version />
		</footer>
	</Page>
</template>
<script setup lang="ts">
import Version from "@/component/version.vue";
import { MenuItem, Page } from "@thestarweb/ui";
const menu: MenuItem[] = [
	{ title: "首页", path: "/home" },
	{ title: "账号安全", path: "/home/safe" },
];
</script>

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
import { usePrefix } from "@thestarweb/star-framework-app-web-vue";
import { MenuItem, Page } from "@thestarweb/ui";
const prefix = usePrefix();
const menu: MenuItem[] = [
	{ title: "首页", path: `${prefix}home` },
	{ title: "账号安全", path: `${prefix}home/safe` },
];
</script>

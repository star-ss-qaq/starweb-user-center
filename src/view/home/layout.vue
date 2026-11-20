<template>
	<Page :menu="menu">
		<!-- <sf-route /> -->
	</Page>
</template>
<script setup lang="ts">
import { MenuItem, Page } from "@thestarweb/ui";
const menu: MenuItem[] = [
	{ title: "首页", path: "/home" },
	{ title: "账号安全", path: "/home/safe" },
];
</script>

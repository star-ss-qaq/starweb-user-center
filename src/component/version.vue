<template>
	<p>{{ version }} build at {{ buildAt }}</p>
	<p>
		星星站点用户中心&copy;2013-{{ new Date().getFullYear() }} 星星站点
		保留所有权利
	</p>
</template>
<script setup lang="ts">
const version = process.env.VERSION;
const buildAt = process.env.BUILD_AT;
</script>
<style lang="css" scoped>
p {
	text-align: center;
	margin: 0.5em;
}
</style>

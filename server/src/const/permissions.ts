import { PermissionMap } from "@thestarweb/star-web-user-center-sdk";

export const permissions = {
	users: {
		name: { "zh-cn": "用户类操作" },
		sub: {
			add: { name: { "zh-cn": "创建用户" } },
			remove: { name: { "zh-cn": "移除用户" } },
			modify: {
				name: { "zh-cn": "修改用户" },
				sub: {
					username: { name: { "zh-cn": "修改用户名" } },
					password: { name: { "zh-cn": "修改用户密码" } },
				},
			},
		},
	},
	logins: {
		name: { "zh-cn": "登录类操作" },
		sub: {
			logout: { name: { "zh-cn": "强制登出" } },
			refreshAK: { name: { "zh-cn": "强制刷新AuthToken，但保留RefreshToken" } },
		},
	},
} satisfies PermissionMap;
type T = typeof permissions;
declare module "@thestarweb/star-web-user-center-sdk" {
	interface RegisterPermissionMap extends T {}
}

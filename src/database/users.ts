import type { TableSchema } from "@thestarweb/star-framework-db";

export const users = {
	name: "user",
	columns: {
		uid: { type: "int", autoIncrement: true },
		username: { type: "string", length: 20 },
		password: { type: "string", length: 40 },
		s: { type: "string", length: 6 },
		email: { type: "string", length: 50, nullable: true },
		regTime: { type: "int-datetime" },
		regIp: { type: "string", length: 128 },
		lastLoginTime: { type: "int-datetime", nullable: true },
		lastLoginIp: { type: "string", length: 128, nullable: true },
		sex: { type: "int", defaultValue: 0 },
		title: { type: "string", length: 20, nullable: true },
	},
} satisfies TableSchema;

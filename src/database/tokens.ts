import type { TableSchema } from "@thestarweb/star-framework-db";

export const tokens = {
	name: "tokens",
	columns: {
		authToken: { type: "string", length: 20 },
		refreshToken: { type: "string", length: 100 },
		time: { type: "int-datetime" },
		uid: { type: "int" },
		ua: { type: "string", length: 500 },
		ip: { type: "string", length: 128 },
	},
	primaryKey: ["refreshToken"],
	indexes: [{ columns: "authToken", type: "unique" }],
} satisfies TableSchema;

import type { TableSchema } from "@thestarweb/star-framework-db";

export const loginLimit = {
	columns: {
		ip: { type: "string", length: 200 },
		id: { type: "string", length: 200 },
		time: { type: "int-datetime" },
	},
} satisfies TableSchema;

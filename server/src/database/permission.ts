import { TableSchema } from "@thestarweb/star-framework-db";

export const permission = {
	columns: {
		type: { type: "number" },
		id: { type: "number" },
		permission: { type: "string", length: 4096 },
	},
} satisfies TableSchema;

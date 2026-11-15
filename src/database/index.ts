import { join } from "node:path";
import { SFDB } from "@thestarweb/star-framework-db";
import { users } from "./users";
import { tokens } from "./tokens";

export const db = SFSideSwitch({
	server: new SFDB(
		{
			database: {
				default: {
					tables: {
						users,
						tokens,
					},
				},
			},
			defaultDatabase: "default" as const,
		},
		{ type: "sqlite", file: join(process.cwd(), "./db.sqlite") },
	),
})!;
if (process.env.NODE_ENV === "development") {
	SFSideSwitch({
		server: db.structHelper.update().then(() => {
			console.log("数据库结构已经更新");
		}),
	});
}

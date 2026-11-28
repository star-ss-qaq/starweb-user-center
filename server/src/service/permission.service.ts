import { permissions } from "@/const/permissions";
import { db } from "@/database";
import { Or } from "@thestarweb/star-framework-db";
import { PermissionMap } from "@thestarweb/star-web-user-center-sdk";

let t: PermissionMap | null = null;
export class PermissionService {
	async getAllPermission() {
		if (t === null) {
			t = { sucs: { sub: permissions } };
		}
		return t;
	}
	async checkPermission(uid: number, systemPre: string, permission: string) {
		const allPermission = [`${systemPre}.${permission}`, "*", `${systemPre}.*`];
		let i = -1;
		while ((i = permission.indexOf(".", i + 1)) >= 0) {
			allPermission.push(`${systemPre}.${permission.substring(0, i)}.*`);
		}
		console.log(allPermission);
		const ret = await db
			.select("permission")
			.addSelect()
			.where("id", uid)
			.where("permission", Or(...allPermission))
			.one();
		if (ret) {
			return true;
		}
		return false;
	}
}

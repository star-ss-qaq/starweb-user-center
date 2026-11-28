import { permissions } from "@/const/permissions";
import { PermissionMap } from "@thestarweb/star-web-user-center-sdk";

let t: PermissionMap | null = null;
export class PermissionService {
	async getAllPermission() {
		if (t === null) {
			t = { sucs: { sub: permissions } };
		}
		return t;
	}
}

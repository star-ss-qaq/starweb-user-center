import { db } from "@/database";
import { tokens } from "@/database/tokens";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";

export enum LoginMode {
	UserName = 1,
}
export interface LoginProp {
	mode: LoginMode;
	username: string;
	password: string;
}
@SFSideOnly("server")
export class LoginService {
	passwordV1(password: string, salt: string) {
		return createHash("sha1")
			.update(createHash("sha1").update(password).digest("hex"))
			.update(salt)
			.digest("hex");
	}
	async checkPassword(prop: LoginProp) {
		const p = await db
			.select("users")
			.addSelect("uid", "username", "password", "s")
			.where("username", prop.username)
			.one();
		// 添加随机延迟，避免被探测密码比较的时间
		await new Promise((r) => setTimeout(r, Math.random() * 200));
		const success =
			this.passwordV1(prop.password, p.s || "xxxxxx") === p?.password;
		return success
			? {
					success,
					uid: p.uid,
					username: p.username,
				}
			: { success };
	}
	randomStr(length: number) {
		const t = [Math.random().toString(36).substring(2)];
		if (t[0].length < length) {
			let times = Math.ceil(length / t[0].length) - 1;
			for (let i = 0; i < times; i++)
				t.push(Math.random().toString(36).substring(2));
		}
		return t.join("").substring(0, length);
	}
	async login(prop: LoginProp) {
		const { uid, username, success } = await this.checkPassword(prop);
		if (success) {
			const authToken = this.randomStr(tokens.columns.authToken.length);
			const refreshToken = this.randomStr(tokens.columns.refreshToken.length);
			await db.insert("tokens").data({
				authToken,
				refreshToken,
				time: new Date(),
				uid,
				ua: "",
				ip: "",
			});

			return {
				success,
				authToken: jwt.sign({ uid, username, authToken }, "sucs", {
					expiresIn: "5m",
				}),
				refreshToken,
			};
		}
		return {
			success,
		};
	}
}

import { db } from "@/database";
import { tokens } from "@/database/tokens";
import { createHash } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

export enum LoginMode {
	UserName = 1,
}
export interface LoginProp {
	mode: LoginMode;
	username: string;
	password: string;
	ip: string;
	ua: string;
}
const defaultKey = "sucs";
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
			this.passwordV1(prop.password, p?.s || "xxxxxx") === p?.password;
		return success
			? {
					success,
					uid: p.uid,
					username: p.username,
				}
			: { success };
	}
	private randomStr(length: number) {
		const t = [Math.random().toString(36).substring(2)];
		if (t[0].length < length) {
			let times = Math.ceil(length / t[0].length) - 1;
			for (let i = 0; i < times; i++)
				t.push(Math.random().toString(36).substring(2));
		}
		return t.join("").substring(0, length);
	}
	private createAuthToken() {
		return this.randomStr(tokens.columns.authToken.length);
	}
	private createRefreshToken() {
		return this.randomStr(tokens.columns.refreshToken.length);
	}
	private createJWT(uid: number, username: string, authToken: string) {
		return jwt.sign({ uid, username, authToken }, defaultKey, {
			expiresIn: "5m",
		});
	}
	async login(prop: LoginProp) {
		const { uid, username, success } = await this.checkPassword(prop);
		if (success) {
			const authToken = this.createAuthToken();
			const refreshToken = this.createRefreshToken();
			await db.insert("tokens").data({
				authToken,
				refreshToken,
				time: new Date(),
				uid,
				ua: prop.ua,
				ip: prop.ip,
			});

			return {
				success,
				authToken: this.createJWT(uid, username, authToken),
				refreshToken,
			};
		}
		return {
			success,
		};
	}
	async checkToken(token: string, ua: string, ip?: string) {
		try {
			const ret = jwt.verify(token, defaultKey, {
				ignoreExpiration: true,
			}) as JwtPayload;
			if (ret.exp! * 1000 < Date.now()) {
				let { authToken } = ret;
				const res = await db
					.select("tokens")
					.addSelect("uid", "ip")
					.join("users")
					.on("users.uid", "tokens.uid")
					.addSelect("users.username")
					.where("authToken", authToken)
					.where("ua", ua)
					.one();
				if (!res) return null;
				const { uid, username, ip: lastIP } = res;
				// TODO 完善IP检测等机制
				// if (ip && ip !== lastIP) {
				// 	console.log("ip变更，更新token");
				// 	const newToken = this.createAuthToken();
				// 	await db
				// 		.update("tokens")
				// 		.set({ ip, authToken: newToken })
				// 		.where("authToken", authToken);
				// 	authToken = newToken;
				// }
				return {
					uid,
					username,
					newToken: this.createJWT(uid, username, authToken),
				};
			}
			return { uid: ret.uid, username: ret.username };
		} catch {
			return null;
		}
	}
	async refresh(oldRefreshToken: string, ip: string, ua: string) {
		const res = await db
			.select("tokens")
			.addSelect("uid", "ip")
			.join("users")
			.on("users.uid", "tokens.uid")
			.addSelect("users.username")
			.where("refreshToken", oldRefreshToken)
			.where("ua", ua)
			.one();
		if (res) {
			const authToken = this.createAuthToken();
			const refreshToken = this.createRefreshToken();
			await db
				.update("tokens")
				.set({ authToken, refreshToken, ip })
				.where("refreshToken", oldRefreshToken);
			return {
				success: true,
				authToken: this.createJWT(res.uid, res.username, authToken),
				refreshToken,
			};
		}
		return {
			success: false,
		};
	}
}

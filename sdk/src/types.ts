export type PermissionMap = Record<
	string,
	{ name?: Record<string, string>; sub?: PermissionMap }
>;


export interface RegisterPermissionMap{}

export type PermissionNames<T extends {} = RegisterPermissionMap> = {
	[K in keyof T & string]: T[K] extends { sub: PermissionMap }
		? `${K}.${PermissionNames<T[K]["sub"]>}`
		: K;
}[keyof T & string];
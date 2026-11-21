import type * as t from "@thestarweb/star-framework-app-web";
declare module "@thestarweb/star-framework-app-web"{
	interface AllApi{
	"@thestarweb/star-web-user-center-server":{
		GET:{
			"/":{
				prop:{
				},
				return:any
			},
			"/login":{
				prop:{
				},
				return:any
			},
			"/token-message":{
				prop:{
					header?:{"referer": string,},
				},
				return:any
			},
			"/home/":{
				prop:{
				},
				return:any
			},
			"/home/safe":{
				prop:{
				},
				return:any
			},
		}
		POST:{
			"/login":{
				prop:{
					body:{"mode": 1,"username": string,"password": string,},
					header?:{"user-agent": string,},
				},
				return:any
			},
			"/refreshToken":{
				prop:{
					body:string,
					header?:{"user-agent": string,},
				},
				return:any
			},
			"/check":{
				prop:{
				},
				return:{"username": string,"uid": string,}
			},
		}
	}
	}
}
import type { Env } from "../../type";
import type { RankQueryParams, HeroQueryParams } from "./type";

import { search } from "./search";
import { getAllHero, getSeason } from "./getInfo";
import { updateData } from "./update";

async function rankleApiRequest(request: Request, env: Env, url: URL): Promise<Response> {
    const { pathname } = url;

    if (pathname === "/api/rank/search") {
        try {
            // 解析请求体
            const params: RankQueryParams = {
                name: url.searchParams.get("name") || undefined,
                part: url.searchParams.get("part") || undefined,
                season: url.searchParams.get("season") || undefined,
                week_num: url.searchParams.get("week_num") || undefined,
                camp_id: url.searchParams.has("camp_id") ? Number(url.searchParams.get("camp_id")) as 0 | 1 | 2 : 0,
                onlyLatest: url.searchParams.get("onlyLatest") === "false" ? false : true
            };

            return new Response(JSON.stringify(await search(env, params)), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("解析请求参数失败:", error);
            console.log(request)
            return new Response(JSON.stringify({ code: 400, error: "无效的请求参数" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (pathname === "/api/rank/getHero") {
        try {
            const params: HeroQueryParams = {
                name: url.searchParams.get("name") || undefined,
                camp_id: url.searchParams.has("camp_id") ? Number(url.searchParams.get("camp_id")) as 0 | 1 | 2 : 0,
                hero_id: url.searchParams.get("hero_id") || undefined
            };
            return new Response(JSON.stringify(await getAllHero(env, params)), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error("解析请求参数失败:", error);
            console.log(request)
            return new Response(JSON.stringify({ code: 400, error: "无效的请求参数" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (pathname === "/api/rank/getSeason") {
        return new Response(JSON.stringify(await getSeason(env)), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (pathname === "/api/rank/updata") {
        if (await updateData(env)) {
            return new Response(JSON.stringify({ code: 200, msg: "success" }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ code: 500, msg: "success" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return new Response(JSON.stringify({ error: "未找到请求的资源" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
    });
}

export default rankleApiRequest
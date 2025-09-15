import type { Env } from "../type";
import rankApiRequest from "."

async function handleApiRequest(request: Request, env: Env, url: URL): Promise<Response> {



    // 检查请求方法
    if (request.method !== "GET") {
        return new Response(JSON.stringify({ code: 400, error: "请求方法错误，仅支持GET语法" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (url.pathname.startsWith('/api/rank/')) {
        return await rankApiRequest(request, env, url);
    }

    return new Response(JSON.stringify({ error: "未找到请求的资源" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
    });
}

export default handleApiRequest
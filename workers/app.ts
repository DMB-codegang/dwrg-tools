import { createRequestHandler } from "react-router";
import type { Env } from "./type";

import rankleApiRequest from "./api/rank/index"
import { updateData } from "./api/rank/update";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api/') && url.pathname !== '/api') {
      return await rankleApiRequest(request, env, url);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    await updateData(env);
  }
} satisfies ExportedHandler<Env>;

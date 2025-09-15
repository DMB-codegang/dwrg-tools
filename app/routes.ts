import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("rankquery", "routes/rank-query/index.tsx"),
    route("api", "routes/api-doc/index.tsx"),
    route("*", "routes/404.tsx")
] satisfies RouteConfig;

import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DWRG Tools - 第五人格数据查询工具" },
    { name: "description", content: "第五人格数据查询工具，查询第五人格玩家数据，角色数据，游戏数据" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: 'DWRG Tools - 第五人格数据查询工具' };
}

export default function Home() {
  return <Welcome/>;
}

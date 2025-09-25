/**
 * 排位查询参数
 */
export interface RankQueryParams {
  name?: string;
  part?: string;
  season?: string;
  camp_id?: 0|1|2;
}
/**
 * 排位数据
 */
export interface RankedData {
  id: number;
  name: string;
  run_rate: number | null;
  start_time: string;
  ping_rate: number;
  ban_rate: number;
  part: number;
  use_rate: number;
  end_time: string;
  season: string;
  camp_id: 1|2;
  hero_id: string;
  win_rate: number;
  position: string;
  week_num: string;
}


/**
 * 角色查询参数
 */
export interface HeroQueryParams {
    name?: string;
    camp_id?: 0|1|2;
    hero_id?: string;
}
/**
 * 角色数据
 */
export interface HeroData {
  name: string;
  camp_id: 1|2;
  hero_id: number;
}

export type SeasonList = number[]

/**
 * 响应
 */
export interface Response {
    code: number;
    msg: string;
    data?: RankedData[] | HeroData[] | SeasonList;
}


/*
 * 网易api定义
 */
export interface HeroStatsResponse {
  status: boolean;
  success: boolean;
  code: number;
  msg: string;
  data: RankedData[];
}
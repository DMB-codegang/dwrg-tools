import type { HeroData, HeroQueryParams, Response, SeasonList } from './type'
import type { Env } from '../../type'

export async function getAllHero(env: Env, params: HeroQueryParams): Promise<Response> {

    let sql = 'SELECT name, camp_id, hero_id FROM rank name WHERE 1=1';
    const bindValues = [];

    if (params.name) {
        const temp = params.name.split(",")
        sql += ' AND ('
        for (let i = 0; i < temp.length; i++) {
            i === 0 ? sql += 'name = ?' : sql += ' OR name = ?'
            bindValues.push(temp[i])
        }
        sql += ')'
    }

    if (params.hero_id) {
        const temp = params.hero_id.split(",")
        sql += ' AND ('
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].includes('-')) {
                const range = temp[i].split('-')
                i === 0 ? sql += 'hero_id BETWEEN ? AND ?' : sql += ' OR hero_id BETWEEN ? AND ?'
                bindValues.push(range[0], range[1])
            } else {
                i === 0 ? sql += 'hero_id = ?' : sql += ' OR hero_id = ?'
                bindValues.push(temp[i])
            }
        }
        sql += ')'
    }

    if (params.camp_id !== 0) {
        sql += ' AND camp_id = ?'
        bindValues.push(params.camp_id)
    }

    sql += ' GROUP BY name'

    const statement = env.dwrg_ranked_data.prepare(sql);
    const query = bindValues.length > 0 ? statement.bind(...bindValues) : statement;
    const { results } = await query.run() as { results: HeroData[] };

    return {
        code: 200,
        msg: 'success',
        data: results // 记得添加数据到响应中
    }
}

export async function getSeason(env: Env): Promise<Response> {
    const sql = 'SELECT season FROM rank GROUP BY season'
    const statement = env.dwrg_ranked_data.prepare(sql);
    const query = statement.bind();
    const { results } = (await query.run()) as { results: {season: number}[] };
    const seasonList = results.map(item => item.season)

    return {
        code: 200,
        msg: 'success',
        data: seasonList
    }
}
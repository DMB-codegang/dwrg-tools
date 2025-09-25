import type { RankQueryParams, RankedData, Response } from './type'
import type { Env } from '../../type'

export async function search(env: Env, params: RankQueryParams): Promise<Response> {
    return sqlQuery(env, params)
}

async function sqlQuery(env: Env, params: RankQueryParams): Promise<Response> {

    try {

        // 构建动态 SQL 查询
        let sql = 'SELECT * FROM rank WHERE 1=1';
        const bindValues = [];

        // 动态添加查询条件
        if (params.name) {
            const temp = params.name.split(",")
            sql += ' AND ('
            for (let i = 0; i < temp.length; i++) {
                i === 0 ? sql += 'name = ?' : sql += ' OR name = ?'
                bindValues.push(temp[i])
            }
            sql += ')'
        }

        if (params.part !== undefined) {
            const temp = params.part.split(",")
            sql += ' AND ('
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].includes('-')) {
                    const range = temp[i].split('-')
                    i === 0 ? sql += 'part BETWEEN ? AND ?' : sql += ' OR part BETWEEN ? AND ?'
                    bindValues.push(range[0], range[1])
                } else {
                    i === 0 ? sql += 'part = ?' : sql += ' OR part = ?'
                    bindValues.push(temp[i])
                }
            }
            sql += ')'
        }

        if (params.season !== undefined) {
            const temp = params.season.split(",")
            sql += ' AND ('
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].includes('-')) {
                    const range = temp[i].split('-')
                    i === 0 ? sql += 'season BETWEEN ? AND ?' : sql += ' OR season BETWEEN ? AND ?'
                    bindValues.push(range[0], range[1])
                } else {
                    i === 0 ? sql += 'season = ?' : sql += ' OR season = ?'
                    bindValues.push(temp[i])
                }
            }
            sql += ')'
        }

        if (params.camp_id !== 0) {
            sql += ' AND camp_id = ?'
            bindValues.push(params.camp_id)
        }

        // 准备并执行查询
        const statement = env.dwrg_ranked_data.prepare(sql);
        const query = bindValues.length > 0 ? statement.bind(...bindValues) : statement;
        const { results } = await query.run() as { results: RankedData[] };

        return {
            code: 200,
            msg: "success",
            data: results
        }
    } catch (err) {
        console.error(err)
        return {
            code: 500,
            msg: "数据库异常，请检查日志"
        }
    }
}
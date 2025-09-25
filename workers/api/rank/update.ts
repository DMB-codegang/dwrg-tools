import type { HeroStatsResponse, RankedData } from "./type";
import type { Env } from '../../type'

export async function updateData(env: Env): Promise<boolean> {
    try {
        console.log('正在获取新数据')
        const headers = new Headers({
            "Accept-Encoding": "br, gzip",
        });
        const results = await fetch("https://h55.s3.game.163.com/w/epro/wechatuser/gameRole/herouse_week", {
            method: "GET",
            headers,
        })
        if (results.status <= 299 && results.status >= 200) {
            console.log("已获取新数据，准备比较并写入")
            const newData = (await results.json() as HeroStatsResponse).data
            // console.log(newData)
            // 检查数据库中的数据，检查更新
            let newdataNum = 0
            let updataNum = 0
            let keepNum = 0
            let [updatesql, insertsql] = ['', ''];
            const updateBindValues = [];
            const insertBindValues = [];
            for (let item of newData) {
                if (item.name.includes('“') || item.name.includes('”')) item.name = item.name.replace(/“/g, '').replace(/”/g, '');
                const sql = `SELECT id,win_rate,ping_rate,use_rate,ban_rate FROM rank WHERE name=? AND hero_id=? AND season=? AND part=? AND week_num=? AND start_time=? AND end_time=?`;
                const statement = env.dwrg_ranked_data.prepare(sql);
                const { results } = await statement.bind(
                    item.name, item.hero_id, item.season, item.part,
                    item.week_num, item.start_time, item.end_time
                ).run() as { results: RankedData[] };
                if (results.length === 0) {
                    newdataNum++
                    insertsql += `INSERT INTO rank
                        (name, run_rate, start_time, ping_rate, ban_rate, part, use_rate, end_time, season, camp_id, hero_id, win_rate, position, week_num) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                    insertBindValues.push(
                        item.name, item.run_rate, item.start_time, item.ping_rate,
                        item.ban_rate, item.part, item.use_rate, item.end_time,
                        item.season, item.camp_id, item.hero_id, item.win_rate,
                        item.position, item.week_num
                    )
                } else if (results.length === 1) {
                    if (results[0].win_rate != item.win_rate ||
                        results[0].ping_rate != item.ping_rate ||
                        results[0].use_rate != item.use_rate ||
                        results[0].ban_rate != item.ban_rate) {
                        updataNum++
                        updatesql += `UPDATE rank SET win_rate=?, ping_rate=?, use_rate=?, ban_rate=? WHERE id=?;`
                        updateBindValues.push(
                            item.win_rate, item.ping_rate, item.use_rate, item.ban_rate, results[0].id
                        )
                    } else {
                        keepNum++
                    }
                } else {
                    console.error(`数据重复，重复数据：` + results)
                }
            }
            if (insertsql.length > 0) {
                await env.dwrg_ranked_data.prepare(insertsql).bind(...insertBindValues).run()
            }
            if (updatesql.length > 0) {
                await env.dwrg_ranked_data.prepare(updatesql).bind(...updateBindValues).run()
            }
            console.log(`数据库操作完成，共新增${newdataNum}条数据，更新${updataNum}条数据，保持${keepNum}条数据`)
        } else {
            console.error(`获取数据失败，状态码：${results.status}`)
        }
        return true
    } catch (error) {
        console.error('数据更新失败:', error);
        return false;
    }
}
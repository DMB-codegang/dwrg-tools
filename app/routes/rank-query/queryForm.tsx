import { Card, Form, Select, Spin, Alert, Typography, Button } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface HeroData {
    name: string;
    camp_id: 1 | 2;
    hero_id: number;
}

interface SeasonResponse {
    code: number;
    msg: string;
    data: number[];
}

interface HeroResponse {
    code: number;
    msg: string;
    data: HeroData[];
}

interface QueryFormProps {
  onSearch: (values: any) => void;
  loading: boolean;
}

export function QueryForm({ onSearch, loading }: QueryFormProps) {
    const [heroList, setHeroList] = useState<HeroData[]>([]);
    const [seasonList, setSeasonList] = useState<number[]>([]);
    const [dataLoading, setDataLoading] = useState(true); // 修改为 dataLoading
    const [error, setError] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [selectedCamp, setSelectedCamp] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true); // 修改为 setDataLoading

                // 并行获取角色数据和赛季数据
                const [heroResponse, seasonResponse] = await Promise.all([
                    fetch('/api/rank/getHero'),
                    fetch('/api/rank/getSeason')
                ]);

                if (!heroResponse.ok || !seasonResponse.ok) {
                    throw new Error('HTTP请求失败');
                }

                const heroResult: HeroResponse = await heroResponse.json();
                const seasonResult: SeasonResponse = await seasonResponse.json();

                if (heroResult.code === 0 && seasonResult.code === 0) {
                    setHeroList(heroResult.data || []);
                    setSeasonList(seasonResult.data || []);
                } else {
                    throw new Error(heroResult.msg || seasonResult.msg || '获取数据失败');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '未知错误');
            } finally {
                setDataLoading(false); // 修改为 setDataLoading
            }
        };

        fetchData();
    }, []);

    if (dataLoading) { // 修改为 dataLoading
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }

    const handleValuesChange = (changedValues: any) => {
        if (changedValues.camp_id !== undefined) {
            setSelectedCamp(changedValues.camp_id);
            // 清空已选择的角色
            form.setFieldsValue({ hero: [] });
        }
    };

    // 根据选择的阵营筛选角色
    const filteredHeroOptions = selectedCamp
        ? heroList
            .filter(hero => hero.camp_id === selectedCamp)
            .map(hero => ({
                value: hero.name,
                label: hero.name,
            }))
        : heroList.map(hero => ({
            value: hero.name,
            label: hero.name,
        }));

    // 赛季选项
    const seasonOptions = seasonList
        .sort((a, b) => b - a) // 从大到小排序
        .map(season => ({
            value: season,
            label: `第${season}赛季`,
        }));

    const handleReset = () => {
        form.resetFields();
        setSelectedCamp(null);
    };

    const handleSubmit = (values: any) => {
        onSearch(values);
    };

    return (
        <Card>
            <Title level={2} style={{ marginBottom: '18px' }}>查询条件</Title>

            <Form form={form} onValuesChange={handleValuesChange} onFinish={handleSubmit}>
                <Form.Item label="筛选阵营" name="camp_id">
                    <Select
                        placeholder="请选择阵营"
                        options={[
                            { value: 0, label: '全部' },
                            { value: 1, label: '监管者' },
                            { value: 2, label: '求生者' },
                        ]}
                        style={{ maxWidth: 100 }}
                    />
                </Form.Item>
                <Form.Item label="筛选角色" name="name">
                    <Select
                        placeholder="请选择角色，不填入查询所有角色"
                        options={filteredHeroOptions}
                        mode="multiple"
                        tokenSeparators={[',','，','|','/','、']}
                        showSearch={true}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        defaultValue={0}
                        optionFilterProp="label"
                        style={{ maxWidth: 600 }}
                    />
                </Form.Item>
                <Form.Item label="选择赛季" name="season">
                    <Select
                        placeholder="请选择赛季，不填入查询所有赛季"
                        options={seasonOptions}
                        mode="multiple"
                        tokenSeparators={[',','，','|','/','、']}
                        showSearch={true}
                        style={{ maxWidth: 600 }}
                    />
                </Form.Item>
                <Form.Item label="筛选段位" name="part">
                    <Select
                        placeholder="请选择段位，不填入查询所有段位"
                        options={[
                            { value: 1, label: '一阶' },
                            { value: 2, label: '二阶' },
                            { value: 3, label: '三阶' },
                            { value: 4, label: '四阶' },
                            { value: 5, label: '五阶' },
                            { value: 6, label: '六阶' },
                            { value: 7, label: '七阶' },
                            { value: 8, label: '巅峰七阶' },
                        ]}
                        mode="multiple"
                        tokenSeparators={[',','，','|','/','、']}
                        style={{ maxWidth: 600 }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      查询
                    </Button>
                    <Button type="link" onClick={handleReset}>
                      重置
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
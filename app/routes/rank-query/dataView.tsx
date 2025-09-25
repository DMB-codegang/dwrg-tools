import { Table, Card, Spin, Button, Space, Radio } from 'antd';
import { Line } from '@ant-design/charts';
import { useState, useEffect } from 'react';
import { DataViewLine } from './dataView-Line';

interface DataViewProps {
    data: any[];
    loading: boolean;
}

export function DataView({ data, loading }: DataViewProps) {
    const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
    const [isClient, setIsClient] = useState(false);
    const [chartType, setChartType] = useState<'winrate' | 'useRate' | 'banRate' | 'pingrate'>('winrate');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const columns = [   
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '赛季',
            dataIndex: 'season',
            key: 'season',
        },
        {
            title: '段位',
            dataIndex: 'part',
            key: 'part',
        },
        {
            title: '胜率',
            dataIndex: 'win_rate',
            key: 'win_rate',
            render: (rate: number) => formatPercentage(rate),
        },
        {
            title: '平率',
            dataIndex: 'ping_rate',
            key: 'ping_rate',
            render: (rate: number) => formatPercentage(rate),
        },
        {
            title: '使用率',
            dataIndex: 'use_rate',
            key: 'use_rate',
            render: (rate: number) => formatPercentage(rate),
        },
        {
            title: '禁用率',
            dataIndex: 'ban_rate',
            key: 'ban_rate',
            render: (rate: number) => formatPercentage(rate),
        },
        {
            title: '选取率',
            dataIndex: 'ping_rate',
            key: 'ping_rate',
            render: (rate: number) => formatPercentage(rate),
        },
        {
            title: '时间范围',
            key: 'time_range',
            render: (record: any) => `${record.start_time} 至 ${record.end_time}`,
        },
    ];

    const chartComponents = {
        winrate: <DataViewLine data={data} metricType="win_rate" />,
        pingrate: <DataViewLine data={data} metricType="ping_rate" />,
        useRate: <DataViewLine data={data} metricType="use_rate" />,
        banRate: <DataViewLine data={data} metricType="ban_rate" />,
    };

    if (loading) {
        return <Spin size="large" />;
    }

    // 服务器端渲染时只显示表格
    if (!isClient) {
        return (
            <Card title="查询结果" style={{ marginTop: 16 }}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => `${record.season}-${record.part}-${record.hero_id}`}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                    size="small"
                />
            </Card>
        );
    }

    return (
        <>
            <Card
                title="查询结果"
                style={{ marginTop: 16 }}
            >
                <Space>
                    <div style={{
                        margin: '8px 0',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        <style>{`
                                div::-webkit-scrollbar { display: none; }
                            `}</style>
                        <Radio.Group
                            value={viewMode === 'table' ? 'table' : chartType}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'table') {
                                    setViewMode('table');
                                } else {
                                    setViewMode('chart');
                                    setChartType(value as 'winrate' | 'useRate' | 'banRate' | 'pingrate');
                                }
                            }}
                            style={{
                                display: 'inline-block',
                                padding: '0 0',
                                minWidth: 'fit-content'
                            }}
                            optionType="button"
                            buttonStyle="solid"
                        >
                            <Radio.Button value="table">原始数据</Radio.Button>
                            <Radio.Button value="winrate">胜率</Radio.Button>
                            <Radio.Button value="pingrate">平率</Radio.Button>
                            <Radio.Button value="useRate">使用率</Radio.Button>
                            <Radio.Button value="banRate">禁用率</Radio.Button>
                        </Radio.Group>
                    </div>
                </Space>
                {viewMode === 'table' ? (
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey={(record, id) => `${record.season}-${record.part}-${record.hero_id}`}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                        size="small"
                    />
                ) : (
                    chartComponents[chartType]
                )}
            </Card>
        </>
    );
}

// 在文件顶部或适当位置添加这个辅助函数
const formatPercentage = (value: number): string => {
    // 使用更精确的方法避免浮点数精度问题
    const percentage = Math.round(value * 10000) / 100; // 先乘以10000再除以100，避免浮点误差
    return `${percentage.toFixed(2)}%`;
};
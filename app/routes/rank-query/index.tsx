import { Typography, message } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';

import type { Route } from "./+types/index";
import { Layout } from '~/components/Layout';

import { QueryForm } from './queryForm';
import { DataView } from './dataView';

const { Title } = Typography;

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "查询器 - DWRG Tools" },
    { name: "description", content: "数据查询工具页面" },
  ];
}

export default function QueryPage() {
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const handleSearch = async (searchParams: any) => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      if (searchParams.part) params.append('part', searchParams.part);
      if (searchParams.season) params.append('season', searchParams.season);
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.camp_id != 0 && searchParams.camp_id != null) params.append('camp_id', searchParams.camp_id);

      const response = await fetch(`/api/rank/search?${params.toString()}`);
      const result: any = await response.json();

      if (result.code === 200) {
        setSearchData(result.data || []);
        message.success('查询成功');
      } else {
        message.error(result.msg || '查询失败');
        setSearchData([]);
      }
    } catch (error) {
      message.error('网络请求失败');
      setSearchData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout headerTitle="DWRG Tools">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title level={1} style={{ textAlign: 'center' }}>排位数据查询器</Title>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
      <QueryForm onSearch={handleSearch} loading={loading} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
      <DataView data={searchData} loading={loading} />
      </motion.div>
    </Layout>
  );
}
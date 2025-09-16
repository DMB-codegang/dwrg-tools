import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Typography, Button, notification } from 'antd';
import { Layout } from '~/components/Layout';

const { Title, Paragraph } = Typography;

export function Welcome() {
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    // 显示欢迎通知，带进度条，悬停时不暂停
    api.open({
      message: '欢迎使用DWRG Tools',
      description: '第五人格数据查询工具已准备就绪，开始您的探索之旅吧！',
      showProgress: true,
      pauseOnHover: false,
      duration: 3,
    });
  }, [api]);

  const queryTools = [
    {
      key: 'rank-query',
      title: '排位数据查询器',
      description: '查询和分析游戏排位数据',
      status: 'available',
      path: '/rankquery'
    },
    {
      key: 'match-query',
      title: '对战数据查询器',
      description: '查询详细对战记录和统计',
      status: 'coming-soon',
      path: '/match-query'
    },
    {
      key: 'player-stats',
      title: '玩家统计查询器',
      description: '查看玩家详细统计数据',
      status: 'coming-soon',
      path: '/player-stats'
    }
  ];

  const handleToolClick = (tool: any) => {
    if (tool.status === 'available') {
      // 这里可以添加导航逻辑
      console.log(`跳转到: ${tool.path}`);
      // window.location.href = tool.path;
    } else {
      console.log(`功能开发中: ${tool.title}`);
    }
  };

  return (
    <>
      {contextHolder}
      <Layout headerTitle="DWRG Tools">
        <div style={{ padding: '24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
              欢迎使用第五人格<br />数据查询工具
            </Title>
            <Paragraph style={{ textAlign: 'center', marginBottom: '48px', fontSize: '16px' }}>
              选择您要使用的查询工具，开始你的探索之旅
            </Paragraph>
          </motion.div>

          <Row gutter={[24, 24]} justify="center">
            {queryTools.map((tool, index) => (
              <Col key={tool.key} xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card
                    title={tool.title}
                    variant="borderless"
                    style={{
                      height: '200px',
                      textAlign: 'center',
                      opacity: tool.status === 'available' ? 1 : 0.6
                    }}
                    hoverable={tool.status === 'available'}
                    onClick={() => handleToolClick(tool)}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <Paragraph>{tool.description}</Paragraph>
                    </div>

                    <Button
                      href={tool.path}
                      type={tool.status === 'available' ? 'primary' : 'default'}
                      disabled={tool.status !== 'available'}
                    >
                      {tool.status === 'available' ? '立即使用' : '开发中'}
                    </Button>

                    {tool.status !== 'available' && (
                      <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#999'
                      }}>
                        即将上线
                      </div>
                    )}
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          <div style={{
            marginTop: '48px',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <Title level={3}>更多功能即将推出</Title>
            <Paragraph>
              我们正在不断开发新的查询工具和分析功能，敬请期待！
            </Paragraph>
          </div>
        </div>
      </Layout>
    </>
  );
}
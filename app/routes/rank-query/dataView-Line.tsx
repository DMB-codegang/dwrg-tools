import React from 'react';
import { Line } from '@ant-design/charts';
import { useTheme } from '~/contexts/ThemeContext';
import { InboxOutlined } from '@ant-design/icons';

interface HeroData {
  name: string;
  start_time: string;
  ping_rate: number;
  part: number;
  use_rate: number;
  end_time: string;
  season: number;
  camp_id: number;
  hero_id: number;
  win_rate: number;
  ban_rate: number;
}

interface DataViewLineProps {
  data: HeroData[];
  metricType: 'win_rate' | 'ping_rate' | 'use_rate' | 'ban_rate';
}



export const DataViewLine: React.FC<DataViewLineProps> = ({ data, metricType }) => {
    const { isDarkMode } = useTheme();
  // 处理数据，按角色和赛季分组
  const processData = () => {
    const heroes = Array.from(new Set(data.map(item => item.name)));
    const seasons = Array.from(new Set(data.map(item => item.season))).sort((a, b) => a - b);

    const chartData: any[] = [];

    heroes.forEach(hero => {
      seasons.forEach(season => {
        const heroData = data.find(item => item.name === hero && item.season === season && item.season != -127);
        if (heroData) {
          chartData.push({
            season: `赛季 ${season}`,
            value: Math.round(heroData[metricType] * 10000) / 100, // 使用更精确的计算方法
            hero: hero,
            category: metricType
          });
        }
      });
    });

    return chartData;
  };

  const chartData = processData();

    const config = {
    data: chartData,
    xField: 'season',
    yField: 'value',
    seriesField: 'hero',
    colorField: 'hero', // 添加colorField以区分不同角色的颜色
    shapeField: 'smooth',
    scale: {
      color: {
        // 使用一组丰富的颜色来区分多个角色
        range: [
          '#30BF78', '#F4664A', '#FAAD14', '#722ED1', '#13C2C2', 
          '#1890FF', '#52C41A', '#EB2F96', '#FA8C16', '#A0D911',
          '#2F54EB', '#F5222D', '#13A8A8', '#722ED1', '#FA541C',
          '#52C41A', '#1890FF', '#FAAD14', '#EB2F96', '#13C2C2'
        ]
      }
    },
    xAxis: {
      label: {
        style: {
          fill: isDarkMode ? '#fff' : '#000', // 白色文字在暗黑模式下
        },
      },
      line: {
        style: {
          stroke: isDarkMode ? '#434343' : '#d9d9d9', // 深灰色轴线
        },
      },
      tickLine: {
        style: {
          stroke: isDarkMode ? '#434343' : '#d9d9d9', 
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: number) => `${v.toFixed(1)}%`,
        style: {
          fill: isDarkMode ? '#fff' : '#000', // 白色文字在暗黑模式下
        },
      },
      grid: {
        line: {
          style: {
            stroke: isDarkMode ? '#434343' : '#f0f0f0', // 深灰色网格线
          },
        },
      },
    },
    legend: {
      position: 'top',
      itemName: {
        style: {
          fill: isDarkMode ? '#fff' : '#000', // 白色图例文字
        },
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    theme: isDarkMode ? 'dark' : 'classic', // 使用暗黑主题
  };

  const getChartTitle = () => {
    const titles = {
      win_rate: '胜率趋势',
      ping_rate: '平率趋势', 
      use_rate: '使用率趋势',
      ban_rate: 'Ban率趋势'
    };
    return titles[metricType] || '数据趋势';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>{getChartTitle()}</h3>
      {chartData.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: isDarkMode ? '#999' : '#666',
          fontSize: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <InboxOutlined style={{fontSize: '64px'}}/>
          <div>No data</div>
        </div>
      ) : (
        <Line {...config} />
      )}
    </div>
  );
};

export default DataViewLine;
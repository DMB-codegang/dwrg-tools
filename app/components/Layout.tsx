import { Layout as AntLayout, Menu, type MenuProps, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useTheme } from '~/contexts/ThemeContext';

const { Header, Content, Sider } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
  showSider?: boolean;
  siderItems?: MenuProps['items'];
  headerTitle?: string;
}

export function Layout({ 
  children, 
  showSider = false, 
  siderItems = [],
  headerTitle = 'DWRG Tools'
}: LayoutProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // 添加状态来跟踪是否已hydrated
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          {headerTitle}
        </div>

        <div style={{ color: 'white' }}>
          {/* 只在客户端渲染后显示Switch组件 */}
          {isHydrated && (
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          )}
        </div>
      </Header>

      <AntLayout>
        {showSider && siderItems && siderItems.length > 0 && (
          <Sider width={200}>
            <Menu
              mode="inline"
              items={siderItems}
              style={{ height: '100%' }}
            />
          </Sider>
        )}
        
        <Content style={{ 
          padding: '24px', 
          margin: 0, 
          minHeight: 280
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
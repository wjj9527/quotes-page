import './index.less';
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

const Index: React.FC = ({ children }) => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className='page-container'>
        {children}
      </div>
    </ConfigProvider>
  );
};
export default Index;


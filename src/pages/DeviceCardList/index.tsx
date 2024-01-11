import React, { useEffect, useState } from 'react';
import { Input, Button, Radio, Pagination, Form } from 'antd';
import Item from '@/pages/DeviceCardList/Item';
import axios from 'axios';
import './style.less'
const DeviceCardList: React.FC = () => {
  const [datasource, setDatasource] = useState([]);
  const [total, setTotal] = useState(0);
  const [indexes, setIndexes] = useState({
    key: '',
    pageNo: 1,
    pageSize: 10,
  });
  const getDatasource = () => {
    axios({
      method: 'get',
      url: 'http://192.168.2.35:9981/background-config-api/device/card/getListDeviceCard',
      headers: {
        projectId: 1,
      },
      params: {
        ...indexes,
      },
    }).then((res) => {
      const { data, total } = res.data;
      setDatasource(data);
      setTotal(total);
    });
  };
  const handleFinish = (e: any) => {
    // console.log(e)
    setIndexes({ ...indexes, ...e });
  };
  const handleCurrentChange = (pageNo: number, pageSize: number) => {
    setIndexes({ ...indexes, pageNo, pageSize });
  };
  useEffect(() => {
    getDatasource();
  }, [indexes,]);
  return <div className='page-content device-card-list'>
    <div className="search-handle">
      <Form layout="inline" onFinish={handleFinish}>
        <Form.Item label="关键字" name="key">
          <Input />
        </Form.Item>
        <Form.Item label="运行状态" name="online">
          <Radio.Group>
            <Radio value={undefined}>全部</Radio>
            <Radio value={1}>在线</Radio>
            <Radio value={2}>离线</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="btn" style={{marginRight:12}}>
            搜索
          </Button>
          <Button
            htmlType="reset"
            onClick={handleFinish.bind(this, { key: '', online: null })}
            type="primary"
            className="btn"
            ghost
          >
            重置
          </Button>
        </Form.Item>
      </Form>
      <Button type="primary" onClick={()=>{
        window.parent.postMessage({url:'1'},'*');
      }}>查看地图视图</Button>
    </div>
    <div className="card-list-content">
      {datasource?.map((item: any) => (
        <Item key={item.id} source={item} />
      ))}
    </div>
    <div className="pagination-content">
      <Pagination
        total={total}
        current={indexes.pageNo}
        onChange={handleCurrentChange}
      />
    </div>
  </div>
};

export default DeviceCardList;

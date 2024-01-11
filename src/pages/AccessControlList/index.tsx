import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { apiDetail, doorList, remoteControl } from '@/http/api/editor';
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  option: React.Key;
  type: React.Key;
}
import "./style.less"
const AccessControlList: React.FC = () => {
  const [datasource, setDatasource] = useState([]);
  const [total, setTotal] = useState(0);
  const [indexes, setIndexes] = useState({
    name: '',
    page: 1,
    pageSize: 10,
  });
  const [apiParams, setApiParams] = useState({});
  const columns: ColumnsType<DataType> = [
    {
      title: '门名称',
      dataIndex: 'doorName',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '门ID',
      dataIndex: 'doorId',
    },
    {
      title: '门状态',
      dataIndex: 'doorStatus',
      render: (text) =>
        text ? <Tag color="#87d068">关门</Tag> : <Tag color="#f50">开门</Tag>,
    },
    {
      title: '远程控制',
      dataIndex: 'time',
      width: 380,
      render: () => (
        <div className="table-btn-group">
          <Button
            type="primary"
            size="small"
            onClick={remoteControlAction.bind(this, 'remoteOpenDoor')}
          >
            遥控开门
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={remoteControlAction.bind(this, 'remoteCloseDoor')}
          >
            遥控关门
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={remoteControlAction.bind(this, 'urgentOpenDoor')}
          >
            紧急开门
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={remoteControlAction.bind(this, 'urgentCloseDoor')}
          >
            紧急关门
          </Button>
        </div>
      ),
    },
  ];
  const remoteControlAction = (action: string) => {
    remoteControl({ ...apiParams }).then(() => {
      message.success('操作成功');
    });
  };
  const getDataSource = () => {
    doorList({ ...indexes, ...apiParams }).then((res) => {
      // console.log(res);
      const { data, total } = res;
      setDatasource(data);
      setTotal(total);
    });
  };
  const handleSearch = (values: { name: string }) => {
    setIndexes({
      ...indexes,
      name: values.name,
      page: 1,
    });
  };
  useEffect(() => {
    apiDetail({ id: 11 }).then((res) => {
      const { data } = res;
      setApiParams(data);
    });
  }, []);
  useEffect(() => {
    if (Object.keys(apiParams).length) {
      getDataSource();
    }
  }, [indexes, apiParams]);
  return <div className="page-content access-control-list">
    <div className="search-handle">
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item label="关键字" name="name">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="btn">
            搜索
          </Button>
          <Button htmlType="reset" ghost>
            重置
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className="scroll-content">
      {/*@ts-ignore*/}
      <Table
        style={{ width: '100%' }}
        columns={columns}
        /*@ts-ignore*/
        pagination={{
          pageSize: indexes.pageSize,
          current: indexes.page,
          total,
          onChange: (page) => {
            setIndexes({ ...indexes, page });
          },
        }}
        dataSource={datasource}
      />
    </div>
  </div>;
};

export default AccessControlList;

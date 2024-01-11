import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Table, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { apiDetail, doorRecordList } from '@/http/api/editor';
const { RangePicker } = DatePicker;
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  type: React.Key;
  option: React.Key;
}
const columns: ColumnsType<DataType> = [
  {
    title: '设备ID',
    dataIndex: 'deviceId',
  },
  {
    title: '门ID',
    dataIndex: 'doorId',
  },
  {
    title: '门名称',
    dataIndex: 'doorName',
  },
  {
    title: '刷卡人证件',
    dataIndex: 'employeeId',
  },
  {
    title: '姓名',
    dataIndex: 'employeeName',
  },
  {
    title: '编号',
    dataIndex: 'serial',
  },
  {
    title: '刷卡时间',
    dataIndex: 'eventDate',
  },
  {
    title: '刷卡卡号',
    dataIndex: 'employeeSysNo',
  },
  {
    title: '出入类型',
    dataIndex: 'typename',
  },
];
const AccessRecordsList: React.FC = () => {
  const [datasource, setDatasource] = useState([]);
  const [total, setTotal] = useState(0);
  const [indexes, setIndexes] = useState({
    name: '',
    page: 1,
    pageSize: 10,
  });
  const [apiParams, setApiParams] = useState({});
  const getDataSource = () => {
    doorRecordList({ ...indexes, ...apiParams }).then((res) => {
      // console.log(res);
      const { data, total } = res;
      setDatasource(data);
      setTotal(total);
    });
  };
  const handleSearch = (values: { name: string; time: any[] }) => {
    // console.log(values.time)
    const time = values.time || ['', ''];
    let [start, end] = time;
    if (start && end) {
      start = moment(start).format('YYYY-MM-DD hh:mm:ss');
      end = moment(end).format('YYYY-MM-DD hh:mm:ss');
    }

    setIndexes({
      ...indexes,
      name: values.name,
      // @ts-ignore
      start,
      end,
      page: 1,
    });
  };
  useEffect(() => {
    apiDetail({ id: 11 }).then((res) => {
      setApiParams(res.data);
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
        <Form.Item name="time">
          {/*@ts-ignore*/}
          <RangePicker showTime />
        </Form.Item>
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

export default AccessRecordsList;

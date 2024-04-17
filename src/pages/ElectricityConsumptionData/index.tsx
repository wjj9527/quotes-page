import React, {  useEffect, useRef, useState } from 'react';
import { Table, Button, Form, DatePicker, Select, TreeSelect } from 'antd';
import moment from 'moment';
import * as echarts from 'echarts';
import './style.less';
import {
  getParamByItem,
  itemTypeAction,
  usageContrast,
  usageDataTable,
} from '@/http/api/editor';

const DeviceCardList: React.FC = () => {
  const [timeType, setTimeType] = useState('');
  const [itemTypeOptions, setItemTypeOptions] = useState([]);
  const [tableType, setTableType] = useState(2);
  const [itemType, setItemType] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  const chartDom = useRef(null);
  const [columns, setColumns] = useState([]);
  const [datasource, setDatasource] = useState([]);
  //@ts-ignore
  const handleTimeTypeChange = (value: any) => {
    setTimeType(['', 'week', 'month', 'year'][value]);
  };
  const ammeterExportAction = () => {
    form.validateFields().then((values: any) => {
      let { paramValue, timeType, time } = values;
      let startTime;
      let endTime;
      if (timeType === 0) {
        startTime = moment(time).format('YYYY-MM-DD');
      } else if (timeType === 1) {
        startTime = moment(time).startOf('week').format('YYYY-MM-DD');
        endTime = moment(time).endOf('week').format('YYYY-MM-DD');
      } else if (timeType === 2) {
        startTime = moment(time).format('YYYY-MM');
      } else {
        startTime = moment(time).format('YYYY');
      }
      // console.log(treeData)
      paramValue = treeData
        .filter((item: any) => paramValue.includes(item.key))
        ?.map((item: any) => ({ name: item.title, id: item.key }));
      const params = {
        ...values,
        startTime,
        endTime,
        paramValue,
        name: '用电对比',
        //@ts-ignore
        groupIds: ["16"],
      };
      // ammeterExport(params);
    });
  };
  const getItemTypeAction = () => {
    itemTypeAction().then((res) => {
      const itemTypeOptions = res.data.map(
        ({ id, name }: { id: string; name: string }) => ({
          label: name,
          value: id,
        }),
      );
      setItemType('energy');
      setItemTypeOptions(itemTypeOptions);
    });
  };
  const getUsageDataTable = (params: any) => {
    usageDataTable(params).then((res) => {
      const { dataSource, columns } = res.data;
      setDatasource(dataSource);
      setColumns(
        columns?.map((item: any) => {
          item.width = '100px';
          return item;
        }),
      );
    });
  };
  const getUsageContrast = (params: any) => {
    usageContrast(params).then((res) => {
      // console.log(res);
      if (res) {
        const myChart = echarts.init(chartDom.current, );
        const option = {
          backgroundColor: 'transparent',
          color: [
            'rgb(50,98,214)',
            'rgb(33,162,255)',
            'rgb(96,203,228)',
            'rgb(159,219,29)',
            'rgb(132,107,212)',
            'rgb(247,186,30)',
            'rgb(243,140,140)',
            'rgb(147,190,250)',
            'rgb(40,62,129)',
            'rgb(182,160,15)',
          ],
          tooltip: {
            trigger: 'axis',
            formatter: function (param: any) {
              let relVal = param[0].name;
              for (let i = 0, l = param.length; i < l; i++) {
                relVal +=
                  '<br/>' +
                  param[i].marker +
                  param[i].seriesName +
                  ' : ' +
                  param[i].value +
                  '(KW·h)';
              }
              return relVal;
            },
          },
          legend: {
            data: res?.data?.series?.map((item: any) => item.name),
          },
          xAxis: {
            type: 'category',
            data: res?.data?.data,
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} kwh',
            },
          },
          series: res?.data?.series?.map((item: any) => ({
            ...item,
            smooth: true,
            type: 'line',
          })),
        };
        myChart.setOption(option);
      }
    });
  };
  const handleSearch = (param: any = [], tree = []) => {
    form.validateFields().then((values: any) => {
      let { paramValue, timeType, time } = values;
      paramValue = paramValue.length ? paramValue : param;
      let startTime;
      let endTime;
      if (timeType === 0) {
        startTime = moment(time).format('YYYY-MM-DD');
      } else if (timeType === 1) {
        startTime = moment(time).startOf('week').format('YYYY-MM-DD');
        endTime = moment(time).endOf('week').format('YYYY-MM-DD');
      } else if (timeType === 2) {
        startTime = moment(time).format('YYYY-MM');
      } else {
        startTime = moment(time).format('YYYY');
      }
      // console.log(treeData)
      const dataList = treeData?.length ? treeData : tree;
      paramValue = dataList
        .filter((item: any) => paramValue.includes(item.key))
        ?.map((item: any) => ({ name: item.title, id: item.key }));
      //@ts-ignore
      const params = {
        ...values,
        startTime,
        endTime,
        paramValue,
        //@ts-ignore
        groupIds:["16"],
      };
      // console.log(params);
      getUsageContrast(params);
      getUsageDataTable(params);
    });
  };
  useEffect(() => {
    if (tableType && itemType) {
      //@ts-ignore
      getParamByItem({
        energyType: tableType,
        itemType,
        //@ts-ignore
        groupIds: 16,
      }).then((res) => {
        const paramValue = res.data?.map(
          ({ id, name }: { id: string; name: string }) => ({
            title: name,
            value: id,
            key: id,
          }),
        );
        setTreeData(paramValue);
        new Promise((resolve, reject) => {
          form.setFieldsValue({ paramValue: [paramValue?.[0]?.value] });
          resolve([paramValue?.[0]?.value, paramValue]);
        }).then((res) => {
          //@ts-ignore
          handleSearch(...res);
        });
      });
    }
    //@ts-ignore
  }, [tableType, itemType]);
  useEffect(() => {
    getItemTypeAction();
  }, []);
  return (
    <div className="elec-con-data">
      <div className="search-handle">
        <Form
          layout="inline"
          form={form}
          onFinish={handleSearch}
          initialValues={{
            timeType: 0,
            time: moment(new Date()),
            tableType: 2,
            itemType: 'energy',
          }}
        >
          <Form.Item label="日期选择" name="timeType">
            <Select
              style={{ width: 80 }}
              placeholder={'请选择'}
              onChange={handleTimeTypeChange}
              options={[
                { label: '日', value: 0 },
                { label: '周', value: 1 },
                { label: '月', value: 2 },
                { label: '年', value: 3 },
              ]}
            />
          </Form.Item>
          <Form.Item name="time">
            {/*// @ts-ignore*/}
            <DatePicker picker={timeType} />
          </Form.Item>
          <Form.Item label="表选择" name="tableType">
            <Select
              style={{ width: 80 }}
              placeholder={'请选择'}
              onChange={(type) => setTableType(type)}
              options={[
                { label: '总表', value: 1 },
                { label: '分表', value: 2 },
              ]}
            />
          </Form.Item>
          <Form.Item label="类型" name="itemType">
            <Select
              style={{ width: 80 }}
              placeholder={'请选择'}
              onChange={(type) => setItemType(type)}
              options={itemTypeOptions}
            />
          </Form.Item>
          <Form.Item label="选择" name="paramValue">
            <TreeSelect
              style={{ width: 180 }}
              placeholder={'请选择'}
              value={['0-0-0']}
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              treeData={treeData}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" className="btn">
              搜索
            </Button>
            <Button ghost onClick={ammeterExportAction}>
              导出
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="scroll-content">
        <div className="chart-content">
          <div className="title">用电数据对比</div>
          <div className="chart" id="chart" ref={chartDom} />
        </div>
        <div className="table-content">
          <div className="title">用电数据列表</div>
          <div className='table-wrapper'>
            <Table
              scroll={{x:3000,y:200}}
              columns={columns}
              dataSource={datasource}
              pagination={false} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeviceCardList;

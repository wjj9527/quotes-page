import React, { useEffect, useRef, useState } from 'react';
import {Popover} from 'antd'
import "./style.less"
import {
  alarmRecordsStatistics,
  deviceAlarmRecords,
  deviceCardGroup,
  deviceGroupRecords,
  deviceOnlineStatistics,
} from '@/http/api/editor';
import getAssets from '@/pages/DeviceStatistics/getAssets';
import * as echarts from 'echarts';
const PopoverContent: React.FC<{ count: number; faultCount: number }> = ({ count, faultCount,}) => {
  return (
    <>
      <div className="count">总数：{count}</div>
      <div className="count">故障：{faultCount}</div>
    </>
  );
};
const DeviceStatistics: React.FC = () => {
  const [deviceCardList,setDeviceCardList] = useState([])
  const scrollRef = useRef(null)
  const deviceStatisticsRef = useRef(null)
  const alarmStatisticsRef = useRef(null)
  const deviceGroupRecordsRef = useRef(null)
  const deviceAlarmRecordsRef= useRef(null)
  const getDeviceCardGroup = ()=>{
    deviceCardGroup().then(res=>{
      const {data} = res
      setDeviceCardList(data)
    })
  }
  const handleScroll = (post:'left'|'right') => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      if (post === 'left') {
        // @ts-ignore
        scrollContainer.scrollTo({ left: scrollContainer.scrollLeft-212, behavior: 'smooth' });
      }else{
        // @ts-ignore
        scrollContainer.scrollTo({ left: scrollContainer.scrollLeft+212, behavior: 'smooth' });
      }
    }
  };
  const setDeviceOnlineBlock = ()=>{
    deviceOnlineStatistics().then(res=>{
      const {data,series} = res.data
      let titleObj = {
        text: '设备离在线统计',
      }
      let tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      };
      let yAxis = {
        type: 'value',
        name: '数量',
        axisLabel: {
          formatter: '{value}',
        },
      };
      let xAxis = {
        type: 'category', // y轴类型为数值型
        name: '设备组',
        data,
      };
      const chart = echarts.init(deviceStatisticsRef.current, );
      chart.setOption(
        {
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
          yAxis,
          xAxis,
          tooltip,
          legend: {
            show: true,
            orient: 'horizontal',
            left:'right',
            top:'top'
          },
          title: titleObj,
          series:series.map((item:any)=>{
            Object.assign(item,{type:'bar',})
            return item
          })
        },
        true,
      );
    })
  }
  const setAlarmRecordsBlock = ()=>{
    alarmRecordsStatistics().then(res=>{
      const {data,series} = res.data
      console.log(res)
      let titleObj = {
        text: '月度报警统计',
      };
      let yAxis = {
        type: 'value',
        name: '数量',
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          // @ts-ignore
          show: true,
          lineStyle: {
            color: "#dddddd",
            type: "dashed",
          },
        },
      };
      let tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      };
      let xAxis = {
        type: 'category', // y轴类型为数值型
        name: "时间",
        //@ts-ignore
        data: data || null,
        splitLine: {
          // @ts-ignore
          show: true,
          lineStyle: {
            color: "#dddddd",
            type: "solid",
          },
        },
      };
      //图例
      let legend = {show: true, orient: 'horizontal', left: 'right', top: 'top'};
      const chart = echarts.init(alarmStatisticsRef.current, );
      chart.setOption(
        {
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
          yAxis,
          xAxis,
          tooltip,
          legend,
          title: titleObj,
          series:series?.map((item: any) => {
            item.type = 'line';
            item.smooth = true;
            return item;
          })
        },
        true,
      );
    })
  }
  const setDeviceGroupBlock =()=>{
    deviceGroupRecords().then(res=>{
      const {data} = res
      const chart = echarts.init(deviceGroupRecordsRef.current, );
      const source = [...data];
      source.sort((a, b) => a.value - b.value);
      let titleObj = {
        text: "设备组占比",
      };
      let legend = {
        show: true,
          orient: 'vertical',
          left:'right',
          top:'center'
      }
      chart.setOption(
        {
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
          title: titleObj,
          legend,
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          series: [
            {
              name: '  ',
              // roseType: 'radius',
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c} ({d}%)',
              },
              type: 'pie',
              // radius: chartType === 'doughnutPoe' ? ['30%', '60%'] : '60%',
              data:source,
            },
          ],
        },
        true,
      );
    })
  }
  const setDeviceAlarmRecords=()=>{
    deviceAlarmRecords().then(res=>{
      const {data} = res
      const chart = echarts.init(deviceAlarmRecordsRef.current, );
      const source = [...data];
      source.sort((a, b) => a.value - b.value);
      let titleObj = {
        text: "设备组占比",
      };
      let legend = {
        show: true,
        orient: 'vertical',
        left:'right',
        top:'center'
      }
      chart.setOption(
        {
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
          title: titleObj,
          legend,
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          series: [
            {
              name: '  ',
              // roseType: 'radius',
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c} ({d}%)',
              },
              type: 'pie',
              radius: ['30%', '60%'],
              data:source,
            },
          ],
        },
        true,
      );
    })
  }
  useEffect(()=>{
    getDeviceCardGroup()
    setDeviceOnlineBlock()
    setAlarmRecordsBlock()
    setDeviceGroupBlock()
    setDeviceAlarmRecords()
  },[])
  return <div className="page-content device-statistics">
    <div className='banner-card-group'>
      <div className="arrow-btn left" onClick={handleScroll.bind(this,'left')}>
        <i className="iconfont icon-arrowleft" />
      </div>
      <div className='scroll-container' ref={scrollRef}>
        <div className='scroll-inner'>
          {
            deviceCardList.map((item:any)=>
              (
                <Popover
                  placement="top"
                  content={
                    <PopoverContent count={item.num} faultCount={item.faultNum} />
                  }
                  trigger="hover"
                >
                  <div className='card' style={{ backgroundImage: `url(${getAssets(item.name)})` }}>
                    <div className='title'>
                      {item.name}
                    </div>
                    {
                      item.faultNum&&<div className="badge" />
                    }
                  </div>
                </Popover>
              )
            )
          }
        </div>
      </div>
      <div className="arrow-btn right" onClick={handleScroll.bind(this,'right')}>
        <i className="iconfont icon-arrowright" />
      </div>
    </div>
    <div className='chart-line'>
      <div className='chart-content large left' >
        <div className='chart' ref={deviceStatisticsRef}/>
      </div>
      <div className='chart-content'>
        <div className='chart' ref={deviceGroupRecordsRef}/>
      </div>
    </div>
    <div className='chart-line'>
      <div className='chart-content left'>
        <div className='chart' ref={deviceAlarmRecordsRef}/>
      </div>
      <div className='chart-content large'>
        <div className='chart' ref={alarmStatisticsRef}/>
      </div>
    </div>
  </div>;
};

export default DeviceStatistics;

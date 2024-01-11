import React, {useEffect, useState} from "react";
// import NavTitle from "@/components/NavTitle";
import {Form, Input, Select, Table, Button, Radio, Switch, Modal, message} from 'antd'
import TableResizeContainer from "@/components/TableResizeContainer";
import {
  gangControlList,
  engineType,
  triggerRules,
  startRuleTask,
  stopRuleTask,
  deleteRuleTask
} from "@/http/api/editor";
import './style.less'
import {ColumnsType} from "antd/es/table";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import RulesSettingDialog from './components/RulesSettingDialog'
interface TableIndexesProps {
  triggerRuleId?:null|React.Key,
  engineModeId?:null|React.Key,
  triggerStatus?:null|1|2,
  keyword?:string|null,
  pageNo:number,
  pageSize:number
}
interface DataType {
  jobName:string;
  triggerStatus:0|1;
  desc:string;
  triggerRuleName:string;
  engineModeName:string;
  executionAction:string;
  id:React.Key;
}
const weekOptions = [
  '',
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
const getColumns = (
  handleSwitchCheck:(id:React.Key,isStart:boolean)=>void,
  handleDelete:(ids:React.Key[])=>void,
  handleUpdate:(id:React.Key)=>void,
  handleSetting:(id:React.Key)=>void
) =>{
  const columns:ColumnsType<DataType>= [
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '执行情况',
      dataIndex: 'triggerStatus',
      render:(_,record)=>{
        return <Switch checked={_===1} onClick={(status)=>handleSwitchCheck(record.id,status)}/>
      }
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '触发规则',
      dataIndex: 'triggerRuleName',
    },
    {
      title: '时间设定',
      dataIndex: 'week',
      render:(_)=>_?.split(',')?.map((i:number)=>weekOptions[i])?.join(',')
    },
    {
      title: '引擎方式',
      dataIndex: 'engineModeName',
    },
    {
      title: '执行动作',
      dataIndex: 'executionAction',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width:400,
      render:(_,record)=>{
        return <>
          {/*<Button type="link">查看</Button>*/}
          {record.triggerStatus===0&&<Button type="link" onClick={handleUpdate.bind(this,_)}>编辑</Button>}
          {record.triggerStatus===0&& <Button type="link" onClick={handleSetting.bind(this,_)}>逻辑设定</Button>}
          {/*<Button type="link">执行记录</Button>*/}
          {record.triggerStatus===0&&  <Button type="link" danger onClick={handleDelete.bind(this,[_])}>删除</Button>}
        </>
      }
    },
  ]
  return columns
}
const GangControl: React.FC = () => {
  const [dataSource,setDataSource] = useState([])
  const [total,setTotal] = useState(0)
  const [targetId,setTargetId] = useState<null|number|string|React.Key>(null)
  const [tableScrollHeight,setTableScrollHeight] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [engineTypeOptions,setEngineTypeOptions] = useState([])
  const [triggerRulesOptions,setTriggerRulesOptions] = useState([])
  const [tableIndexes,setTableIndexes] = useState<TableIndexesProps>({
    triggerRuleId:null,
    engineModeId:null,
    triggerStatus:null,
    keyword:null,
    pageNo:1,
    pageSize:10
  })
  const [dialogCreateVisible,setDialogCreateVisible] = useState(false)
  const [dialogUpdateVisible,setDialogUpdateVisible] = useState(false)
  const [dialogRulesSettingVisible,setDialogRulesSettingVisible] = useState(false)
  const [handleRef] = Form.useForm()
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const getDataSource = ()=>{
    gangControlList(tableIndexes).then(res=>{
      const {total,data} = res
      setDataSource(data)
      setTotal(total)
    })
  }
  const getOptions = ()=>{
    engineType().then(res=>{
      const {data} = res
      const options = data.map(({typeName,id}:{typeName:string,id:React.Key})=>({label:typeName,value:id}))
      setEngineTypeOptions(options)
    })
    triggerRules().then(res=>{
      const {data} = res
      const options = data.map(({typeName,id}:{typeName:string,id:React.Key})=>({label:typeName,value:id}))
      setTriggerRulesOptions(options)
    })
  }
  const handleSearch = (values:any)=>{
    const indexes = {...tableIndexes,...values}
    setTableIndexes(indexes)
  }
  const handleCurrentChange = (pageNo:number,pageSize:number)=>{
    const indexes = {...tableIndexes,pageNo,pageSize}
    setTableIndexes(indexes)
  }
  const toggleTaskAction = (id:React.Key,isStart:boolean)=>{
    if (isStart) {
      startRuleTask({id}).then(getDataSource)
    }else{
      stopRuleTask({id}).then(getDataSource)
    }
  }
  const handleUpdate = (id:React.Key)=>{
    setTargetId(id)
    setDialogUpdateVisible(true)
  }
  const handleSetting = (id:React.Key)=>{
    setTargetId(id)
    setDialogRulesSettingVisible(true)
  }
  const handleReset = ()=>{
    handleSearch({
      triggerRuleId:null,
      engineModeId:null,
      triggerStatus:null,
      keyword:null,
    })
  }
  const handleDelete = (ids:React.Key[])=>{
    Modal.confirm({
      title:'提示',
      content:'删除后数据不可恢复，是否确认删除？',
      onOk(){
        deleteRuleTask({ids:ids.join(',')}).then(()=>{
          getDataSource()
          message.success('删除成功')
        })
      }
    })
  }
  useEffect(()=>{
    getDataSource()
  },[tableIndexes])
  useEffect(()=>{
    getOptions()
  },[])
  return <div className="default-page-body gang-control page-content">
    {/*<NavTitle nav={['联动控制']}/>*/}
    <CreateDialog visible={dialogCreateVisible} onClose={setDialogCreateVisible.bind(this,false)} onUpdate={getDataSource}/>
    <UpdateDialog visible={dialogUpdateVisible} id={targetId} onClose={setDialogUpdateVisible.bind(this,false)} onUpdate={getDataSource}/>
    <RulesSettingDialog visible={dialogRulesSettingVisible} id={targetId} onClose={setDialogRulesSettingVisible.bind(this,false)} onUpdate={getDataSource}/>
    <div className="table-content">
      <div className="handle-group">
        <div className="btn-group">
          <Button type="primary" icon={<i className="iconfont icon-xinzeng"/>} onClick={setDialogCreateVisible.bind(this,true)} className="handle-btn" >新增模块</Button>
          <Button type="primary" danger icon={<i className="iconfont icon-shanchu"/>} onClick={handleDelete.bind(this,selectedRowKeys)} className="handle-btn">批量删除</Button>
        </div>
        <Form
          layout="inline"
          onFinish={handleSearch}
          onReset={handleReset}
          form={handleRef}
          initialValues={{triggerStatus:null}}
        >
          <Form.Item label="引擎方式" name="engineModeId">
            <Select style={{width:150,}} options={engineTypeOptions} placeholder="请选择" />
          </Form.Item>
          <Form.Item label="触发规则" name="triggerRuleId">
            <Select style={{width:150,}} options={triggerRulesOptions} placeholder="请选择"/>
          </Form.Item>
          <Form.Item label="执行情况" name="triggerStatus">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="关键字" name="keyword">
            <Input style={{width:150,}} placeholder="请输入"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset">重置</Button>
          </Form.Item>
        </Form>
      </div>
      <div className="content-view">
        <TableResizeContainer onSet={(height)=>setTableScrollHeight(height)}>
          <Table rowKey={(item)=>item.id} columns={getColumns(toggleTaskAction,handleDelete,handleUpdate,handleSetting)} pagination={{total,pageSize:tableIndexes.pageSize,current:tableIndexes.pageNo,onChange:handleCurrentChange}} rowSelection={rowSelection}  scroll={{y:tableScrollHeight}} dataSource={dataSource}/>
        </TableResizeContainer>
      </div>
    </div>
  </div>
}

export default GangControl

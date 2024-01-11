import React, {useEffect, useState} from "react";
import {Button, Modal, Select, Cascader, InputNumber, Input, message} from 'antd'
import "./style.less"
import {
  deleteEngineRuleCondById,
  deleteEngineTaskRuleById, deleteEngRuleExecuteById,
  deviceParamsList,
  getAllEngineRule,
  updateRuleTaskLogic
} from "@/http/api/editor";
const executionTypeOptions = [
  {value:100,label:'设备下发'},
  {value:101,label:'告警推送'},
]
const conditionTypeOptions = [
  {value:1,label:'设备监控'},
  {value:2,label:'持续时常'},
]
const contrastOptions = [
  {value:'=',label:'='},
  {value:'>',label:'>'},
  {value:'<',label:'<'},
  {value:'!=',label:'!='},
]
const retentionTypeOptions = [
  {value:'保持',label:'保持'},
  {value:'延迟',label:'延迟'},
]
const matchRuleOptions = [
  {value:1,label:'匹配所有'},
  {value:2,label:'匹配任意'},
]
const runLogicOptions = [
  {value:1,label:'顺序'},
  {value:2,label:'并行'},
]

interface DialogProps {
  visible: boolean;
  onUpdate: () => void;
  onClose: () => void;
  id:null|number|string|React.Key;
}
const RulesSettingDialog: React.FC<DialogProps> = ({visible,onClose,onUpdate,id}) => {
  const [deviceOptions, setDeviceOptions] = useState([])
  const [dataSource,setDataSource] = useState<any>({})
  const getDataSource = ()=>{
    getAllEngineRule({taskId:id}).then(res=>{
      const {data} = res
      if (data) {
        const source = data?.engTaskRuleList?.map((item:any)=>{
          let {ruleCondInfoList,ruleExecuteInfoList} = item
          ruleCondInfoList.map((i:any)=>{
            i.id = i.engRuleCondId
            return i
          })
          ruleExecuteInfoList.map((i:any)=>{
            i.id = i.engRuleExecuteId
            return i
          })
          item.ruleCondInfoList = ruleCondInfoList
          item.ruleExecuteInfoList = ruleExecuteInfoList
          return item
        })
        console.log(data)
        setDataSource({...data,engTaskRuleList:source}||{
          engTaskRuleList:[],
          taskId:id,
          runLogic:1
        })
      }else{
        setDataSource({
          engTaskRuleList:[],
          taskId:id,
          runLogic:1
        })
      }
    })
  }
  const createEngineTaskRuleList = ()=>{
    dataSource.engTaskRuleList.push({
      matchRule:1,
      ruleCondInfoList:[],
      ruleExecuteInfoList:[],
      taskId:id
    })
    setDataSource(JSON.parse(JSON.stringify(dataSource)))
  }
  const deleteEngineTaskRule = (index:number,target:any)=>{
    const deleteItemByIndex = ()=>{
      dataSource.engTaskRuleList.splice(index,1)
      setDataSource(JSON.parse(JSON.stringify(dataSource)))
    }
    if (target.id) {
      deleteEngineTaskRuleById({id:target.id}).then(()=>{
        deleteItemByIndex()
      })
    }else {
      deleteItemByIndex()
    }
  }
  const deleteEngineRuleCond = (index:number,list:any[],target:any)=>{
    const deleteItemByIndex = ()=>{
      list.splice(index,1)
      setDataSource(JSON.parse(JSON.stringify(dataSource)))
    }
    if (target.engRuleCondId) {
      deleteEngineRuleCondById({engRuleCondId:target.engRuleCondId}).then(()=>{
        deleteItemByIndex()
      })
    }else{
      deleteItemByIndex()
    }
  }
  const deleteEngRuleExecute = (index:number,list:any[],target:any)=>{
    const deleteItemByIndex = ()=>{
      list.splice(index,1)
      setDataSource(JSON.parse(JSON.stringify(dataSource)))
    }
    if (target.engRuleExecuteId) {
      deleteEngRuleExecuteById({engRuleExecuteId:target.engRuleExecuteId}).then(()=>{
        deleteItemByIndex()
      })
    }else{
      deleteItemByIndex()
    }
  }
  const getDeviceParams = () => {
    deviceParamsList().then((res) => {
      const {data} = res;
      const value = data?.map((item: any) => {
        const {deviceGroupId, deviceGroupName, deviceInfoList} = item;
        return {
          value: deviceGroupId,
          label: deviceGroupName,
          type: 'group',
          children: deviceInfoList?.map((item: any) => {
            const {deviceId, deviceName, deviceParamValueList} = item;
            return {
              value: deviceId,
              label: deviceName,
              type: 'device',
              children: deviceParamValueList?.map((item: any) => {
                const {devicePointConfigId, itemsName} = item;
                return {
                  value: devicePointConfigId,
                  type: 'item',
                  label: itemsName,
                };
              }),
            };
          }),
        };
      });
      setDeviceOptions(value)
    })
  }
  const deviceItemValueChange = (value:any,item:any,key:string)=>{
    if (key === 'deviceRelIds') {
      const devicePointConfigId = value[2]
      value = value.join(',')
      item.devicePointConfigId = devicePointConfigId
    }
    item[key] = value
    const source = JSON.parse(JSON.stringify(dataSource))
    setDataSource(source)
  }
  const handleSubmit = ()=>{
    dataSource.engTaskRuleList=dataSource?.engTaskRuleList?.map((item:any,index:number)=>{
      item.step = index+1

      item.ruleCondInfoList = item.ruleCondInfoList.map((i:any,idx:number)=>{
        i.serialNum = idx+1
        return i
      })

      item.ruleExecuteInfoList = item.ruleExecuteInfoList.map((i:any,idx:number)=>{
        i.serialNum = idx+1
        return i
      })

      return item
    })

    updateRuleTaskLogic(dataSource).then(()=>{
      message.success('编辑成功')
      onClose()
    })
  }
  useEffect(() => {
    getDeviceParams()
    getDataSource()
  }, [visible])
  return <Modal title="逻辑编辑" open={visible} width={1100} onOk={handleSubmit} onCancel={onClose}>
    <div className="dialog-content rules-setting">
      <div className="line">
        <div className="label">运行逻辑</div>
        <div className="content"><Select options={runLogicOptions} className="setting-select" onChange={(value)=>deviceItemValueChange(value,dataSource,'runLogic')} value={dataSource.runLogic}/></div>
      </div>
      {
        dataSource?.engTaskRuleList?.map((item:any,index:number)=>(
          <div key={item.id} className="block">
            <div className="delete-btn" onClick={deleteEngineTaskRule.bind(this,index,item)}>
              <i className="iconfont icon-closefill"/>
            </div>
            <div className="block-line">
              <div className="label">STEP {index+1}</div>
              <Select onChange={(value)=>deviceItemValueChange(value,item,'matchRule')} className="setting-select" options={matchRuleOptions} value={item.matchRule}/>
            </div>
            <div className="handle-block">
              <div className="btn-group-line">
                <div className="title">条件列表</div>
                <div className="btn">
                  <Button type="primary" size="small" onClick={deviceItemValueChange.bind(this,[...item.ruleCondInfoList,{
                    compareValue:0,
                    devicePointConfigId:null,
                    deviceRelIds:null,
                    engRuleCondId:null,
                    extend:'延迟',
                    judgingCond:'=',
                    modeType:2,
                    time:0,
                    taskRuleId:null
                  }],item,'ruleCondInfoList')}>新增</Button>
                </div>
              </div>
              {
                item?.ruleCondInfoList?.map((i:any,index:number)=>(
                  <div key={index} className="handle-block-line">
                    <div className="left">
                      <div className="handle-block-line-name">
                        条件 {index+1}
                      </div>
                      <Select className="handle-input" onChange={(value)=>deviceItemValueChange(value,i,'modeType')}  options={conditionTypeOptions} value={i.modeType}/>
                      <Cascader allowClear={false} value={i?.deviceRelIds?.split(',').map((id:string)=>Number(id))} options={deviceOptions} style={{width:280,marginRight:12}} onChange={(value)=>deviceItemValueChange(value,i,'deviceRelIds')}/>
                      <Select onChange={(value)=>deviceItemValueChange(value,i,'judgingCond')} className="handle-input" value={i.judgingCond} style={{width:80}} options={contrastOptions}/>
                      <InputNumber onChange={(value)=>deviceItemValueChange(value,i,'compareValue')} style={{width:80}} value={i.compareValue}/>
                      {
                        i.modeType===2&&(<div className="inner">
                          {/*<Checkbox/>*/}
                          <Select onChange={(value)=>deviceItemValueChange(value,i,'extend')} value={i.extend} className="handle-input" style={{width:80}}  options={retentionTypeOptions}/>
                          <InputNumber onChange={(value)=>deviceItemValueChange(value,i,'time')} value={i.time} style={{width:80}} addonAfter={'s'}/>
                        </div>)
                      }
                    </div>
                    <div className="right">
                      <Button type="link" onClick={deleteEngineRuleCond.bind(this,index,item?.ruleCondInfoList,i)} danger>删除</Button>
                    </div>
                  </div>
                ))
              }

            </div>
            <div className="handle-block">
              <div className="btn-group-line">
                <div className="title">执行列表</div>
                <div className="btn">
                  <Button type="primary" size="small" onClick={deviceItemValueChange.bind(this,[
                    ...item.ruleExecuteInfoList,
                    {
                      devicePointConfigId:null,
                      deviceRelIds:null,
                      issueValue:0,
                      modeType:100
                    },
                  ],item,'ruleExecuteInfoList')}>新增</Button>
                </div>
              </div>
              {
                item?.ruleExecuteInfoList?.map((i:any,index:number)=>(<div key={index} className="handle-block-line">
                  <div className="left">
                    <div className="handle-block-line-name">
                      执行 {index+1}
                    </div>
                    <Select onChange={(value)=>deviceItemValueChange(value,i,'modeType')} value={i.modeType} className="handle-input"  options={executionTypeOptions}/>
                    {
                      i.modeType===101?(<Input onChange={(value)=>deviceItemValueChange(value.target.value,i,'issueValue')} value={i.issueValue} className="handle-input" style={{width:465}}/>):(<>
                        <Cascader value={i?.deviceRelIds?.split(',').map((id:string)=>Number(id))} options={deviceOptions} style={{width:280,marginRight:12}} onChange={(value)=>deviceItemValueChange(value,i,'deviceRelIds')}/>
                        <Input className="handle-input" style={{width:80}} value={'='}/>
                        <InputNumber onChange={(value)=>deviceItemValueChange(value,i,'issueValue')}  value={i.issueValue} style={{width:80}}/>
                      </>)
                    }
                  </div>
                  <div className="right">
                    <Button type="link" onClick={deleteEngRuleExecute.bind(this,index,item?.ruleExecuteInfoList,i)} danger>删除</Button>
                  </div>
                </div>))
              }
            </div>
          </div>
        ))
      }

      <div className="add-line" onClick={createEngineTaskRuleList}>
        <i className="iconfont icon-Plus"/>
        添加
      </div>
    </div>
  </Modal>
}

export default RulesSettingDialog

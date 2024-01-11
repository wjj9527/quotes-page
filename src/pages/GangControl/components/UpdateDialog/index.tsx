import React, {useEffect, useState} from "react";
import {Modal, Form, Row, Col, Input, Checkbox, Radio, TimePicker, Select, InputNumber, message} from 'antd'
import {engineType, ruleTaskDetails, triggerRules, updateRuleTask} from "@/http/api/editor";
import moment from "moment";
const weekOptions = [
  {
    label:"星期日",
    value:1
  },
  {
    label:"星期一",
    value:2
  },
  {
    label:"星期二",
    value:3
  },
  {
    label:"星期三",
    value:4
  },
  {
    label:"星期四",
    value:5
  },
  {
    label:"星期五",
    value:6
  },
  {
    label:"星期六",
    value:7
  },
]
interface DialogProps {
  visible: boolean;
  onUpdate: () => void;
  onClose: () => void;
  id:null|number|string|React.Key
}
const UpdateDialog: React.FC<DialogProps> = ({onUpdate,onClose,visible,id}) => {
  const [week,setWeek] = useState<number[]|string[]>([])
  const [engineTypeOptions,setEngineTypeOptions] = useState([])
  const [triggerRulesOptions,setTriggerRulesOptions] = useState([])
  const [currentRule,setCurrentRule] = useState<React.Key>(602)
  const [currentExecutionMode,setCurrentExecutionMode] = useState<string|number>(1)
  const [formRef] = Form.useForm()
  //
  const handleWeekAllCheck = (e:any)=>{
    if (e.target.checked) {
      setWeek([1,2,3,4,5,6,7])
      formRef.setFieldValue('week',[1,2,3,4,5,6,7])
    }else{
      setWeek([])
      formRef.setFieldValue('week',null)
    }
  }
  const handleWeekCheck = (e:any)=>{
    setWeek(e)
    formRef.setFieldValue('week',e)
  }
  const getOptions = ()=>{
    triggerRules().then(res=>{
      const {data} = res
      const options = data.map(({typeName,id}:{typeName:string,id:React.Key})=>({label:typeName,value:id}))
      setTriggerRulesOptions(options)
    })
    engineType().then(res=>{
      const {data} = res
      const options = data.map(({typeName,id}:{typeName:string,id:React.Key})=>({label:typeName,value:id}))
      setEngineTypeOptions(options)
    })
  }
  const handleRuleChange = (e:React.Key)=>{
    setCurrentRule(e)
  }
  const handleSubmit = ()=>{
    formRef.validateFields().then((values)=>{
      let {endTime,startTime,week} = values
      endTime = endTime?.format('HH:mm')
      startTime = startTime?.format('HH:mm')
      week = week?.join(',')
      const params = {...values,startTime,endTime,week,id}
      updateRuleTask(params).then(()=>{
        message.success('编辑成功')
        onUpdate()
        handleClose()
      })
    })
  }
  const getDataSource = ()=>{
    ruleTaskDetails({id}).then(res=>{
      const {data} = res
      let {week,startTime,endTime,executionMode,triggerRuleId} = data
      if (startTime) {
        startTime = moment(startTime,'HH:mm')
      }
      if (endTime) {
        endTime = moment(endTime,'HH:mm')
      }
      week = week?.split(',').map((i:string|number)=>Number(i))
      setWeek(week)
      setCurrentRule(triggerRuleId)
      setCurrentExecutionMode(executionMode)
      formRef.setFieldsValue({...data,startTime,endTime,week,})
    })
  }
  const handleClose = ()=>{
    formRef.resetFields()
    onClose()
  }
  useEffect(()=>{
    if (visible) {
      getOptions()
      getDataSource()
    }
  },[visible])
  // @ts-ignore
  return <Modal open={visible} title="编辑" width={840} onCancel={handleClose} onOk={handleSubmit}>
    <div className="dialog-content">
      <Form labelCol={{span:3}} form={formRef}>
        <Row>
          <Col span={12} >
            <Form.Item label="计划名称" labelCol={{span:6}} name="jobName" rules={[{required:true}]}>
              <Input placeholder="请输入"/>
            </Form.Item>
          </Col>
          <Col span={12} >
            <Form.Item label="引擎方式" labelCol={{span:6}} name="engineModeId" rules={[{required:true}]}>
              <Select placeholder="请选择" options={engineTypeOptions}/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="描述" name="desc" rules={[{required:true}]}>
          <Input placeholder="请输入"/>
        </Form.Item>
        <Row>
          <Col span={12} >
            <Form.Item label="触发规则"  labelCol={{span:6}} name="triggerRuleId" rules={[{required:true}]}>
              <Select placeholder="请选择" options={triggerRulesOptions} onChange={handleRuleChange}/>
            </Form.Item>
          </Col>
        </Row>
        {
          currentRule===602&&(<>
            <Form.Item label="执行周期" name="week" rules={[{required:true}]}>
              {/*@ts-ignore*/}
              <Checkbox onChange={handleWeekAllCheck} indeterminate={week?.length>0&&week.length<weekOptions.length} checked={week?.length===weekOptions.length}>全部</Checkbox>
              {/*@ts-ignore*/}
              <Checkbox.Group options={weekOptions} value={week} onChange={handleWeekCheck} />
            </Form.Item>
            <Form.Item label="执行方式" name="executionMode" rules={[{required:true}]}>
              {/*@ts-ignore*/}
              <Radio.Group onChange={(e)=>{
                setCurrentExecutionMode(e.target.value)
              }}>
                <Radio value={1}>周期</Radio>
                <Radio value={2}>单次</Radio>
              </Radio.Group>
            </Form.Item>
            {
              currentExecutionMode===1?(<Row>
                <Col span={8}>
                  <Form.Item label="开始时间" labelCol={{span:9}} name="startTime" rules={[{required:true}]}>
                    <TimePicker format={'HH:mm'}/>
                  </Form.Item>
                </Col>
                <Col span={8} >
                  <Form.Item  label="结束时间" labelCol={{span:9}} name="endTime" rules={[{required:true}]}>
                    <TimePicker format={'HH:mm'}/>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="循环时间" labelCol={{span:9}} name="scheduleConf" rules={[{required:true}]}>
                    <InputNumber placeholder="请输入" addonAfter="秒"/>
                  </Form.Item>
                </Col>
              </Row>):(<Form.Item label="时间设定" name="startTime" rules={[{required:true}]}>
                <TimePicker format={'HH:mm'}/>
              </Form.Item>)
            }
          </>)
        }
        {
          currentRule===601&&(
            <Form.Item label="循环时间"  name="scheduleConf" rules={[{required:true}]}>
              <InputNumber placeholder="请输入" addonAfter="秒"/>
            </Form.Item>
          )
        }
      </Form>
    </div>
  </Modal>
}

export default UpdateDialog

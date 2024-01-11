import React, { useState } from 'react';
import { message, Modal, Slider } from 'antd';
import type { SliderMarks } from 'antd/es/slider';
import { dispatchPointValue } from '@/http/api/editor';
const InputBtn:React.FC<any> =({setting,pointId})=>{
  // console.log(setting)
  const [settingValue] = setting
  const [visible,setVisible] = useState(false)
  const [inputValue,setInputValue] = useState(null)
  const handleDispatch = ()=>{
    setVisible(false)
    dispatchPointValue([{devicePointConfigId: pointId, szValue: inputValue}]).then(res=>{
      message.success('下发成功')
    })
  }


  return <>
    <div className="input-btn-container" onClick={setVisible.bind(this,true)}>
      设置
    </div>
    <Modal title="输入" open={visible} okText="确认" cancelText="取消" onOk={handleDispatch} onCancel={setVisible.bind(this,false)}>
      {/*// @ts-ignore*/}
      <Slider min={settingValue?.min} max={settingValue?.max} value={inputValue} onChange={(e)=>setInputValue(e)} />
    </Modal>
  </>
}

export default InputBtn

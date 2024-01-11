import React, { useState } from 'react';
import { message, Modal, Slider } from 'antd';
import { dispatchPointValue } from '@/http/api/editor';
const InputBtn:React.FC<any> =({setting,pointId})=>{
  const [visible,setVisible] = useState(false)
  const [inputValue,setInputValue] = useState(null)
  let marks = {}
  let min: number | null = null
  let max: number | null = null
  setting.forEach((item: { value: string | number; displayText: any; })=>{
    // @ts-ignore
    marks[item.value] = item.displayText
    if (min === null||Number(item.value)<min) {
      min = Number(item.value)
    }
    if (max === null||Number(item.value)>max) {
      max = Number(item.value)
    }
  })
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
      <Slider marks={marks} max={max} min={min} value={inputValue} onChange={(e)=>{
        // @ts-ignore
        setInputValue(e)
      }} />
    </Modal>
  </>
}

export default InputBtn

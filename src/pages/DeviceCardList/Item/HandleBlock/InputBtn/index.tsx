import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { dispatchPointValue } from '@/http/api/editor';
const InputBtn:React.FC<any> =({pointId})=>{
  const [visible,setVisible] = useState(false)
  const [inputValue,setInputValue] = useState('')
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
      <Input placeholder="请输入下发参数" value={inputValue} onChange={(e)=>{
        setInputValue(e.target.value)
      }}/>
    </Modal>
  </>
}

export default InputBtn

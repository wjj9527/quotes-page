import React from 'react';
import { message, Modal } from 'antd';
import { dispatchPointValue } from '@/http/api/editor';
const OnAndOffBtn: React.FC<any> = ({ pointId, setting }) => {
  console.log(setting);
  const [modal, contextHolder] = Modal.useModal();
  const handleClick = (status: 1 | 0) => {
    const handleDispatch = () => {
      dispatchPointValue([
        { devicePointConfigId: pointId, szValue: status },
      ]).then((res) => {
        message.success('下发成功');
      });
    };
    // console.log(status)
    modal.confirm({
      title: '提示',
      content: '是否确认本次操作？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        handleDispatch();
      },
    });
  };
  return (
    <div className="on-and-off-btn-group">
      {setting?.map((item: any, index: number) => (
        <div
          className={`${index === 0 ? 'on-btn' : 'off-btn'} action-btn`}
          onClick={handleClick.bind(this, item.value)}
        >
          {item.displayText}
        </div>
      ))}

      {/*<div className='off-btn action-btn' onClick={handleClick.bind(this,0)}>OFF</div>*/}
      {contextHolder}
    </div>
  );
};
export default OnAndOffBtn;

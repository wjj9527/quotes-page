import React, { useEffect } from 'react';
import getAssets from './getAssets';
import StatusBlock from './StatusBlock';
import HandleBlock from './HandleBlock';
interface IProps {
  source: object | any;
}
const Item: React.FC<IProps> = ({ source }) => {
  const { equipName, deviceGroupName, issueList, readList, status } = source;
  return (
    <div className="device-card-item">
      <div className="device-title">{equipName}</div>
      <div className="status-and-address-container">
        <div className="status-icon">
          <img src={getAssets(status)} alt="" className="icon-img" />
        </div>
        <div className="address-container">
          {/*<div className='text'><i className='iconfont icon-dizhi'/>{azFloor}</div>*/}
          <div className="text">
            <i className="iconfont icon-gongnengleixing" />
            {deviceGroupName}
          </div>
        </div>
      </div>
      {readList?.length && <StatusBlock source={readList} />}
      {issueList?.length && <HandleBlock source={issueList} />}
    </div>
  );
};

export default Item;

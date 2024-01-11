import React from 'react';
import OnAndOffBtn from './OnAndOffBtn';
import InputBtn from './InputBtn';
import SliderBtn from './SliderBtn';
import MultipleSliderBtn from './MultipleSliderBtn'
interface IProps{
  source:any[]|any
}

const HandleBlock:React.FC<IProps> = ({source})=>{
  return <div className="scroll-block hig">
    {
      source?.map((item:any)=>(<div className='status-item' key={item.id}>
        <div className='status-label'><i className='iconfont icon-canshushezhi'/>{item.parameterName}</div>
        <div className='status-content'>
          {item.displayType===1&&<InputBtn pointId={item.pointId?item.configId:null}/>}
          {item.displayType===2&&<OnAndOffBtn pointId={item.pointId?item.configId:null} setting={item.displaySettings}/>}
          {item.displayType===3&&<SliderBtn pointId={item.pointId?item.configId:null} setting={item.displaySettings}/>}
          {item.displayType===4&&<MultipleSliderBtn pointId={item.pointId?item.configId:null} setting={item.displaySettings}/>}
        </div>
      </div>))
    }
  </div>
}

export default HandleBlock

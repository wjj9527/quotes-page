import React from 'react';
interface IProps{
  source:any[]|any
}
const StatusBlock:React.FC<IProps> = ({source})=>{
  // console.log(source)
  //@ts-ignore
  const renderText = ({pointValue,displayType,displaySettings})=>{
    const [setting] = displaySettings||[]
    if (displayType === 3) {
      if (Number(pointValue) === 0) {
        return '停止'
      }
      if (Number(pointValue) === 1) {
        return '运行'
      }
      if (!Number(pointValue)) {
        return '--'
      }
    }
    if (displayType === 1) {
      let value = pointValue?pointValue:'-'
      let unit = setting?.unit?setting?.unit:''
      return `${value}${unit}`
    }
    if (displayType === 2) {

      return displaySettings?.find((item: { value: any; })=>item.value===pointValue)?.displayText||'--'
    }
  }
  return <div className='scroll-block'>
    {
      source.map((item:any)=>(
        <div className='status-item' key={item.id}>
          <div className='status-label'>
            <i className='iconfont icon-gongyezujian-yibiaopan'/>{item.parameterName}
          </div>
          <div className='status-content'>
            {renderText(item)}
          </div>
        </div>
      ))
    }
  </div>
}
export default StatusBlock

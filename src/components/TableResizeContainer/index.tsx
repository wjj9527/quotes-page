import React, {useEffect, useRef} from "react";
import './style.less'
interface TableResizeContainerProps {
  onSet:(height:number)=>void
}
const TableResizeContainer: React.FC<TableResizeContainerProps> = ({onSet,children}) => {
  const containerRef = useRef(null)
  const resize = ()=>{
    // @ts-ignore
    if (containerRef?.current?.clientHeight) {
      // @ts-ignore
      onSet(containerRef.current.clientHeight-124)
    }
  }
  useEffect(()=>{
    resize()
    window.addEventListener('resize',resize)
    return ()=>{
      window.removeEventListener('resize',resize)
    }
  },[])
  return <div className="table-resize-container" ref={containerRef}>
    {children}
  </div>
}

export default TableResizeContainer

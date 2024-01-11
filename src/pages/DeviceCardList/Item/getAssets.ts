const getAssets = (status:0|1|2|3|4)=>{
  return [require('./images/error.png'),require('./images/在线.png'),require('./images/停止.png'),require('./images/运行.png'),require('./images/故障.png')][status]
}
export default getAssets

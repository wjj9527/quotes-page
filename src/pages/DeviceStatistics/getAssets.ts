const assets = {
  "人感":require('./images/人感.svg'),
  "排风机":require('./images/排风机.svg'),
  "气表":require('./images/气表.svg'),
  "水表":require('./images/水表.svg'),
  "照明":require('./images/照明.svg'),
  "电表":require('./images/电表.svg'),
  "空调机组":require('./images/空调机组.svg'),
  "给排水":require('./images/给排水.svg'),
  "能量表":require('./images/能量表.svg'),
  "通用":require('./images/通用.svg'),
  "门禁":require('./images/门禁.svg'),
}

export default (label:keyof typeof assets)=>{
  return assets[label]||assets['通用']
}

import { $get, $post, $delete, $put,  } from '../index';

export const menuListGetting = () =>
  $get('/background-editor/editor/menu/queryAll');
export const createMenuItemAction = (data: object) =>
  $post('/background-editor/editor/menu/add', data);
export const deleteMenuItemById = (data: object) =>
  $delete('/background-editor/editor/menu/deleteById', data);
export const getPageSchema = (data: object) =>
  $get('/background-editor/editor/menu/queryByMenuId', data);
export const updateMenuName = (data: object) =>
  $put('/background-editor/editor/menu/edit', data);
export const updateCurrentTargetSchema = (data: object) =>
  $post('/background-editor/editor/menu/insertOrUpdate', data);
export const dispatchPointValue = (data: any) =>
  $post('/module-manage/point/control/pointIssue', data);
export const deviceGroupOptions = () =>
  $get('/background-config-api/device/card/getAllDeviceGroupInfo');
export const schemaPage = (data: any) =>
  $get('/project-manage/project/page/queryByPage', data);
export const electricityConsumptionCard = (data: any) =>
  $post('/background-config-api/usageDetail/topCard', data);
export const tendencyChart = (data: any) =>
  $post('/background-config-api/usageDetail/tendencyChart', data);
export const monthRankingTop = (data: any) =>
  $get('/background-config-api/usageDetail/monthTop', data);
export const itemTypeAction = () =>
  $get('/background-config-api/usageContrast/itemType');
export const getParamByItem = (data: any) =>
  $get('/background-config-api/usageContrast/getParamByItem', data);
export const usageContrast = (data: any) =>
  $post('/background-config-api/usageContrast/usageContrast', data);
export const usageDataTable = (data: any) =>
  $post('/background-config-api/usageContrast/usageContrastTable', data);
export const getItemParam = () =>
  $get('/background-config-api/usageContrast/getItemParam');
export const getSumEnergy = () =>
  $get('/background-config-api/usageContrast/getSumEnergy');
export const usageDataList = (data: any) =>
  $post('/background-config-api/usageContrast/usageDataTable', data);
export const getGroup = () =>
  $get('/background-config-api/usageDetail/getGroup');
export const getAttribute = () =>
  $get('/background-config-api/dict/getAttrList');
export const monitoringList = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/video/getCameraNameList',
    data,
  );
export const monitoringType = () =>
  $get('/background-config-api/ApiConfig/getTypeDict');
export const monitoringApi = (data: any) =>
  $get('/background-config-api/ApiConfig/page', data);
export const apiDetail = (data: any) =>
  $get('/background-config-api/ApiConfig/getById', data);
export const monitoringPreviewUrl = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/video/getCameraPreviewURL',
    data,
  );
export const parkRecord = (data: any) =>
  $get('/background-config-api/tripartite/reformer/park/getParkRecord', data);
export const doorList = (data: any) =>
  $get('/background-config-api/tripartite/reformer/door/getDoorInfo', data);
export const doorRecordList = (data: any) =>
  $get(
    '/background-config-api/tripartite/reformer/door/getOpenDoorRecord',
    data,
  );
export const alarmDeviceList = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/iasDevice/getIasHostsList',
    data,
  );
export const alarmSystemList = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/iasDevice/getIasDeviceSubSysList',
    data,
  );
export const alarmRecordList = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/iasDevice/getEventLogs',
    data,
  );
export const alarmDefenceList = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/iasDevice/getIasDeviceDefenceList',
    data,
  );
export const alarmDefense = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/iasDevice/setArmOrDisarm',
    data,
  );
export const cameraControl = (data: any) =>
  $post(
    '/background-config-api/tripartite/hik/v2/video/cameraControlling',
    data,
  );
export const broadcastList = (data: any) =>
  $post(
    '/background-config-api/tripartite/ipcast/v1/broadcast/getEndPoints',
    data,
  );

export const remoteControl = (data: any) =>
  $post('/background-config-api/tripartite/reformer/door/remoteControl', data);

export const interfaceMenuList = (data: any) =>
  $get('/background-config-api/apiMenu/tree', data);
export const interfaceList = (data: any) =>
  $get('/background-config-api/apiInfo/page', data);
export const deviceCardGroup = ()=>$get("/background-config-api/equipment/statistics/getAllEquipmentNum")
export const deviceOnlineStatistics =()=>$get("background-config-api/equipment/statistics/getAllDevicesOnOrOffNum")
export const alarmRecordsStatistics =()=>$get("/background-config-api/equipment/statistics/getAlarmVolumeTrend")
export const deviceGroupRecords =()=>$get('/background-config-api/equipment/statistics/getAllDeviceNum')
export const deviceAlarmRecords =()=>$get('/background-config-api/equipment/statistics/getAlarmTypeStatistics')

export const gangControlList = (data:any)=>$get('/linkage-control/engJobInfo/queryByPage',data)
export const engineType = ()=>$get('/module-manage/module/manage/getListDcmType?typeCode=500')
export const triggerRules = ()=>$get('/module-manage/module/manage/getListDcmType?typeCode=600')
export const startRuleTask = (data:any)=>$get('/linkage-control/engJobInfo/startJob',data)
export const stopRuleTask = (data:any)=>$get('/linkage-control/engJobInfo/stopJob',data)
export const deleteRuleTask = (data:any)=>$get('/linkage-control/engJobInfo/deleteById',data)
export const createRuleTask = (data:any)=>$post('/linkage-control/engJobInfo/add',data)
export const ruleTaskDetails = (data:any)=>$get('/linkage-control/engJobInfo/queryById',data)
export const updateRuleTask = (data:any)=>$post('/linkage-control/engJobInfo/edit',data)
export const deviceParamsList = () => $get('/visual-config/device/param/getDeviceParamList',{});
export const getAllEngineRule = (data:any)=>$get('/linkage-control/rule/engine/getAllEngRule',data)
export const updateRuleTaskLogic = (data:any)=>$post('/linkage-control/rule/engine/insertOrUpdate',data)
export const deleteEngineTaskRuleById = (data:any)=>$get('/linkage-control/rule/engine/deleteEngTaskRuleRelById',data)
export const deleteEngineRuleCondById = (data:any)=>$get('/linkage-control/rule/engine/deleteEngRuleCondById',data)
export const deleteEngRuleExecuteById = (data:any)=>$get('/linkage-control/rule/engine/deleteEngRuleExecuteById',data)

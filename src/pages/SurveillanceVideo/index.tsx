import React, { ReactNode, useEffect, useState } from 'react';
import './style.less';
import { Input } from 'antd';
import ytImg from './images/2x云台.png';
import VideoPlay from './VideoPlayer';
import {
  apiDetail,
  cameraControl,
  monitoringList,
  monitoringPreviewUrl,
} from '@/http/api/editor';


const { Search } = Input;

interface ElementProps {
  id: string;
  children?: ReactNode[];
  type: string;
  label: string;
  onMove?: Function | null | undefined;
  className?: string;
}
// @ts-ignore
let surveillance = [];
const SurveillanceVideo: React.FC<ElementProps> = (props) => {


  //@ts-ignore
  const [apiParams, setApiParams] = useState({
    "id": 20,
    "name": "海康",
    "type": 100,
    "ipAddr": "127.0.0.1",
    "port": "443",
    "authCode": "admin",
    "status": 0,
    "password": "admin123",
    "isHttps": "1"
  });
  const [surveillanceList, setSurveillanceList] = useState([]);
  const [winScreenSize, setWinScreenSize] = useState(1);
  const [currentTarget, setCurrentTarget] = useState({
    indexCode: '',
    name: '',
  });
  const [winSize1, setWinSize1] = useState(new Array(1).fill(null));
  const [winSize4, setWinSize4] = useState(new Array(4).fill(null));
  const [winSize9, setWinSize9] = useState(new Array(9).fill(null));
  const getMonitoringList = () => {
    monitoringList({
      pageNo: 1,
      pageSize: 100,
      //@ts-ignore
      ...apiParams,
    }).then((res) => {
      setSurveillanceList(res.data);
      surveillance = res.data;
    });
  };
  const setPreviewUrlList = (indexCode: React.Key) => {
    if (winScreenSize === 1) {
      if (winSize1?.[0]?.indexCode === indexCode) {
        return;
      } else {
        setWinSize1([null]);
        monitoringPreviewUrl({
          cameraIndexCode: indexCode,
          //@ts-ignore
          ...apiParams,
        }).then((res) => {
          setWinSize1([
            {
              indexCode,
              url: res.data.url,
            },
          ]);
        });
      }
    }
    if (winScreenSize === 4) {
      const targetIndex = winSize4.findIndex(
        (item) => item?.indexCode === indexCode,
      );
      const nullSize = winSize4.filter((item) => !item).length;
      // console.log({targetIndex,nullSize,winSize4})
      // return
      if (targetIndex === -1) {
        if (nullSize === 0) {
          return;
        } else {
          const winSize = [...winSize4];
          winSize[4 - nullSize] = [];
          monitoringPreviewUrl({
            cameraIndexCode: indexCode,
            //@ts-ignore
            ...apiParams,
          }).then((res) => {
            winSize[4 - nullSize] = {
              //@ts-ignore
              indexCode,
              url: res.data.url,
            };
            console.log(winSize);
            setWinSize4(winSize);
          });
        }
      } else {
        const winSize = [...winSize4];
        winSize.splice(targetIndex, 1);
        winSize.push(null);
        setWinSize4(winSize);
      }
    }
    if (winScreenSize === 9) {
      const targetIndex = winSize9.findIndex(
        (item) => item?.indexCode === indexCode,
      );
      const nullSize = winSize9.filter((item) => !item).length;
      // console.log({targetIndex,nullSize,winSize4})
      // return
      if (targetIndex === -1) {
        if (nullSize === 0) {
          return;
        } else {
          const winSize = [...winSize9];
          winSize[9 - nullSize] = [];
          monitoringPreviewUrl({
            cameraIndexCode: indexCode,
            //@ts-ignore
            ...apiParams,
          }).then((res) => {
            winSize[9 - nullSize] = {
              //@ts-ignore
              indexCode,
              url: res.data.url,
            };
            setWinSize9(winSize);
          });
        }
      } else {
        const winSize = [...winSize9];
        winSize.splice(targetIndex, 1);
        winSize.push(null);
        setWinSize9(winSize);
      }
    }
  };
  const isCheckedActive = (indexCode: React.Key) => {
    if (
      (winScreenSize === 1 && winSize1?.[0]?.indexCode === indexCode) ||
      (winScreenSize === 4 &&
        winSize4.filter((item) => item?.indexCode === indexCode)?.length) ||
      (winScreenSize === 9 &&
        winSize9.filter((item) => item?.indexCode === indexCode)?.length)
    ) {
      return 'active';
    }
    return '';
  };
  const cameraHandle = (command: string) => {
    // console.log(winSize1)
    const [item] = winSize1;
    if (item) {
      cameraControl({
        // @ts-ignore
        ...apiParams,
        cameraIndexCode: item.indexCode,
        command,
      }).then((res) => {});
    }
  };
  const setSurveillanceSearch = (key: string) => {
    if (!key) {
      // @ts-ignore
      setSurveillanceList(surveillance);
      return;
    }

    setSurveillanceList(
      // @ts-ignore
      surveillance?.filter(({ name }: any) => name.includes(key)),
    );
  };
  useEffect(() => {
    getMonitoringList();
  }, [apiParams]);
  // useEffect(() => {
  //   if (option) {
  //     apiDetail({ id: option }).then((res) => {
  //       setApiParams(res.data);
  //     });
  //   }
  // }, [type, option]);
  return (
    <div className='surveillance-video'>
      <div className="surveillance-video-container">
        <div className="left">
          <div className="left-block top">
            <div className="block-title">监控列表</div>
            <Search
              placeholder="请输入"
              enterButton
              allowClear
              onSearch={setSurveillanceSearch}
              style={{ marginBottom: 12 }}
            />
            <div className="scroll-inner">
              {surveillanceList.map(
                ({ name, indexCode }: { name: string; indexCode: string }) => {
                  return (
                    <div
                      className={`list-item ${isCheckedActive(indexCode)}`}
                      onClick={setPreviewUrlList.bind(this, indexCode)}
                    >
                      <i className="iconfont icon-shipin" />
                      {name}
                    </div>
                  );
                },
              )}
            </div>
          </div>
          {winScreenSize === 1 && (
            <div className="left-block bottom">
              <div className="block-title">云台</div>
              <div className="block-content">
                <div className="image-wrapper">
                  <div
                    className="handle-btn top-btn"
                    onClick={cameraHandle.bind(this, 'UP')}
                  />
                  <div
                    className="handle-btn top-left-btn"
                    onClick={cameraHandle.bind(this, 'LEFT_UP')}
                  />
                  <div
                    className="handle-btn top-right-btn"
                    onClick={cameraHandle.bind(this, 'RIGHT_UP')}
                  />
                  <div
                    className="handle-btn left-btn"
                    onClick={cameraHandle.bind(this, 'LEFT')}
                  />
                  <div
                    className="handle-btn right-btn"
                    onClick={cameraHandle.bind(this, 'RIGHT')}
                  />
                  <div
                    className="handle-btn bottom-left-btn"
                    onClick={cameraHandle.bind(this, 'LEFT_DOWN')}
                  />
                  <div
                    className="handle-btn bottom-btn"
                    onClick={cameraHandle.bind(this, 'DOWN')}
                  />
                  <div
                    className="handle-btn bottom-right-btn"
                    onClick={cameraHandle.bind(this, 'RIGHT_DOWN')}
                  />
                  <img src={ytImg} alt="" className="image" />
                </div>
                <div className="btn-group">
                  <div
                    className="btn"
                    onClick={cameraHandle.bind(this, 'FOCUS_NEAR')}
                  >
                    聚焦变大
                  </div>
                  <div
                    className="btn"
                    onClick={cameraHandle.bind(this, 'FOCUS_FAR')}
                  >
                    聚焦变小
                  </div>
                </div>
                <div className="btn-group">
                  <div
                    className="btn"
                    onClick={cameraHandle.bind(this, 'IRIS_ENLARGE')}
                  >
                    光圈扩大
                  </div>
                  <div
                    className="btn"
                    onClick={cameraHandle.bind(this, 'IRIS_REDUCE')}
                  >
                    光圈缩小
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="right">
          <div className="block-title">
            <div></div>
            <div className="toggle-btn-group">
              <div
                className={`toggle-btn ${winScreenSize === 1 ? 'active' : ''}`}
                onClick={setWinScreenSize.bind(this, 1)}
              >
                <i className="iconfont icon-24gl-square" />
              </div>
              <div
                className={`toggle-btn ${winScreenSize === 4 ? 'active' : ''}`}
                onClick={setWinScreenSize.bind(this, 4)}
              >
                <i className="iconfont icon-gongzuotaizhengchang" />
              </div>
              <div
                className={`toggle-btn ${winScreenSize === 9 ? 'active' : ''}`}
                onClick={setWinScreenSize.bind(this, 9)}
              >
                <i className="iconfont icon-jiugongge" />
              </div>
            </div>
          </div>
          <div className="video-container">
            {/*{previewUrl && <VideoPlay src={previewUrl} />}*/}
            {winScreenSize === 1 &&
            winSize1.map((item, index) => (
              <div className="screen-item size1">
                <div className="screen-item-container">
                  {item && <VideoPlay src={item.url} />}
                  {!item && (
                    <div className="empty">
                      <i className="iconfont icon-video-camera-off" />
                      <div className="text">视频未连接</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {winScreenSize === 4 &&
            winSize4.map((item, index) => (
              <div className="screen-item size4">
                <div className="screen-item-container">
                  {item && <VideoPlay src={item.url} />}
                  {!item && (
                    <div className="empty">
                      <i className="iconfont icon-video-camera-off" />
                      <div className="text">视频未连接</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {winScreenSize === 9 &&
            winSize9.map((item, index) => (
              <div className="screen-item size9">
                <div className="screen-item-container">
                  {item && <VideoPlay src={item.url} />}
                  {!item && (
                    <div className="empty">
                      <i className="iconfont icon-video-camera-off" />
                      <div className="text">视频未连接</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SurveillanceVideo;

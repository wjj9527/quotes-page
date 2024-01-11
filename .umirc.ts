import { defineConfig } from 'umi';
import theme from './theme';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  theme,
  routes: [
    {
      path: '/',
      component: '@/pages',
      routes: [
        {
          path:'deviceCardList',
          component:'@/pages/DeviceCardList'
        },
        {
          path:"ElectricityConsumptionData",
          component: "@/pages/ElectricityConsumptionData"
        },
        {
          path:"AccessControlList",
          component:"@/pages/AccessControlList"
        },
        {
          path:"AccessRecordsList",
          component: "@/pages/AccessRecordsList"
        },
        {
          path:"DeviceStatistics",
          component: "@/pages/DeviceStatistics"
        },
        {
          path:"GangControl",
          component: "@/pages/GangControl"
        }
      ],
    },
  ],
  fastRefresh: {},
  publicPath:'./',
});

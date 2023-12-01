import type { RouteRecordRaw } from 'vue-router'

/**预设集 */
const routes: RouteRecordRaw[] = [
  {
    path: '/presets',
    redirect: '/presets/transcode'
  },
  {
    path: '/presets/:type',
    name: 'Presets',
    meta: {
      title: '预设集',
      hasSideBar: true,
      keepAlive: true,
      currentActive: 'Presets'
    },
    component: () => import('@/views/presets/IndexView.vue')
  },
  {
    path: 'presets/transcode/add/:regionId',
    name: 'PresetsTranscodeAdd',
    meta: { title: '新建预设-转码', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddTranscodeView.vue')
  },
  {
    path: 'presets/transcode/edit/:regionId/:id',
    name: 'PresetsTranscodeEdit',
    meta: { title: '编辑预设-转码', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddTranscodeView.vue')
  },
  {
    path: 'presets/watermark/add/:regionId',
    name: 'PresetsWatermarkAdd',
    meta: { title: '新建预设-水印', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddWatermarkView.vue')
  },
  {
    path: 'presets/watermark/edit/:regionId/:id',
    name: 'PresetsWatermarkEdit',
    meta: { title: '编辑预设-水印', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddWatermarkView.vue')
  },
  {
    path: 'presets/screenshot/add/:regionId',
    name: 'PresetsScreenshotAdd',
    meta: { title: '新建预设-截图', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddScreenshotView.vue')
  },
  {
    path: 'presets/screenshot/edit/:regionId/:id',
    name: 'PresetsScreenshotEdit',
    meta: { title: '编辑预设-截图', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddScreenshotView.vue')
  },
  {
    path: 'presets/video-splice/add/:regionId',
    name: 'PresetsVideoSpliceAdd',
    meta: { title: '新建预设-拼接', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddVideoSpliceView.vue')
  },
  {
    path: 'presets/video-splice/edit/:regionId/:id',
    name: 'PresetsVideoSpliceEdit',
    meta: { title: '编辑预设-拼接', currentActive: 'Presets' },
    component: () => import('@/views/presets/AddVideoSpliceView.vue')
  }
]

export default routes

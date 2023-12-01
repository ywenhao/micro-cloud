import { applyStatApi, licenseStatApi } from '@vca/apis/src/ssl'
import type { Ref } from 'vue'

import type { DataView } from '../types/applyList'

const applyDataOverview = reactive<DataView[]>([
  {
    label: '申请总数',
    des: '发起证书申请总数量',
    num: 0,
    key: 'total'
  },
  {
    label: '已签发',
    des: '所有已签发的证书申请数量',
    num: 0,
    key: 'issued'
  },
  {
    label: '待DNS验证',
    des: '当前待DNS验证状态的证书申请数量，包括自动和手动验证',
    num: 0,
    key: 'dns_verify'
  },
  {
    label: '申请中',
    des: '当前申请中状态的证书申请数量',
    num: 0,
    key: 'applying'
  },

  {
    label: '申请失败',
    des: '所有申请失败的证书申请数量',
    num: 0,
    key: 'apply_failed'
  },
  {
    label: '已取消',
    des: '所有已取消的证书申请数量',
    num: 0,
    key: 'canceled'
  },
  {
    label: '续期',
    des: '所有来自于续期操作的证书申请数量',
    num: 0,
    key: 'renew'
  }
])

const issuedDataOverview = reactive<DataView[]>([
  {
    label: '签发总数',
    des: '已签发证书总数量，续期将覆盖原证书，总证书数量不增加',
    num: 0,
    key: 'total'
  },
  {
    label: '正常',
    des: '当前已签发证书中，正常状态的数量',
    num: 0,
    key: 'normal'
  },
  {
    label: '即将过期',
    des: '当前已签发证书中，即将过期状态的数量',
    num: 0,
    key: 'expiring'
  },
  {
    label: '已到期',
    des: '当前已签发证书中，已到期状态的数量',
    num: 0,
    key: 'expired'
  },
  {
    label: '已吊销',
    des: '当前已签发证书中，已吊销状态的数量',
    num: 0,
    key: 'revoked'
  }
])

const ownDataOverview = reactive<DataView[]>([
  {
    label: '自有证书总数',
    des: '上传的自有证书总数量',
    num: 0,
    key: 'total'
  },
  {
    label: '正常',
    des: '当前自有证书中，正常状态的数量',
    num: 0,
    key: 'normal'
  },
  {
    label: '即将过期',
    des: '当前自有证书中，即将过期状态的数量',
    num: 0,
    key: 'expiring'
  },
  {
    label: '已到期',
    des: '当前自有证书中，已过期状态的数量',
    num: 0,
    key: 'expired'
  }
])
const userDateOverview = ref<DataView[]>([])

export default function useStatistic({
  apply = false,
  is_own = ref(2)
}: {
  apply?: boolean
  is_own?: Ref<number>
}) {
  // 获取申请列表统计
  const getApplyStat = () => {
    applyStatApi().then(res => {
      for (const key in res) {
        applyDataOverview.find(item => {
          if (item.key === key) {
            //@ts-ignore
            item.num = res[key]
          }
        })
      }
    })
  }
  // 获取用户证书列表统计
  const getUserLicenseStat = (is_own: number) => {
    licenseStatApi({ is_own }).then(res => {
      const data = is_own === 2 ? issuedDataOverview : ownDataOverview
      for (const key in res) {
        data.find(item => {
          if (item.key === key) {
            //@ts-ignore
            item.num = res[key]
          }
        })
      }
      userDateOverview.value = data
    })
  }
  // 获取统计数据
  const getStatistic = () => {
    if (apply) {
      getApplyStat()
    } else {
      getUserLicenseStat(is_own.value)
    }
  }
  onMounted(() => {
    getStatistic()
  })
  return {
    applyDataOverview,
    userDateOverview,
    getStatistic
  }
}

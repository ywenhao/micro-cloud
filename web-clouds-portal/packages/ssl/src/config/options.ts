// 品牌
export const brandOptions = [
  {
    label: '全部品牌',
    value: ''
  },
  {
    label: 'ZeroSSL',
    value: 1
  },
  {
    label: "Let's Encrypt",
    value: 2
  }
]
// 验证方式
export const verifyOptions = [
  {
    label: '全部验证方式',
    value: ''
  },
  {
    label: 'NS自动验证',
    value: 1
  },
  {
    label: '手动DNS验证',
    value: 2
  }
]
// 加密算法
export const algorithmOptions = [
  {
    label: 'RSA2048',
    value: 1
  },
  {
    label: 'RSA4096',
    value: 2
  },
  {
    label: 'ECC256',
    value: 3
  },
  {
    label: 'ECC384',
    value: 4
  }
]
// 申请列表状态
export const statusApplyOptions = [
  {
    label: '全部状态',
    value: ''
  },
  {
    label: '已签发',
    value: 1
  },
  {
    label: '待DNS验证',
    value: 2
  },
  {
    label: '申请中',
    value: 3
  },
  {
    label: '申请失败',
    value: 4
  },
  {
    label: '已取消',
    value: 5
  }
]

// 我的证书列表状态
export const statusOwnedOptions = [
  {
    label: '全部状态',
    value: 0
  },
  {
    label: '正常',
    value: 1
  },
  {
    label: '已提交续期',
    value: 2
  },
  {
    label: '吊销中',
    value: 3
  },
  {
    label: '已吊销',
    value: 4
  },
  {
    label: '即将到期',
    value: 5
  },
  {
    label: '已到期',
    value: 6
  }
]

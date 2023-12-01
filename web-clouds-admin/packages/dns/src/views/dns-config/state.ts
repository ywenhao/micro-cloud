export const ipTipsData = [
  {
    title: 'IP地址与通信IP地址不匹配',
    list: [
      {
        label: ' 解决方案1',
        value:
          '修改此处IP地址，使此处IP与通信IP一致，该方案需要到域名注册商处修改DNS服务器地址的对应地址为通信IP地址。'
      },
      { label: '解决方案2', value: '到该IP地址的节点上安装对应的DNS服务。' },
      {
        label: '解决方案3',
        value:
          '到该IP地址的节点上检查是否是安装成功，但未成功获取P，排查原因以获取IP。'
      }
    ]
  }
]

export const ipDnsTipsData = [
  {
    title: 'IP地址与DNS服务器地址不匹配',
    list: [
      {
        label: ' 解决方案',
        value: '到域名注册商处修改DNS服务器地址的对应地址为通信IP地址。'
      }
    ]
  }
]

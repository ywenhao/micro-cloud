export interface IDownLoadList {
  key?: string
  url?: string
}

type ICommand = 'key' | 'url'

export function useExportCsv(data: IDownLoadList[]) {
  const header: Record<ICommand, string> = {
    key: '文件名',
    url: '外链地址'
  }
  let csv = ''
  for (const key in header) {
    csv += header[key as ICommand] + ','
  }
  csv = csv.substr(0, csv.length - 1) + '\r\n'
  for (const i in data) {
    for (const key in header) {
      csv += data[i][key as ICommand] + ','
    }
    csv = csv.substr(0, csv.length - 1) + '\r\n'
  }

  //定义文件内容，类型必须为Blob 否则createObjectURL会报错
  const content = new Blob(['\uFEFF' + csv])
  //生成url对象
  const urlObject = window.URL || window.webkitURL || window
  const url = urlObject.createObjectURL(content)
  //生成<a></a>DOM元素
  const el = document.createElement('a')
  //链接赋值
  el.href = url
  el.download = 'export_urls.csv'
  //必须点击否则不会下载
  el.click()
  //移除链接释放资源
  urlObject.revokeObjectURL(url)
}

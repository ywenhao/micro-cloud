import {
  Form,
  FormItem,
  Message,
  Radio,
  RadioGroup,
  Select
} from '@arco-design/web-vue'
import { addSitesCertificatesOriginsByIdApi } from '@vca/apis/cdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { VcModal } from 'vc-material'
// 添加源证书
export default function useOriginCertificate(
  site_id: string,
  callback: () => void
) {
  dayjs.extend(relativeTime)
  const expireOptions = [
    {
      label: '7天',
      value: 7
    },
    {
      label: '30天',
      value: 30
    },
    {
      label: '90天',
      value: 90
    },
    {
      label: '1年',
      value: 1
    },
    {
      label: '2年',
      value: 2
    },
    {
      label: '3年',
      value: 3
    },
    {
      label: '15年',
      value: 15
    }
  ]
  const formState = reactive({
    algorithm: 1,
    domain_list: [''],
    expires_day: ''
  })
  const handleExpireTime = (time: number) => {
    const symbol = [7, 30, 90].includes(time) ? 'day' : 'year'
    const date1 = dayjs().add(time, symbol)

    formState.expires_day = date1.diff(dayjs(), 'day').toString()
  }

  const showModal = () => {
    VcModal.confirm(
      {
        title: '添加源证书',
        content: () => (
          <Form model={formState} layout="vertical">
            <FormItem label="密钥类型">
              <RadioGroup modelValue={formState.algorithm}>
                <Radio value={1}>RSA(2048)</Radio>
                <Radio value={2}>ECDSA</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="域名">
              <Select multiple allowCreate placeholder="请输入域名"></Select>
            </FormItem>
            <FormItem label="证书有效期">
              <Select
                modelValue={formState.expires_day}
                placeholder="请选择"
                options={expireOptions}
                onChange={v => handleExpireTime(v as number)}
              ></Select>
            </FormItem>
          </Form>
        )
      },
      () => {
        const data = { ...formState, site_id }
        return addSitesCertificatesOriginsByIdApi(data).then(() => {
          Message.success('添加成功')
          callback()
        })
      }
    )
  }
  return { showModal }
}

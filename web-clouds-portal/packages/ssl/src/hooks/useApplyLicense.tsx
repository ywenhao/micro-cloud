import { Message } from '@arco-design/web-vue'
import { Scrollbar } from '@arco-design/web-vue'
import {
  applyApi,
  applyBatchApi,
  applyDomainValidApi,
  batchRenewApi,
  changeApplyApi,
  dnsAutoVerifyApi,
  dnsVerifyApi,
  dnsVerifyPassApi,
  editLicenseApi,
  getSystemConfigApi,
  renewApi,
  ResultEnum
} from '@vcp/apis/src/ssl'
import { VcModal } from 'vc-material'

import { algorithmOptions, brandOptions } from '@/config'
import { userDataKey } from '@/config/provideKeys'
import type { ApplyCommand, LicenseInfo } from '@/types/applyList'
import { domainValid } from '@/utils/domainValid'

interface OptionsItem {
  label: string
  value: string | number
}
export type FormState = {
  domain: string
  is_verify: string
  algorithm: string
  user_id: string
  desc: string
}

export default function useApplyLicense(
  closeDraw: () => void,
  getList: () => void
) {
  const actionState = reactive<{ command: ApplyCommand; isBatch: boolean }>({
    command: 'apply',
    isBatch: false
  })
  const userDate = inject(userDataKey)
  const loading = ref<boolean>(false)
  const currentStep = ref<number>(1)
  const algorithmList = ref<OptionsItem[]>([])
  const brandList = ref<OptionsItem[]>([])
  const isEdit = ref<boolean>()
  const verifyDisabled = ref<boolean>(false)

  //证书信息
  const verifyBtnState = reactive({
    loading: false,
    disabled: false,
    btnText: '验证'
  })
  // 表单信息
  const formState = ref<LicenseInfo>({
    domain: '',
    is_verify: 2,
    algorithm: 1,
    user_id: '',
    desc: ''
  })

  //  域名状态Banner
  const domainState = reactive({
    status: 'error',
    showBanner: false,
    content: ''
  })

  //  dns记录状态Banner
  const dnsState = reactive({
    status: 'error',
    showBanner: false,
    content: ''
  })

  // dns域名验证通过
  const domainVerifyPass = () => {
    domainState.status = 'success'
    domainState.content = 'DNS服务器验证成功'
    domainState.showBanner = true
    verifyDisabled.value = false
  }
  // dns域名验证失败

  const domainVerifyFail = () => {
    domainState.status = 'error'
    domainState.content = 'DNS服务器未验证，请确认域名是否已修改DNS服务器地址:'
    domainState.showBanner = true
    verifyDisabled.value = true
  }

  // dns记录验证通过
  const dnsLogVerifyPass = () => {
    dnsState.status = 'success'
    dnsState.content = '验证DNS记录成功'
    dnsState.showBanner = true
    verifyBtnState.disabled = true
    verifyBtnState.btnText = '已验证'
  }
  // dns记录验证失败
  const dnsLogVerifyFail = () => {
    dnsState.status = 'error'
    dnsState.content = '未检测到DNS记录：'
    dnsState.showBanner = true
    verifyBtnState.disabled = false
    verifyBtnState.btnText = '验证'
  }

  // 定时器
  const timer = ref<number>()

  // 获取系统配置
  const getConfig = () => {
    algorithmList.value = []
    brandList.value = []
    getSystemConfigApi().then(res => {
      const algorithmTem: string[] = res.algorithm?.split(',') ?? []
      const brandTem: string[] = res.brand?.split(',') ?? []
      brandTem.map(ele => {
        brandOptions.map(item => {
          if (Number(ele) === item.value) {
            brandList.value.push(item)
          }
        })
      })
      // formState.value.is_verify = 1
      algorithmTem.map(ele => {
        algorithmOptions.map(item => {
          if (item.value === Number(ele)) {
            algorithmList.value.push(item)
          }
        })
      })
      if (
        algorithmList.value.findIndex(
          item => item.value === formState.value.algorithm
        ) < 0
      ) {
        formState.value.algorithm = Number(algorithmList.value[0].value)
      }
    })
  }

  //清除定时器
  const clearTimer = () => {
    clearTimeout(timer.value)
  }

  // 单个申请NS自动验证时：域名是否已被添加到dns中
  const domainDnsAutoVerify = () => {
    const flag = domainValid(formState.value.domain)

    if (
      flag ||
      actionState.isBatch ||
      (actionState.command === 'verify' && formState.value.is_verify === 2)
    ) {
      domainState.showBanner = false
      clearTimer()
      return
    }

    if (formState.value.is_challenged === 1) {
      clearTimer()
      return
    }

    const data = {
      user_id: userDate?.adminInfo?.id ?? '',
      domain: formState.value.domain ?? ''
    }

    dnsAutoVerifyApi(data)
      .then(res => {
        if (res.code === ResultEnum.SUCCESS) {
          domainVerifyPass()
          if (!isEdit.value) {
            formState.value.is_verify = 1
          }
        } else if (res.code === ResultEnum.ErrDomainUnList) {
          domainVerifyFail()
          handleTimer()
          if (!isEdit.value) {
            formState.value.is_verify = 2
          }
        } else if (res.code === ResultEnum.ErrNsStatus) {
          domainVerifyFail()
          handleTimer()
        } else {
          Message.error(res.message ?? '')
        }
      })
      .catch(() => {
        domainVerifyFail()
        handleTimer()
      })
  }

  // 轮询dns服务检测
  function handleTimer() {
    if (timer.value) clearTimer()
    timer.value = setTimeout(() => {
      domainDnsAutoVerify()
    }, 10000)
  }

  // 验证方式切换
  const handleSelectChange = (value: number) => {
    if (value === 1 && formState.value.domain && !actionState.isBatch) {
      domainDnsAutoVerify() //切换自动验证后，域名不为空时开启定时验证
    } else {
      // 手动验证时清除定时，并隐藏banner
      clearTimer()
      domainState.showBanner = false
    }
  }
  //dns手动验证
  const handleDnsVerify = () => {
    verifyBtnState.loading = true
    dnsVerifyApi({ id: formState.value?.id ?? '' })
      .then(res => {
        if (res.code === ResultEnum.SUCCESS) {
          dnsLogVerifyPass()

          getList()
        } else {
          dnsLogVerifyFail()
        }
      })
      .finally(() => {
        verifyBtnState.loading = false
      })
      .catch(err => {
        Message.error(err as string)
        verifyBtnState.loading = false
        dnsLogVerifyFail()
      })
  }
  // dns手动验证通过
  const handleDnsPass = () => {
    dnsVerifyPassApi({ id: formState.value.id ?? '' }).then(() => {
      closeDraw()
    })
  }
  /**
   * start
   * 申请证书
   */

  // 申请单个证书
  const singleApply = () => {
    const data: Record<string, any> = {
      desc: formState.value.desc,
      user_id: userDate?.adminInfo?.id ?? '',
      algorithm: formState.value.algorithm,
      is_verify: formState.value.is_verify,
      domain: formState.value.domain
    }
    loading.value = true
    applyApi(data)
      .then(res => {
        if (formState.value.is_verify === 1) {
          closeDraw()
        } else {
          formState.value = res
          currentStep.value = 2
          actionState.command = 'verify'
          getList()
          clearTimer()
        }
      })
      .finally(() => {
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }

  /**
   * 批量申请
   * */
  const batchApply = async () => {
    let flag = true
    const list = formState.value.domain!.split('\n').filter(Boolean)
    const data: Record<string, any> = {
      // TODO:管理端需要user_id: userDate?.adminInfo?.id ?? '',
      algorithm: formState.value.algorithm,
      domain_list: list.length > 500 ? list.slice(0, 500) : list
    }
    try {
      loading.value = true
      const { failed_count } = await applyBatchApi(data)
      if (Number(failed_count) < 1) {
        closeDraw()
      }
      loading.value = false
    } catch (err: any) {
      loading.value = false

      flag = false
      Message.error(err?.message || '请求出错，请稍后重试')
      return flag
    }

    return flag
  }
  // 异常域名弹窗
  const errorDomainModal = async (list: string[]) => {
    VcModal.confirm({
      title: '异常域名提示',
      okText: '继续',
      onBeforeOk: async done => {
        // 存在未通过验证的域名时仍然可以继续申请，只会对格式正确的域名进行申请
        const res = await batchApply()
        if (res) {
          done(true)
          closeDraw()
          return
        }
        done(false)
      },
      content: () => (
        <div class=" max-h-[328px] ">
          <div>
            以下{list.length}条域名异常
            <br />
            原因：格式不正确、处于申请中状态、或重复域名。异常域名将不会提交申请证书，请返回修改或继续。
          </div>
          <div class="error-domain-container">
            <Scrollbar style="display:block;max-height:252px;overflow:auto;">
              {list.map(item => (
                <div key={item} class="error-domain">
                  {item}
                </div>
              ))}
            </Scrollbar>
          </div>
        </div>
      )
    })
  }
  // 域名验证
  const handleBatchVerify = async (list: string[]) => {
    try {
      let errorList = []
      errorList =
        (await applyDomainValidApi({ domain_list: list })).domain_list || []

      if (errorList.length > 0) {
        errorDomainModal(errorList)
      } else {
        batchApply()
      }
    } catch (err: any) {
      Message.error(err?.message || '请求出错，请稍后重试')
    }
  }
  // 提交申请
  const submitApply = async () => {
    const map: Record<ApplyCommand, () => void> = {
      apply: () => {
        if (actionState.isBatch) {
          const list = formState.value.domain!.split('\n').filter(Boolean) ?? []
          handleBatchVerify(list)
          return
        }
        if (isEdit.value) {
          //修改申请
          editApply()
          return
        }
        singleApply()
      },
      verify: () => {
        if (isEdit.value || formState.value.is_verify === 1) {
          editApply()
          return
        }
        handleDnsPass()
      },
      renew: () => {
        if (!actionState.isBatch) {
          handleRenew()
          return
        }
        handleBatchRenew()
      }
    }
    map[actionState.command]()
  }
  //修改申请
  const backApply = () => {
    currentStep.value = 1
    isEdit.value = true
  }
  //证书续期
  function handleRenew() {
    loading.value = true
    const data = {
      id: formState.value.id ?? '',
      desc: formState.value.desc ?? '',
      algorithm: formState.value.algorithm
    }
    renewApi(data)
      .then(() => {
        Message.success('续期成功')
        closeDraw()
      })
      .finally(() => {
        loading.value = false
      })
  }
  //证书批量续期
  function handleBatchRenew() {
    loading.value = true

    const data = {
      algorithm: formState.value.algorithm,
      id_list: formState.value.id_list ?? []
    }
    batchRenewApi(data)
      .then(() => {
        Message.success('批量续期成功')
        closeDraw()
      })
      .finally(() => {
        loading.value = false
      })
  }

  function editApply() {
    loading.value = true
    const applyData = {
      id: formState.value.id ?? '',
      desc: formState.value.desc ?? '',
      domain: formState.value.domain,
      algorithm: formState.value.algorithm,
      is_check: 1
    }
    const licenseData = {
      id: formState.value.id ?? '',
      desc: formState.value.desc ?? '',
      is_renewal: 1
    }
    const data = actionState.command === 'renew' ? licenseData : applyData
    const fn = actionState.command === 'renew' ? editLicenseApi : changeApplyApi
    fn(data)
      .then(res => {
        if (formState.value.is_verify === 1) {
          closeDraw()
          return
        }
        formState.value = res

        currentStep.value = 2
        isEdit.value = false
        if (formState.value.is_challenged === 2) {
          dnsLogVerifyFail()
        }
        getList()
      })
      .finally(() => {
        loading.value = false
      })
  }

  const reset = () => {
    isEdit.value = false
    domainState.showBanner = false
    dnsState.showBanner = false
    dnsState.status = 'error'
    dnsState.content = '未检测到DNS记录：'
    dnsState.showBanner = true
    currentStep.value = 1
    formState.value = {
      domain: '',
      is_verify: 2,
      algorithm: 1,
      user_id: '',
      desc: ''
    }
  }

  /**
   * end
   * 申请证书
   */

  return {
    algorithmList,
    brandList,
    domainState,
    formState,
    loading,
    currentStep,
    verifyBtnState,
    actionState,
    dnsState,
    verifyDisabled,
    isEdit,
    handleSelectChange,
    clearTimer,
    getConfig,
    domainVerifyPass,
    dnsLogVerifyPass,
    dnsLogVerifyFail,
    domainDnsAutoVerify,
    handleBatchVerify,
    errorDomainModal,
    submitApply,
    handleDnsVerify,
    backApply,
    reset
  }
}

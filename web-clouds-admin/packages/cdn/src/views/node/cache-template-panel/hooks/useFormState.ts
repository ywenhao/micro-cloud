import type { FormInstance } from '@arco-design/web-vue'

export interface FormState {
  memory: {
    memory_usage?: number
    memory_max_file_size?: number
    memory_max_file_size_unit: number
  }
  disk: {
    disk_path: string
    disk_usage?: number
    disk_max_file_size?: number
    disk_max_file_size_unit: number
  }
}
export function useFormState(formState: FormState) {
  const formRef = ref<FormInstance>()

  /** 计算出输入框最大值 */
  const diskMaxFileSizeMax = computed(() => {
    if (formState.disk.disk_max_file_size_unit === 0) return 1024
    if (formState.disk.disk_max_file_size_unit === 1) return 5
    return 5
  })

  // const memoryFileSizeReg = /^[1-9][0-9]{0,1}|100$/
  const checkMemoryUsage = (
    value: number,
    callback: (...args: any[]) => void
  ) => {
    if (Number(value) < 10 || Number(value) > 95) {
      callback('内存分配比例范围为10%-95%，请调整')
    } else {
      callback()
    }
  }
  const checkMemoryFileSize = (
    value: number,
    callback: (...args: any[]) => void
  ) => {
    if (!value) {
      callback('请输入最大可缓存文件体积')
    } else if (value < 1 || value > 50) {
      callback('内存最大可缓存文件范围为1-50MB，请调整')
    } else {
      callback()
    }
  }
  const checkDiskUsage = (
    value: number,
    callback: (...args: any[]) => void
  ) => {
    if (!value) {
      callback('请输入磁盘空间占比')
    } else if (value < 5 || value > 95) {
      callback('磁盘空间占比范围为5%-95%，请调整')
    } else {
      callback()
    }
  }
  const checkDiskFileSize = (
    value: number,
    callback: (...args: any[]) => void
  ) => {
    const maxSize = 5 * 1024 * 1024 * 1024
    if (!value && value != 0) {
      callback('请输入最大可缓存文件体积')
    } else if (formState.disk.disk_max_file_size_unit === 0) {
      if (value * UNITS.values[0] > maxSize || value * UNITS.values[0] < 1024) {
        return callback('内存最大可缓存文件范围为1MB-5GB，请调整')
      }
      return callback()
    } else if (formState.disk.disk_max_file_size_unit === 1) {
      if (value * UNITS.values[1] > maxSize || value * UNITS.values[1] < 1024) {
        return callback('内存最大可缓存文件范围为1MB-5GB，请调整')
      }
      return callback()
    } else {
      callback()
    }
  }

  const rules: Rules = {
    'memory.memory_usage': [{ required: true, validator: checkMemoryUsage }],
    'memory.memory_max_file_size': [
      { required: true, validator: checkMemoryFileSize }
    ],
    'disk.disk_path': [
      { required: true, message: '请输入路径' },
      {
        // 检测第一个字符是否是/
        validator(value: string, callback: (...args: any[]) => void) {
          // 获取第一个字符
          const firstChart = value.charAt(0)

          if (firstChart !== '/') {
            return callback('请输入正确路径')
          }
          callback()
        }
      }
    ],
    'disk.disk_usage': [{ required: true, validator: checkDiskUsage }],
    'disk.disk_max_file_size': [
      { required: true, validator: checkDiskFileSize }
    ]
  }

  return { rules, diskMaxFileSizeMax, formRef, formState }
}

import type { DocModel } from '@vca/apis/pedestal'

/** 递归生成目录树 */
export function restructureRecursively(
  data: any,
  parent: string | number = 1,
  level = 1
) {
  const tree = []
  for (const item of data) {
    if (String(item.parent_id) === String(parent)) {
      const children = restructureRecursively(data, item.id, level + 1)
      if (children.length) {
        item.children = children
      } else {
        item.isLeaf = true
        item.switcherIcon = () => <i></i>
      }
      item.isLeaf = !children?.length
      item.key = item.id
      item.level = level
      tree.push(item)
    }
  }
  return tree
}

export const resetData = (data: DocModel[]) => {
  data.forEach(item => {
    // @ts-ignore
    item.switcherIcon =
      item?.file_type === 2
        ? () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" fill="white" fill-opacity="0.01" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14 1.33325H2V14.6666H14V1.33325ZM4.66671 4.66626H11.3334V5.99959H4.66671V4.66626ZM4.66671 7.33293H9.33337V8.66626H4.66671V7.33293Z"
                fill="#C9CDD4"
              />
            </svg>
          )
        : undefined

    // @ts-ignore
    if (item.file_type === 1 && !item.children?.length) {
      // item.switcherIcon = () => <i></i>
    }
    // @ts-ignore
    item.icon =
      item.file_type === 1
        ? () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="16" fill="white" fill-opacity="0.01" />
              <path
                d="M1.33301 5.33358V2.00024H8.66634L9.46634 3.33358H14.6663V5.33358H1.33301Z"
                fill="#C9CDD4"
              />
              <path
                d="M1.33301 6.66659H14.6663V13.9999H1.33301V6.66659Z"
                fill="#C9CDD4"
              />
            </svg>
          )
        : undefined
    // @ts-ignore
    if (item?.children?.length) {
      // @ts-ignore
      resetData(item.children!)
    }
  })
  return data
}

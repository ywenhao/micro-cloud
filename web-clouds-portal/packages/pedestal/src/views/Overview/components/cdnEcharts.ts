import { convertByte, formatChartsUnix, formatUnix } from 'vc-material'

export const mergeOptions = {
  legend: {
    icon: 'rich',
    itemWidth: 20,
    itemHeight: 4
  },
  color: ['#2253E6', '#00B42A'],
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
        params[0].name,
        'YYYY-MM-DD HH:mm:ss'
      )}</p>`
      params.forEach((element, i) => {
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${
            params[i].color
          }"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span><span>${convertByte(
          params[i].value
        )} </span>
          </span>
        </p>`
      })
      return spans
    }
  },
  // grid: {
  //   top: 16,
  //   left: 0,
  //   right: 20
  // },
  xAxis: {
    axisLabel: {
      formatter: (v: number) => formatChartsUnix(v, 'day')
    }
  },
  yAxis: {
    axisLabel: {
      formatter: (v: number) => convertByte(v)
    }
  }
}

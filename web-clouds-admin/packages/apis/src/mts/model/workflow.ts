import type { CommonReturn } from '../../_utils'

export type WorkflowModel = CommonReturn<'/v1/mts/workflow/info', 'get'>

export type WorkflowConfList = String2NumberByObject<
  WorkflowModel['workflow_conf_list'] & {}
>

export type WorkflowVideoConf =
  WorkflowConfList[number]['workflow_video_conf'] & {}

export type WorkflowSpliceConf =
  WorkflowConfList[number]['workflow_splice_conf'] & {}

export type WorkflowScreenshotConf =
  WorkflowConfList[number]['workflow_screenshot_conf'] & {}

export type WorkflowOutPutConf =
  WorkflowConfList[number]['workflow_out_put_conf'] & {}

export type WorkflowNodeConf =
  | WorkflowVideoConf
  | WorkflowSpliceConf
  | WorkflowScreenshotConf
  | WorkflowOutPutConf

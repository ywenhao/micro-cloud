import type { CommonReturn } from '..'

export type PresetModel = CommonReturn<'/v1/mts/preset/info', 'get'>

export type VideoPresetModel = String2NumberByObject<
  PresetModel['video_preset']
> & {}

export type WatermarkPresetModel = String2NumberByObject<
  PresetModel['watermark_preset']
> & {}

export type ScreenshotPresetModel = String2NumberByObject<
  PresetModel['screenshot_preset']
> & {}
export type SplicePresetModel = String2NumberByObject<
  PresetModel['splice_preset']
> & {}

export type PresetItemModel =
  | VideoPresetModel
  | WatermarkPresetModel
  | ScreenshotPresetModel
  | SplicePresetModel

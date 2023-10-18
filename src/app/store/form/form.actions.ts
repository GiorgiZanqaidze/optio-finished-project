import {createAction, props} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";

export const submitFormData = createAction(
  "[Form] Submit Data",
  props<{data: BannerModel}>
)


export const setFormData = createAction(
  "[Form] Set Data",
  props<{formData: any}>()
)

export const selectFile = createAction(
  "[Form] Select Image File",
  props<{file: File}>()
)

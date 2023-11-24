import {createAction, props} from "@ngrx/store";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const setFormData = createAction(
  "[Form] Set Data",
  props<{formData: any | undefined}>()
)

export const selectFile = createAction(
  "[Form] Select Image File",
  props<{file: File}>()
)

export const setDeleteButton = createAction(
  "[Form] Set Delete Button",
  props<{show: boolean}>()
)

export const setEditFileId = createAction(
  "[Form] Set Edit File Id",
  props<{id: null | string | number}>()
)

export const setBannerId = createAction(
  "[Form] Set Banner Id",
  props<{id: number | string}>()
)

export const submitFormData = createAction(
  "[Form] Submit Data",
  props<{data: any, blob: any}>()
)

export const submitBannerData = createAction(
  "[Form] Set Form Data Response",
  props<{bannerData: any, editFlag: boolean}>()
)

export const submitServerError = createAction(
  "[Form] Set Server Error",
  props<{error: string}>()
)

export const openEditForm = createAction(
  "[Form] Open Edit Form",
)

export const referenceDataApiError = createAction(
  "[Form] Reference Data Api Error",
)

export const setReferenceData = createAction(
  "[Form] Set Banners Data",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)


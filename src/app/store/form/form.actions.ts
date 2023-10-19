import {createAction, props} from "@ngrx/store";
import {Banner} from "../../shared/types/banner";
import {Form} from "@angular/forms";
import {createEffect} from "@ngrx/effects";

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

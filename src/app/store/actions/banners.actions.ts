import {createAction, props} from "@ngrx/store";

export const searchAndFilterFormSubmit = createAction(
"[Banners Component] Search And Sort",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const deleteButtonClicked = createAction(
  '[Banners Component] Delete Banner',
  props<{ bannerId: number | string}>()
);

export const tableRowClicked = createAction(
  "[Banners Component] Get Banner By Id",
  props<{editFlag?: boolean, bannerId: number}>()
)

export const bannerFormChanged = createAction(
  "[Banners Component] Set Data",
  props<{formData: any | undefined}>()
)

export const fileInputChanged = createAction(
  "[Banners Component] Select Image File",
    props<{file: any}>()
)

export const submitBannerData = createAction(
  "[Banners Component] Set Form Data Response",
  props<{bannerData: any, bannerId: number | string}>()
)

export const drawerToggle = createAction(
  '[Banners Component] open',
  props<{drawerState: boolean}>()
)

export const changeQueryParams = createAction(
  '[Banners Component] Get Banners Data',
  props<{queryParams: any}>()
)

export const resetBannerFormAction = createAction(
    '[Banners Component] Reset Banner Form',
)

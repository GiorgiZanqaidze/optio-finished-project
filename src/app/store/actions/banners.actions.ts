import {createAction, props} from "@ngrx/store";

export const bannersPageChange = createAction(
  '[Banners Component] Change Pagination',
  props<{page: number, pageSize: number}>()
)

export const setBannersSearchAndSortForm = createAction(
"[Banners Component] Search And Sort",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const deleteBanner = createAction(
  '[Banners Component] Delete Banner',
  props<{ bannerId: number | string}>()
);

export const getBannerById = createAction(
  "[Banners Component] Get Banner By Id",
  props<{editFlag?: boolean, bannerId: number}>()
)

export const setFormData = createAction(
  "[Banners Component] Set Data",
  props<{formData: any | undefined}>()
)

export const selectFile = createAction(
  "[Banners Component] Select Image File",
    props<{file: any}>()
)

export const setDeleteButton = createAction(
  "[Banners Component] Set Delete Button",
  props<{show: boolean}>()
)

export const setBannerId = createAction(
  "[Banners Component] Set Banner Id",
  props<{id: number | string}>()
)

export const submitFormData = createAction(
  "[Banners Component] Submit Data",
  props<{data: any, blob: any}>()
)

export const submitBannerData = createAction(
  "[Banners Component] Set Form Data Response",
  props<{bannerData: any, editFlag: boolean}>()
)

export const submitBannerDataSuccess = createAction(
  "[Banners Component] Set Form Data Response",
  props<{bannerData: any, editFlag: boolean, drawerState: false, submitBannerLoading: false}>()
)

export const openEditForm = createAction(
  "[Banners Component] Open Edit Form",
)

export const drawerToggle = createAction(
  '[Banners Component] open',
  props<{drawerState: boolean}>()
)

export const resetBannerFormAction = createAction(
    '[Banners Component] Reset Banner Form',
)

export const startLoading = createAction('[Banners Component] Start Loading');
export const stopLoading = createAction('[Banners Component] Stop Loading');

export const startSubmitBannerLoading = createAction('[Banners Component] Start Submit Banner Loading');
export const stopSubmitBannerLoading = createAction('[Banners Component] Stop Submit Banner Loading');
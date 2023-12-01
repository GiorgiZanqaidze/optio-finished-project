import {createAction, props} from "@ngrx/store";

export const searchAndFilterFormSubmit = createAction(
"[Banners Component] Search And filter Form Change",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const deleteButtonClicked = createAction(
  '[Banners Component] Delete Button Clicked',
  props<{ bannerId: number | string}>()
);

export const tableRowClicked = createAction(
  "[Banners Component] Table Row Clicked",
  props<{editFlag?: boolean, bannerId: number}>()
)

export const bannerFormChanged = createAction(
  "[Banners Component] Banner Form Changed",
  props<{formData: any | undefined}>()
)

export const fileInputChanged = createAction(
  "[Banners Component] File Input Changed",
    props<{file: any}>()
)

export const submitBannerData = createAction(
  "[Banners Component] Submit Banner Data",
  props<{bannerData: any, bannerId: number | string}>()
)

export const drawerToggle = createAction(
  '[Banners Component] Drawer Toggled',
  props<{drawerState: boolean}>()
)

export const changeQueryParams = createAction(
  '[Banners Component] Change Query Params',
  props<{queryParams: any}>()
)

export const closeDrawer = createAction(
    '[Banners Component] Close Drawer',
)

import { createAction, props } from "@ngrx/store";
import { Banner } from "src/app/shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const submitServerError = createAction(
  "[Banners Component] Set Server Error",
  props<{error: string}>()
)

export const addOrEditBanner = createAction(
  "[Banners Component] Add Or Edit",
  props<{newBanner: Banner, editFlag: boolean, drawerState: boolean, submitBannerLoading: boolean}>()
)

export const referenceDataApiError = createAction(
  "[Banners Component] Reference Data Api Error",
)

export const setReferenceData = createAction(
  "[Banners Component] Set Banners Data",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)


export const errorResponse = createAction(
  "[Banners Component] Get Error Response",
  props<{error: string}>()
)

export const deleteBannerSuccess = createAction(
  '[Banners Component] Delete Banner Success',
  props<{ bannerId: number | string, drawerState: boolean, submitBannerLoading: boolean}>()
);


export const selectFileSuccess = createAction(
  "[Banners Component] Select Image File",
  props<{imageId: string | number}>()
)


export const setBannersData = createAction(
  "[Banners Component] SetData",
  props<{
      bannersData: {total: number, entities: Banner[], searchAfter: string[]},
      page: number,
      pageSize: number,
      search: string,
      sortBy: string,
      sortDirection: string
    }>()
)

export const setBannerData = createAction(
  "[Banners Component] Set Banner By Id",
  props<{bannerData: Banner}>()
)

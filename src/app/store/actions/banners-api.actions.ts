import { createAction, props } from "@ngrx/store";
import { Banner } from "src/app/shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const uploadBannerFailed = createAction(
  "[Banners Component] Set Server Error",
  props<{error: string}>()
)

export const uploadBannerSuccess = createAction(
  "[Banners Component] Add Or Edit",
  props<{newBanner: Banner, bannerId: string | number, drawerState: boolean, submitBannerLoading: boolean}>()
)

export const referenceDataLoadSuccess = createAction(
  "[Banners Component] Set Banners Data",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)

export const referenceDataLoadFailed = createAction(
  "[Banners Component] Reference Data Api Error",
)



export const deleteBannerSuccess = createAction(
  '[Banners Component] Delete Banner Success',
  props<{ bannerId: number | string, drawerState: boolean, submitBannerLoading: boolean}>()
);

export const deleteBannerFailed = createAction(
  '[Banners Component] Delete Banner Failed',
);

export const fileUploadSuccess = createAction(
  "[Banners Component] Upload File Success",
  props<{imageId: string | number}>()
)

export const fileUploadFailed = createAction(
  "[Banners Component] Upload File Failed",
)

export const filterBannersSuccess = createAction(
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

export const submitBannerSuccess = createAction(
  "[Banners Component] Set Banner By Id",
  props<{bannerData: Banner}>()
)


export const submitBannerFailed = createAction(
  "[Banners Component] Submit Banner Failed",
  props<{error: string}>()
)

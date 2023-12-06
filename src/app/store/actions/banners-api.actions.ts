import { createAction, props } from "@ngrx/store";
import { Banner } from "src/app/shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const uploadBannerFailed = createAction(
  "[Banners Api] Upload Banner Failed",
  props<{error: string}>()
)

export const uploadBannerSuccess = createAction(
  "[Banners Api] Upload Banner Success",
  props<{newBanner: Banner, bannerId: string | number, drawerState: boolean, submitBannerLoading: boolean}>()
)

export const referenceDataLoadSuccess = createAction(
  "[Banners Api] Reference Data Load Success",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)

export const referenceDataLoadFailed = createAction(
  "[Banners Api] Reference Data Load Failed",
)

export const deleteBannerSuccess = createAction(
  '[Banners Api] Delete Banner Success',
  props<{ bannerId: number | string}>()
);

export const deleteBannerFailed = createAction(
  '[Banners Api] Delete Banner Failed',
);

export const fileUploadSuccess = createAction(
  "[Banners Api] Upload File Success",
  props<{imageId: string | number}>()
)

export const fileUploadFailed = createAction(
  "[Banners Api] Upload File Failed",
)

export const filterBannersSuccess = createAction(
  "[Banners Api] Filter Banners Success",
  props<{
      bannersData: {total: number, entities: Banner[], searchAfter: string[]},
      page: number,
      pageSize: number,
      search: string,
      sortBy: string,
      sortDirection: string
    }>()
)

export const filterBannersFailed = createAction(
  "[Banners Api] Filter Banners Failed",
)

export const findBannerSuccess = createAction(
  "[Banners Api] Find Banner Success",
  props<{bannerData: Banner}>()
)

export const submitBannerFailed = createAction(
  "[Banners Api] Submit Banner Failed",
  props<{error: string}>()
)

import { createAction, props } from "@ngrx/store";
import { Banner } from "src/app/shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const uploadBannerFailed = createAction(
  "[Banners Component] Upload Banner Failed",
  props<{error: string}>()
)

export const uploadBannerSuccess = createAction(
  "[Banners Component] Upload Banner Success",
  props<{newBanner: Banner, bannerId: string | number, drawerState: boolean, submitBannerLoading: boolean}>()
)

export const referenceDataLoadSuccess = createAction(
  "[Banners Component] Reference Data Load Success",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)

export const referenceDataLoadFailed = createAction(
  "[Banners Component] Reference Data Load Failed",
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
  "[Banners Component] Filter Banners Success",
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
  "[Banners Component] Filter Banners Failed",
)

export const submitBannerSuccess = createAction(
  "[Banners Component] Submit Banner Success",
  props<{bannerData: Banner}>()
)


export const submitBannerFailed = createAction(
  "[Banners Component] Submit Banner Failed",
  props<{error: string}>()
)

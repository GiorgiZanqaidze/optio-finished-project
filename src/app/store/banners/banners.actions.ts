import {createAction, props} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";

export const bannersPageChange = createAction(
  '[Banners] Change Pagination',
  props<{page: number, pageSize: number}>()
)

export const setBannersData = createAction(
  "[Banners] SetData",
  props<{bannersData: {total: number, entities: BannerModel[], searchAfter: string[]}}>()
)

export const setBannersSearchAndSortForm = createAction(
  "[Banners] Search And Sort",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const filterBannersData = createAction(
  "[Banners] filter Banners Data",
  props<{id: number | null}>()
)

export const deleteBanner = createAction(
  '[Banners] Delete Banner',
  props<{ bannerId: number | string}>()
);

export const deleteBannerError = createAction(
  '[Banners] Delete Banner Error',
  props<{ error: any }>()
);

export const showEditForm = createAction(
  '[Banners] Edit Banner Form',
  props<{editFlag: boolean, bannerId: number}>()
)


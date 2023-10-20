import {createAction, props} from "@ngrx/store";
import {Banner} from "../../shared/types/banner";

export const bannersPageChange = createAction(
  '[Banners] Change Pagination',
  props<{page: number, pageSize: number}>()
)

export const setBannersData = createAction(
  "[Banners] SetData",
  props<{bannersData: {total: number, entities: Banner[], searchAfter: string[]}}>()
)

export const setBannersSearchAndSortForm = createAction(
  "[Banners] Search And Sort",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const deleteBanner = createAction(
  '[Banners] Delete Banner',
  props<{ bannerId: number | string}>()
);

export const addOrEditBanner = createAction(
  "[Banner] Add Or Edit",
  props<{newBanner: Banner, editFlag: boolean}>()
)

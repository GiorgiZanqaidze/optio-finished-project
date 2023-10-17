import {createAction, props} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";

export const bannersPageChange = createAction(
  '[Banners] changePageSize',
  props<{page: number}>()
)

export const setBannersData = createAction(
  "[Banners] setData",
  props<{bannersData: {total: number, entities: BannerModel[], searchAfter: string[]}}>()
)


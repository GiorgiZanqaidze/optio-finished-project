import {createAction, props} from "@ngrx/store";
import {BannerModel} from "../../types/banners/banner.model";



export const loadBanners = createAction('[Banners] load Banners')

export const loadBannersSuccess = createAction(
  "[Banners] load Banners Success",
  props<{banners: BannerModel[]}>()
)

export const loadBannersFailure = createAction(
  "[Banners] load Banners Failure",
  props<{error: string}>()
)

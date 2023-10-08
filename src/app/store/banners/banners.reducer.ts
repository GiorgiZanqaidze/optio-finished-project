import {createReducer} from "@ngrx/store";
import {BannerModel} from "../../types/banners/banner.model";

const initialState: BannerModel[] = []

export const bannersReducer = createReducer(
  initialState,

)

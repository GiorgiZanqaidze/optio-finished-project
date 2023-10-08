import {createReducer, on} from "@ngrx/store";
import {BannerModel} from "../../types/banners/banner.model";



const initialState: {totalPages: number | null, data: BannerModel[]} = {
  totalPages: null,
  data: []
}

export const bannersReducer = createReducer(
  initialState,
)

import {createReducer, on} from "@ngrx/store";
import {bannersPageChange, setBannersData} from "./banners.actions";
import {BannerModel} from "../../shared/types/banner.model";


export interface BannersStore {
  bannersPage: number,
  bannersPageSize: number
  bannersData: BannerModel[],
  totalPages: number
}

const initialState: BannersStore = {
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0
}

export const bannersReducer = createReducer(
  initialState,
  on(bannersPageChange, (state, action) => {
    return ({...state, bannersPage: action.page})
  }),
  on(setBannersData, (state, action) => {
    return {
      ...state,
      bannersData: action.bannersData.entities,
      totalPages: action.bannersData.total
    }
  })
)

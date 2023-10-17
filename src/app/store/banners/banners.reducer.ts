import {createReducer, on} from "@ngrx/store";
import {
  bannersPageChange,
  setBannersData,
  setBannersSearchAndSortForm
} from "./banners.actions";
import {BannerModel} from "../../shared/types/banner.model";

export interface BannersStore {
  bannersPage: number,
  bannersPageSize: number
  bannersData: BannerModel[],
  totalPages: number
  searchAndSortBannerForm: {search: string, sortDirection: string, sortBy: string}
}

const initialState: BannersStore = {
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0,
  searchAndSortBannerForm: {search: "", sortDirection: "", sortBy: ""}
}

export const bannersReducer = createReducer(
  initialState,
  on(bannersPageChange, (state, action) => {
    return ({...state, bannersPage: action.page, bannersPageSize: action.pageSize})
  }),
  on(setBannersData, (state, action) => {
    return {
      ...state,
      bannersData: action.bannersData.entities,
      totalPages: action.bannersData.total
    }
  }),
  on(setBannersSearchAndSortForm, (state, action) => {
    const modifiedForm = {
      search: action.search,
      sortDirection: action.sortDirection,
      sortBy: action.sortBy
    }
    return {
      ...state,
      searchAndSortBannerForm: modifiedForm
    }
  })
)

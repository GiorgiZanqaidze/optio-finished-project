import {createReducer, on} from "@ngrx/store";
import {
  addOrEditBanner,
  bannersPageChange, deleteBanner,
  errorResponse,
  setBannersData,
  setBannersSearchAndSortForm,
} from "./banners.actions";
import {Banner} from "../../shared/types/banner";

export interface BannersStore {
  bannersPage: number,
  bannersPageSize: number
  bannersData: Banner[],
  totalPages: number
  searchAndSortBannerForm: {search: string, sortDirection: string, sortBy: string},
  showBannerEditForm: {editFlag: boolean, bannerId: number},
  apiError: string | null
}

const initialState: BannersStore = {
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0,
  searchAndSortBannerForm: {search: "", sortDirection: "", sortBy: ""},
  showBannerEditForm: {editFlag: false, bannerId: 0},
  apiError: null
}

export const bannersReducer = createReducer(
  initialState,

  on(bannersPageChange, (state, action) => {
    return ({...state, bannersPage: action.page, bannersPageSize: action.pageSize})
  }),

  on(setBannersData, (state, action) => {
    return {
      ...state,
      bannersData: action.bannersData.entities as Banner[],
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
  }),

  on(deleteBanner, (state, action) => {
    const filteredBanners = state.bannersData.filter((banner) => {
      return action.bannerId !== banner.id
    })
    return {...state, bannersData: filteredBanners}
  }),

  on(addOrEditBanner, (state, {newBanner, editFlag}) => {
    if (editFlag) {
      const newState = state.bannersData.map((banner) => {
        if (newBanner.id === banner.id) {
          return newBanner
        } else {
          return banner
        }
      })
      return {...state, bannersData: newState}
    } else {
      const cloneBanners = state.bannersData.slice()
      cloneBanners.unshift(newBanner)
      const newState = cloneBanners
      return {...state, bannersData: newState, totalPages: state.totalPages + 1}
    }
  }),

  on(errorResponse, (state, action) => {

    console.log(state);

    return {...state, apiError: action.error}
  })
)

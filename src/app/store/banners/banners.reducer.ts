import {createReducer, on} from "@ngrx/store";
import {
  addOrEditBanner,
  bannersPageChange, deleteBanner,
  setBannersData,
  setBannersSearchAndSortForm, submitBannersData,
} from "./banners.actions";
import {BannerModel} from "../../shared/types/banner.model";

export interface BannersStore {
  bannersPage: number,
  bannersPageSize: number
  bannersData: BannerModel[],
  totalPages: number
  searchAndSortBannerForm: {search: string, sortDirection: string, sortBy: string},
  showBannerEditForm: {editFlag: boolean, bannerId: number}
}

const initialState: BannersStore = {
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0,
  searchAndSortBannerForm: {search: "", sortDirection: "", sortBy: ""},
  showBannerEditForm: {editFlag: false, bannerId: 0}
}

export const bannersReducer = createReducer(
  initialState,

  on(bannersPageChange, (state, action) => {
    return ({...state, bannersPage: action.page, bannersPageSize: action.pageSize})
  }),

  on(setBannersData, (state, action) => {
    return {
      ...state,
      bannersData: action.bannersData.entities as BannerModel[],
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

  on(submitBannersData, (state, action) =>{
    return state
  }),

  on(addOrEditBanner, (state, {newBanner}) => {
    const editFlag = localStorage.getItem('editFlag')
    let newState
    if (editFlag && JSON.parse(editFlag)) {
      newState = state.bannersData.map((banner) => {
        if (newBanner.id == banner.id) {
          return newBanner
        } else {
          return banner
        }
      })
      return {...state, bannersData: newState}
    } else {
      const cloneBanners = state.bannersData.slice()
      cloneBanners.unshift(newBanner)
      cloneBanners.pop()
      newState = cloneBanners
      return {...state, bannersData: newState, totalPages: state.totalPages + 1}
    }
  })
)

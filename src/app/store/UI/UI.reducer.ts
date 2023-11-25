import {createReducer, on} from "@ngrx/store";
import {drawerToggle, startLoading, startSubmitBannerLoading, stopLoading, stopSubmitBannerLoading} from "./UI.action";


export interface UIStore {
  drawer: boolean,
  isLoading: boolean,
  isLoadingSubmitBanner: boolean
}

export const initialState = {
  drawer: false,
  isLoading: false,
  isLoadingSubmitBanner: false
}

export const UIReducer = createReducer(
  initialState,
  on(drawerToggle, (state, {drawerState}) => {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawerState))
    return {...state, drawer: drawerState}
  }),

  on(startLoading, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(stopLoading, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(startSubmitBannerLoading, (state) => ({
    ...state,
    isLoadingSubmitBanner: true,
  })),

  on(stopSubmitBannerLoading, (state) => ({
    ...state,
    isLoadingSubmitBanner: false,
  }))
)

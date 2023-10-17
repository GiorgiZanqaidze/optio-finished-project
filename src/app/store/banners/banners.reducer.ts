import {createReducer, on} from "@ngrx/store";
import {bannersPageChange} from "./banners.actions";


export interface BannersStore {
  bannersPage: number
}

const initialState: BannersStore = {
  bannersPage: 0
}

export const bannersReducer = createReducer(
  initialState,
  on(bannersPageChange, (state, action) => {
    return ({...state, bannersPage: action.page})
  })
)

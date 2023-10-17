import { createFeatureSelector, createSelector } from '@ngrx/store';
import {BannersStore} from "./banners.reducer";

const selectBannersState = createFeatureSelector<BannersStore>('banners');

export const bannersPage = createSelector(
  selectBannersState,
  (state) => state.bannersPage
);

export const bannersData = createSelector(
  selectBannersState,
  (state) => state.bannersData
)

export const totalPages = createSelector(
  selectBannersState,
  (state) => state.totalPages
)

export const bannersPageSize = createSelector(
  selectBannersState,
  (state) => state.bannersPageSize
)

export const searchAndSortBannerForm = createSelector(
  selectBannersState,
  (state) => state.searchAndSortBannerForm
)





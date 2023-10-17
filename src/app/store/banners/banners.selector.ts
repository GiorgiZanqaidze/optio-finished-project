import { createFeatureSelector, createSelector } from '@ngrx/store';
import {BannersStore} from "./banners.reducer";

const selectBannersState = createFeatureSelector<BannersStore>('banners');

export const bannersPage = createSelector(
  selectBannersState,
  (state) => state.bannersPage
);





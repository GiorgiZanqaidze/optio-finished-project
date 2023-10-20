import {createSelector, createFeatureSelector} from "@ngrx/store";
import {UIStore} from "./UI.reducer";


const selectUIState = createFeatureSelector<UIStore>('UI');

export const drawerUI = createSelector(
  selectUIState,
  (state) => state.drawer
);

export const isLoadingUI = createSelector(
  selectUIState,
  (state) => state.isLoading
);

export const isLoadingSubmitBanner = createSelector(
  selectUIState,
  (state) => state.isLoadingSubmitBanner
);

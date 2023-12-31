import { createFeatureSelector, createSelector } from '@ngrx/store';
import {adapter, BannersStore} from "../state/banners.state";

const selectBannersState = createFeatureSelector<BannersStore>('banners');

const { selectAll: entitiesSelectAll } = adapter.getSelectors();

export const selectBanners = createSelector(
    selectBannersState,
    entitiesSelectAll,
);

export const totalPages = createSelector(
  selectBannersState,
  (state) => state.totalPages
)

export const uploadBlobLoader = createSelector(
  selectBannersState,
  (state) => state.uploadBlobLoader
)

export const apiError = createSelector(
  selectBannersState,
  (state) => state.apiError
)

export const bannerFormData = createSelector(
  selectBannersState,
  (state) => state.bannerFormData
);

export const showDeleteButton = createSelector(
  selectBannersState,
  (state) => state.showDeleteButton
);


export const formServerError = createSelector(
  selectBannersState,
  (state) => state.formServerError
)

export const channelsReference = createSelector(
  selectBannersState,
  (state) => state.channels
)

export const languagesReference = createSelector(
  selectBannersState,
  (state) => state.languages
)

export const zonesReference = createSelector(
  selectBannersState,
  (state) => state.zones
)

export const labelsReference = createSelector(
  selectBannersState,
  (state) => state.labels
)

export const drawerUI = createSelector(
  selectBannersState,
  (state) => state.drawer
);

export const isLoadingUI = createSelector(
  selectBannersState,
  (state) => state.isLoading
);

export const isLoadingSubmitBanner = createSelector(
  selectBannersState,
  (state) => state.isFormLoading
);

export const fileIdChanges = createSelector(
    selectBannersState,
    (state) => state.imageId
);

export const resetBannerForm = createSelector(
    selectBannersState,
    (state) => state.resetBannerForm
);

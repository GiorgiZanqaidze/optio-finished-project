import { createFeatureSelector, createSelector } from '@ngrx/store';
import {adapter, BannersStore} from "./state/banners.state";

const selectBannersState = createFeatureSelector<BannersStore>('banners');

const { selectAll: entitiesSelectAll } = adapter.getSelectors();

export const selectBanners = createSelector(
    selectBannersState,
    entitiesSelectAll,
);

export const bannersPage = createSelector(
  selectBannersState,
  (state) => state.bannersPage
);


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

export const apiError = createSelector(
  selectBannersState,
  (state) => state.apiError
)


// form selectors=======================================================
export const bannerFormData = createSelector(
  selectBannersState,
  (state) => state.bannerFormData
);

export const fileFormData = createSelector(
  selectBannersState,
  (state) => state.fileFormData
);

export const showDeleteButton = createSelector(
  selectBannersState,
  (state) => state.showDeleteButton
);

export const editFileId = createSelector(
  selectBannersState,
  (state) => state.editFileId
)

export const bannerId = createSelector(
  selectBannersState,
  (state) => state.bannerId
)

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


// UI selectors
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
  (state) => state.isLoadingSubmitBanner
);

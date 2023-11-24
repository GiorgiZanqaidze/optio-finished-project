import {createSelector, createFeatureSelector} from "@ngrx/store";
import {FormStore} from "./form.reducer";


const selectFormState = createFeatureSelector<FormStore>('form');

export const bannerFormData = createSelector(
  selectFormState,
  (state) => state.bannerFormData
);

export const fileFormData = createSelector(
  selectFormState,
  (state) => state.fileFormData
);

export const showDeleteButton = createSelector(
  selectFormState,
  (state) => state.showDeleteButton
);

export const editFileId = createSelector(
  selectFormState,
  (state) => state.editFileId
)

export const bannerId = createSelector(
  selectFormState,
  (state) => state.bannerId
)

export const formServerError = createSelector(
  selectFormState,
  (state) => state.formServerError
)

export const channelsReference = createSelector(
  selectFormState,
  (state) => state.channels
)

export const languagesReference = createSelector(
  selectFormState,
  (state) => state.languages
)

export const zonesReference = createSelector(
  selectFormState,
  (state) => state.zones
)

export const labelsReference = createSelector(
  selectFormState,
  (state) => state.labels
)

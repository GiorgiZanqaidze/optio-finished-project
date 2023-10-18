import {createSelector, createFeatureSelector} from "@ngrx/store";
import {FormStore} from "./form.reducer";


const selectFormState = createFeatureSelector<FormStore>('form');

export const bannerFormData = createSelector(
  selectFormState,
  (state) => state.bannerFormData
);

import {createReducer, on} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";
import {setFormData} from "./form.actions";

export interface FormStore {
  bannerFormData: BannerModel
}


const initialState = {
  bannerFormData: {}
}


export const formReducer = createReducer(
  initialState,
  on(setFormData, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  })
)

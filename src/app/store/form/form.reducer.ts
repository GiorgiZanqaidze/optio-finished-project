import {createReducer, on} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";
import {setFormData} from "./form.actions";
import {FormControl, Validators} from "@angular/forms";

export interface BannerForm {
  name: null | string,
  zoneId: null | string | number,
  active: null | boolean,
  startDate: null | string,
  endDate: null | string,
  fileId: null | number | string,
  priority: null | number | string,
  channelId: null | number | string,
  language: null | string,
  url: null | string,
  labels: null | string[]
}

export interface FormStore {
  bannerFormData: BannerModel
}


const initialState = {
  bannerFormData: {
    name: null,
    zoneId: null,
    active: null,
    startDate: null,
    endDate: null,
    fileId: null,
    priority: null,
    channelId: null,
    language: null,
    url: null,
    labels: null
  }
}


export const formReducer = createReducer(
  initialState,
  on(setFormData, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),

)

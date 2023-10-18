import {createReducer, on} from "@ngrx/store";
import {BannerModel} from "../../shared/types/banner.model";
import {selectFile, setFormData} from "./form.actions";
import {fileReader} from "../../shared/utilities/file-utils";

export interface FormStore {
  bannerFormData: BannerModel,
  fileFormData: FormData
}

const initialState: FormStore = {
  bannerFormData: {
    id: 0,
    name: "",
    zoneId: "",
    active: null,
    startDate: "",
    endDate: null,
    fileId: null,
    priority: "",
    channelId: "",
    language: "",
    url: "",
    labels: []
  },
  fileFormData: new FormData()
}

export const formReducer = createReducer(
  initialState,
  on(setFormData, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),
  on(selectFile, (state, {file}) => {
    const modifiedFile = fileReader(file)
    const fileForm = new FormData();
    fileForm.set('blob', modifiedFile)
    const modifiedFormData = {...state.bannerFormData, fileId: modifiedFile.name }
    return {...state, bannerFormData: modifiedFormData, fileFormData: fileForm }
  }),
)

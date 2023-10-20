import {createReducer, on} from "@ngrx/store";
import {Banner} from "../../shared/types/banner";
import {selectFile, setBannerId, setDeleteButton, setEditFileId, setFormData} from "./form.actions";
import {fileReader} from "../../shared/utilities/file-utils";

export interface FormStore {
  bannerFormData: Banner,
  fileFormData: FormData,
  showDeleteButton: boolean,
  editFileId: null | string | number,
  bannerId: null | string | number
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
  fileFormData: new FormData(),
  showDeleteButton: false,
  editFileId: null,
  bannerId: null
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

  on(setDeleteButton, (state, {show}) => {
    return {...state, showDeleteButton: show}
  }),

  on(setEditFileId, (state, {id}) => {
    return {...state, editFileId: id}
  }),

  on(setBannerId, (state, {id}) => {
    return {...state, bannerId: id}
  }),
)

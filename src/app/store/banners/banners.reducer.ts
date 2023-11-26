import {createReducer, on} from "@ngrx/store";
import {
  addOrEditBanner,
  bannersPageChange, deleteBanner,
  errorResponse,
  setBannerData,
  setBannersData,
  setBannersSearchAndSortForm,
} from "./banners.actions";
import {Banner} from "../../shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";
import {
  selectFile,
  setBannerId,
  setDeleteButton,
  setEditFileId,
  setFormData, setReferenceData,
  submitServerError
} from "../form/form.actions";
import {fileReader} from "../../shared/utilities/file-utils";
import {
  drawerToggle,
  startLoading,
  startSubmitBannerLoading,
  stopLoading,
  stopSubmitBannerLoading
} from "../UI/UI.action";

export interface BannersStore {
  bannersPage: number,
  bannersPageSize: number
  bannersData: Banner[],
  totalPages: number
  searchAndSortBannerForm: {search: string, sortDirection: string, sortBy: string},
  showBannerEditForm: {editFlag: boolean, bannerId: number},
  apiError: string | null,
  // form store =========================================
  bannerFormData: Banner,
  fileFormData: FormData,
  showDeleteButton: boolean,
  editFileId: null | string | number,
  bannerId: null | string | number,
  formServerError: null | string,
  channels: ReferenceData[]
  zones: ReferenceData[]
  languages: ReferenceData[]
  labels: ReferenceData[]
//   UI store
  drawer: boolean,
  isLoading: boolean,
  isLoadingSubmitBanner: boolean
}

const initialState: BannersStore = {
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0,
  searchAndSortBannerForm: {search: "", sortDirection: "", sortBy: ""},
  showBannerEditForm: {editFlag: false, bannerId: 0},
  apiError: null,
  // form store =========================================
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
  bannerId: null,
  formServerError: null,
  channels: [],
  zones: [],
  languages: [],
  labels: [],
  // UI store
  drawer: false,
  isLoading: false,
  isLoadingSubmitBanner: false
}

export const bannersReducer = createReducer(
  initialState,


  on(setBannersData, (state, action) => {

    const searchAndSortBannerForm = {
      search: action.search,
      sortDirection: action.sortDirection,
      sortBy: action.sortBy
    }
    return {
      ...state,
      bannersData: action.bannersData.entities as Banner[],
      totalPages: action.bannersData.total,
      isLoading: false,
      bannersPage: action.page,
      bannersPageSize: action.pageSize,
      searchAndSortBannerForm: searchAndSortBannerForm
      // search: s,
      // sortBy: string,
      // sortDirection: string
    }
  }),

  on(setBannersSearchAndSortForm, (state, action) => {
    const modifiedForm = {
      search: action.search,
      sortDirection: action.sortDirection,
      sortBy: action.sortBy
    }
    return {
      ...state,
      searchAndSortBannerForm: modifiedForm
    }
  }),

  on(deleteBanner, (state, action) => {
    const filteredBanners = state.bannersData.filter((banner) => {
      return action.bannerId !== banner.id
    })
    return {...state, bannersData: filteredBanners}
  }),

  on(addOrEditBanner, (state, {newBanner, editFlag}) => {
    if (editFlag) {
      const newState = state.bannersData.map((banner) => {
        if (newBanner.id === banner.id) {
          return newBanner
        } else {
          return banner
        }
      })
      return {...state, bannersData: newState}
    } else {
      const cloneBanners = state.bannersData.slice()
      cloneBanners.unshift(newBanner)
      const newState = cloneBanners
      return {...state, bannersData: newState, totalPages: state.totalPages + 1}
    }
  }),

  on(errorResponse, (state, action) => {
    return {...state, apiError: action.error, isLoading: false}
  }),

  on(setBannerData, (state, {bannerData}) =>  {
    console.log(bannerData);

    return state
  }),


//   form reducers ====================================================
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

  on(submitServerError, (state, {error}) => {
    return {...state, formServerError: error}
  }),

  on(setReferenceData, (state, {channels, labels, zones, languages}) => {
    return {...state, channels, labels, zones, languages }
  }),

//   Ui reducers
  on(drawerToggle, (state, {drawerState}) => {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawerState))
    return {...state, drawer: drawerState}
  }),

  on(startLoading, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(stopLoading, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(startSubmitBannerLoading, (state) => ({
    ...state,
    isLoadingSubmitBanner: true,
  })),

  on(stopSubmitBannerLoading, (state) => ({
    ...state,
    isLoadingSubmitBanner: false,
  }))
)

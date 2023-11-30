import {createReducer, on} from "@ngrx/store";
import {
  deleteBanner,
  drawerToggle,
  getBannersData,
  getReferenceData,
  resetBannerFormAction,
  setBannerId,
  setBannersSearchAndSortForm,
  setDeleteButton,
  setFormData,
  startLoading,
  startSubmitBannerLoading,
  stopLoading,
  stopSubmitBannerLoading,
  submitBannerData,
} from "../actions/banners.actions";
import {adapter, BannersStore} from "../state/banners.state";
import { addOrEditBanner, deleteBannerSuccess, errorResponse, selectFileSuccess, setBannerData, setBannersData, setReferenceData, submitServerError } from "../actions/banners-api.actions";


const initialState: BannersStore = adapter.getInitialState({
  bannersPage: 0,
  bannersPageSize: 0,
  bannersData: [],
  totalPages: 0,
  searchAndSortBannerForm: {search: "", sortDirection: "", sortBy: ""},
  apiError: null,
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
  showDeleteButton: false,
  bannerId: null,
  formServerError: null,
  channels: [],
  zones: [],
  languages: [],
  labels: [],
  drawer: false,
  isLoading: false,
  isLoadingSubmitBanner: false,
  imageId: null,
  resetBannerForm: false
})

export const bannersReducer = createReducer(
  initialState,
  on(setBannersData, (state, action) => {

    const searchAndSortBannerForm = {
      search: action.search,
      sortDirection: action.sortDirection,
      sortBy: action.sortBy
    }

    const bannersEntities = action.bannersData.entities

    return adapter.setAll(
      bannersEntities,
        {
          ...state,
        totalPages: action.bannersData.total,
        isLoading: false,
        bannersPage: action.page,
        bannersPageSize: action.pageSize,
        searchAndSortBannerForm: searchAndSortBannerForm,
          bannersSuccessLoad: true
        })
  }),


  on(getBannersData, (state) => {
    return {...state, isLoading: true}
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

  on(deleteBanner, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(deleteBannerSuccess, (state, action) => {
    return adapter.removeOne(action.bannerId.toString(), {...state, drawer: action.drawerState, isLoadingSubmitBanner: action.submitBannerLoading})
  }),

  on(addOrEditBanner, (state, {newBanner, editFlag}) => {
    if (editFlag) {
      return adapter.setOne(newBanner, {...state, drawer: false, isLoadingSubmitBanner: false})
    } else {
      return adapter.addOne(newBanner, {...state, totalPages: state.totalPages + 1, drawer: false, isLoadingSubmitBanner: false})
    }
  }),

  on(errorResponse, (state, action) => {
    return {...state, apiError: action.error, isLoading: false}
  }),

  on(setBannerData, (state, {bannerData}) =>  {
    const bannerFormData = {
      id: bannerData.id,
      name: bannerData.name,
      zoneId: bannerData.zoneId,
      active: bannerData.active,
      startDate: bannerData.startDate,
      endDate: bannerData.endDate,
      fileId: bannerData.fileId,
      priority: bannerData.priority,
      channelId: bannerData.channelId,
      language: bannerData.language,
      url: bannerData.url,
      labels: bannerData.labels
    }
    return {...state, bannerFormData, drawer: true, showDeleteButton: true}
  }),

  on(setFormData, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),

  on(selectFileSuccess, (state, {imageId}) => {
    return {...state, imageId }
  }),

  on(setDeleteButton, (state, {show}) => {
    return {...state, showDeleteButton: show}
  }),

  on(setBannerId, (state, {id}) => {
    return {...state, bannerId: id}
  }),

  on(submitServerError, (state, {error}) => {
    return {...state, formServerError: error}
  }),

  on(setReferenceData, (state, {channels, labels, zones, languages}) => {
    return {...state, channels, labels, zones, languages}
  }),

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
  })),

  on(setFormData, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),

  on(submitBannerData, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(resetBannerFormAction, (state) => {
    return {...state, resetBannerForm: !state.resetBannerForm, drawerState: false, showDeleteButton: false, formServerError: null}
  }),

  on(getReferenceData, (state, {drawerState}) => {
    return {...state, drawer: drawerState}
  })
)

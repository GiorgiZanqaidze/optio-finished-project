import {createReducer, on} from "@ngrx/store";
import {
  drawerToggle,
  tableRowClicked,
  changeQueryParams,
  resetBannerFormAction,
  searchAndFilterFormSubmit,
  bannerFormChanged,
  submitBannerData,
  deleteButtonClicked,
} from "../actions/banners.actions";
import {adapter, BannersStore} from "../state/banners.state";
import { uploadBannerSuccess, deleteBannerSuccess, submitBannerFailed, fileUploadSuccess, submitBannerSuccess, filterBannersSuccess, uploadBannerFailed, referenceDataLoadSuccess } from "../actions/banners-api.actions";


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
  on(filterBannersSuccess, (state, action) => {

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

  on(tableRowClicked, (state) => {
    return {...state, drawer: true}
  }),


  on(changeQueryParams, (state) => {
    return {...state, isLoading: true}
  }),

  on(searchAndFilterFormSubmit, (state, action) => {
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

  on(deleteButtonClicked, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(deleteBannerSuccess, (state, action) => {
    return adapter.removeOne(action.bannerId.toString(), {...state, drawer: action.drawerState, isLoadingSubmitBanner: action.submitBannerLoading})
  }),

  on(uploadBannerSuccess, (state, {newBanner, bannerId}) => {
    if (bannerId) {
      return adapter.setOne(newBanner, {...state, drawer: false, isLoadingSubmitBanner: false})
    } else {
      return adapter.addOne(newBanner, {...state, totalPages: state.totalPages + 1, drawer: false, isLoadingSubmitBanner: false})
    }
  }),

  on(submitBannerFailed, (state, action) => {
    return {...state, apiError: action.error, isLoading: false}
  }),

  on(submitBannerSuccess, (state, {bannerData}) =>  {
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

  on(bannerFormChanged, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),

  on(fileUploadSuccess, (state, {imageId}) => {
    return {...state, imageId }
  }),


  on(uploadBannerFailed, (state, {error}) => {
    return {...state, formServerError: error}
  }),

  on(referenceDataLoadSuccess, (state, {channels, labels, zones, languages}) => {
    return {...state, channels, labels, zones, languages}
  }),

  on(drawerToggle, (state, {drawerState}) => {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawerState))
    return {...state, drawer: drawerState}
  }),

  on(bannerFormChanged, (state, {formData}) => {
    return {...state, bannerFormData: formData}
  }),

  on(submitBannerData, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(resetBannerFormAction, (state) => {
    return {...state, resetBannerForm: !state.resetBannerForm, drawer: false, showDeleteButton: false, formServerError: null}
  }),


)

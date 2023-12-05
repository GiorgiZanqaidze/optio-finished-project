import {createReducer, on} from "@ngrx/store";
import {
  drawerToggle,
  tableRowClicked,
  changeQueryParams,
  closeDrawer,
  submitBannerData,
  deleteButtonClicked,
  drawerOpen,
  fileInputChanged,
} from "../actions/banners.actions";
import {adapter, BannersStore} from "../state/banners.state";
import { uploadBannerSuccess, deleteBannerSuccess, submitBannerFailed, fileUploadSuccess, submitBannerSuccess, filterBannersSuccess, uploadBannerFailed, referenceDataLoadSuccess } from "../actions/banners-api.actions";


const initialState: BannersStore = adapter.getInitialState({
  totalPages: 0,
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
  formServerError: null,
  channels: [],
  zones: [],
  languages: [],
  labels: [],
  drawer: false,
  isLoading: false,
  isLoadingSubmitBanner: false,
  imageId: null,
  resetBannerForm: false,
  uploadBlobLoader: false
})

export const bannersReducer = createReducer(
  initialState,
  on(filterBannersSuccess, (state, action) => {
    const bannersEntities = action.bannersData.entities

    return adapter.setAll(
      bannersEntities,
        {
          ...state,
          totalPages: action.bannersData.total,
          isLoading: false,
          bannersPage: action.page,
          bannersPageSize: action.pageSize,
          bannersSuccessLoad: true
        })
  }),

  on(tableRowClicked, (state) => {
    return {...state, drawer: true}
  }),

  on(changeQueryParams, (state) => {
    return {...state, isLoading: true}
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

  on(fileUploadSuccess, (state, {imageId}) => {
    return {...state, imageId, uploadBlobLoader: false }
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

  on(submitBannerData, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(closeDrawer, (state) => {
    return {...state, resetBannerForm: !state.resetBannerForm, drawer: false, showDeleteButton: false, formServerError: null}
  }),

  on(drawerOpen, (state) => {
    return {...state, drawer: true}
  }),

  on(fileInputChanged, (state) => {
    return {...state, uploadBlobLoader: true}
  })
)

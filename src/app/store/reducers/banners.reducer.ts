import {createReducer, on} from "@ngrx/store";
import {adapter, BannersStore} from "../state/banners.state";
import {BannersListPageActions, BannersApiActions} from "../actions"

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
  on(BannersApiActions.filterBannersSuccess, (state, action) => {
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

  on(BannersListPageActions.tableRowClicked, (state) => {
    return {...state, drawer: true, isLoadingSubmitBanner: true}
  }),

  on(BannersListPageActions.changeQueryParams, (state) => {
    return {...state, isLoading: true}
  }),

  on(BannersListPageActions.deleteButtonClicked, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(BannersApiActions.deleteBannerSuccess, (state, action) => {
    return adapter.removeOne(action.bannerId.toString(), {...state, drawer: action.drawerState, isLoadingSubmitBanner: action.submitBannerLoading})
  }),

  on(BannersApiActions.uploadBannerSuccess, (state, {newBanner, bannerId}) => {
    if (bannerId) {
      return adapter.setOne(newBanner, {...state, drawer: false, isLoadingSubmitBanner: false})
    } else {
      return adapter.addOne(newBanner, {...state, totalPages: state.totalPages + 1, drawer: false, isLoadingSubmitBanner: false})
    }
  }),

  on(BannersApiActions.submitBannerFailed, (state, action) => {
    return {...state, apiError: action.error, isLoading: false}
  }),

  on(BannersApiActions.submitBannerSuccess, (state, {bannerData}) =>  {
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

  on(BannersApiActions.fileUploadSuccess, (state, {imageId}) => {
    return {...state, imageId, uploadBlobLoader: false }
  }),

  on(BannersApiActions.uploadBannerFailed, (state, {error}) => {
    return {...state, formServerError: error}
  }),

  on(BannersApiActions.referenceDataLoadSuccess, (state, {channels, labels, zones, languages}) => {
    return {...state, channels, labels, zones, languages, isLoadingSubmitBanner: false}
  }),

  on(BannersListPageActions.submitBannerData, (state) => {
    return {...state, isLoadingSubmitBanner: true}
  }),

  on(BannersListPageActions.closeDrawer, (state) => {
    return {...state, resetBannerForm: !state.resetBannerForm, drawer: false, showDeleteButton: false, formServerError: null}
  }),

  on(BannersListPageActions.drawerOpen, (state) => {
    return {...state, drawer: true}
  }),

  on(BannersListPageActions.fileInputChanged, (state) => {
    return {...state, uploadBlobLoader: true}
  })
)

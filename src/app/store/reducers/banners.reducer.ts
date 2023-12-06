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
  isFormLoading: false,
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
    return {...state, drawer: true, isFormLoading: true}
  }),

  on(BannersListPageActions.changeQueryParams, (state) => {
    return {...state, isLoading: true}
  }),

  on(BannersListPageActions.deleteButtonClicked, (state) => {
    return {...state, isFormLoading: true}
  }),

  on(BannersApiActions.deleteBannerSuccess, (state, action) => {
    return adapter.removeOne(action.bannerId.toString(), {...state, drawer: false, isFormLoading: false})
  }),

  on(BannersApiActions.uploadBannerSuccess, (state, {newBanner}) => {
    return adapter.setOne(newBanner, {...state, drawer: false, isFormLoading: false, resetBannerForm: !state.resetBannerForm})
  }),

  on(BannersApiActions.submitBannerFailed, (state, action) => {
    return {...state, apiError: action.error, isLoading: false}
  }),

  on(BannersApiActions.findBannerSuccess, (state, {bannerData}) =>  {
    return {...state, bannerFormData: bannerData, drawer: true, showDeleteButton: true}
  }),

  on(BannersApiActions.fileUploadSuccess, (state, {imageId}) => {
    return {...state, imageId, uploadBlobLoader: false }
  }),

  on(BannersApiActions.uploadBannerFailed, (state, {error}) => {
    return {...state, formServerError: error}
  }),

  on(BannersApiActions.referenceDataLoadSuccess, (state, {channels, labels, zones, languages}) => {
    return {...state, channels, labels, zones, languages, isFormLoading: false}
  }),

  on(BannersListPageActions.submitBannerData, (state) => {
    return {...state, isFormLoading: true}
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

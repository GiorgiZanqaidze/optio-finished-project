import {createReducer, on} from "@ngrx/store";
import {
  addOrEditBanner,
  deleteBannerSuccess,
  drawerToggle,
  errorResponse,
  selectFile,
  setBannerData,
  setBannerId,
  setBannersData,
  setBannersSearchAndSortForm,
  setDeleteButton,
  setEditFileId,
  setFormData,
  setReferenceData,
  startLoading,
  startSubmitBannerLoading,
  stopLoading,
  stopSubmitBannerLoading,
  submitServerError
} from "./banners.actions";
import {fileReader} from "../../shared/utilities/file-utils";
import {adapter, BannersStore} from "./state/banners.state";


const initialState: BannersStore = adapter.getInitialState({
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
        searchAndSortBannerForm: searchAndSortBannerForm
        })
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

  on(setBannerData, (state, {bannerData, editFileId}) =>  {
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
    return {...state, bannerFormData, drawer: true, editFileId: editFileId, showDeleteButton: true}
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
    return {...state, channels, labels, zones, languages}
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

import {createAction, props} from "@ngrx/store";
import {Banner} from "../../shared/types/banner";
import { ReferenceData } from "src/app/shared/types/reference-data";

export const bannersPageChange = createAction(
  '[Banners] Change Pagination',
  props<{page: number, pageSize: number}>()
)

export const setBannersData = createAction(
  "[Banners] SetData",
  props<{
      bannersData: {total: number, entities: Banner[], searchAfter: string[]},
      page: number,
      pageSize: number,
      search: string,
      sortBy: string,
      sortDirection: string
    }>()
)

export const setBannersSearchAndSortForm = createAction(
"[Banners] Search And Sort",
  props<{search: string, sortBy: string, sortDirection: string}>()
)

export const deleteBanner = createAction(
  '[Banners] Delete Banner',
  props<{ bannerId: number | string}>()
);

export const addOrEditBanner = createAction(
  "[Banner] Add Or Edit",
  props<{newBanner: Banner, editFlag: boolean}>()
)

export const errorResponse = createAction(
  "[Banner] Get Error Response",
  props<{error: string}>()
)

export const getBannerById = createAction(
  "[Banner] Get Banner By Id",
  props<{editFlag: boolean, bannerId: number}>()
)

export const setBannerData = createAction(
  "[Banner] Set Banner By Id",
  props<{bannerData: Banner, editFileId: number | string}>()
)

// form actions ==============================================================================
export const setFormData = createAction(
  "[Form] Set Data",
  props<{formData: any | undefined}>()
)

export const selectFile = createAction(
  "[Form] Select Image File",
  props<{file: File}>()
)

export const setDeleteButton = createAction(
  "[Form] Set Delete Button",
  props<{show: boolean}>()
)

export const setEditFileId = createAction(
  "[Form] Set Edit File Id",
  props<{id: null | string | number}>()
)

export const setBannerId = createAction(
  "[Form] Set Banner Id",
  props<{id: number | string}>()
)

export const submitFormData = createAction(
  "[Form] Submit Data",
  props<{data: any, blob: any}>()
)

export const submitBannerData = createAction(
  "[Form] Set Form Data Response",
  props<{bannerData: any, editFlag: boolean}>()
)

export const submitServerError = createAction(
  "[Form] Set Server Error",
  props<{error: string}>()
)

export const openEditForm = createAction(
  "[Form] Open Edit Form",
)

export const referenceDataApiError = createAction(
  "[Form] Reference Data Api Error",
)

export const setReferenceData = createAction(
  "[Form] Set Banners Data",
  props<{channels: ReferenceData[], labels: ReferenceData[], zones: ReferenceData[], languages: ReferenceData[]}>()
)


// UI actions ==============================================================================

export const drawerToggle = createAction(
  '[Drawer component] open',
  props<{drawerState: boolean}>()
)

export const startLoading = createAction('[Loading] Start Loading');
export const stopLoading = createAction('[Loading] Stop Loading');

export const startSubmitBannerLoading = createAction('[Loading] Start Submit Banner Loading');
export const stopSubmitBannerLoading = createAction('[Loading] Stop Submit Banner Loading');

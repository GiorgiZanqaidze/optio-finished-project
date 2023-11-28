import {Banner} from "../../../shared/types/banner";
import {ReferenceData} from "../../../shared/types/reference-data";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";

export interface BannersStore extends EntityState<Banner>{
  bannersPage: number,
  bannersPageSize: number
  bannersData: Banner[],
  totalPages: number
  searchAndSortBannerForm: {search: string, sortDirection: string, sortBy: string},
  showBannerEditForm: {editFlag: boolean, bannerId: number},
  apiError: string | null,
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
  drawer: boolean,
  isLoading: boolean,
  isLoadingSubmitBanner: boolean,
  imageId: number | string | null,
  resetBannerForm: boolean
}

export const adapter: EntityAdapter<Banner> = createEntityAdapter<Banner>();

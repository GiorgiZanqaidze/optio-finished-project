import { ReferenceData } from "src/app/shared/types/reference-data";
import { Banner } from "src/app/shared/types/banner";
import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";

export interface BannersStore extends EntityState<Banner>{
  totalPages: number
  apiError: string | null,
  bannerFormData: Banner,
  showDeleteButton: boolean,
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

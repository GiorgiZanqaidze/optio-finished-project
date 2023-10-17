import {createAction, props} from "@ngrx/store";

export const bannersPageChange = createAction(
  '[Banners] changePageSize',
  props<{page: number}>()
)

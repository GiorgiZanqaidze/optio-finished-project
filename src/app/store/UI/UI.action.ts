import {createAction, props} from "@ngrx/store";


export const drawerToggle = createAction(
  '[Drawer component] open',
  props<{drawerState: boolean}>()
)

export const startLoading = createAction('[Loading] Start Loading');
export const stopLoading = createAction('[Loading] Stop Loading');

export const startSubmitBannerLoading = createAction('[Loading] Start Submit Banner Loading');
export const stopSubmitBannerLoading = createAction('[Loading] Stop Submit Banner Loading');

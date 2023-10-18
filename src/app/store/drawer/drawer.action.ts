import {createAction, props} from "@ngrx/store";


export const drawerOpen = createAction(
  '[Drawer component] open',
  props<{drawerState: boolean}>()
)

export const drawerClose = createAction(
  '[Drawer component] close',
  props<{drawerState: boolean}>()
)

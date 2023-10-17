import {createReducer, on} from "@ngrx/store";
import * as DrawerActions from './drawer.action'


export const initialState = false

export const drawerReducer = createReducer(
  initialState,
  on(DrawerActions.drawerOpen, (state, {drawerState}) => {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawerState))
    return drawerState
  }),
  on(DrawerActions.drawerClose, (state, {drawerState}) => {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawerState))
    return drawerState
  }),
)

import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../services/api/api.service";
import {bannersPageChange, deleteBannerError, setBannersData, setBannersSearchAndSortForm} from "./banners.actions";
import {BannersStore} from "./banners.reducer";
import {Store} from "@ngrx/store";

import * as BannerActions from './banners.actions';
import {drawerClose} from "../drawer/drawer.action";
@Injectable()
export class BannersEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private bannersStore: Store<{banners: BannersStore}>,
    private drawerStore: Store<{drawer: boolean}>
  ) {}

  BannersrouterNavigatedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      exhaustMap((action: any) => {

        const {search, pageSize, page, sortBy, sortDirection} = action.payload.routerState.root.queryParams;

        this.bannersStore.dispatch(bannersPageChange({ page: +page || 0, pageSize: +pageSize || 3 }));

        this.bannersStore.dispatch(setBannersSearchAndSortForm({search: search || "", sortBy: sortBy || "", sortDirection: sortDirection || ""}))

        return this.apiService.fetchBanners(search || "", page || 0, pageSize || 3, sortBy, sortDirection).pipe(
          map((bannersData: any) => {
            return setBannersData({bannersData: bannersData.data})
          }),
          catchError((error) => {
            console.error('Error in BannersrouterNavigatedEffect', error);
            return EMPTY;
          })
        );
      })
    )
  );

  deleteBanner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.deleteBanner),
      exhaustMap((action) =>
        this.apiService.deleteBanner(action.bannerId).pipe(
          map(() => {
            this.drawerStore.dispatch(drawerClose({drawerState: false}))
            return BannerActions.deleteBanner({bannerId: action.bannerId})
          }),
          catchError((error) => of(BannerActions.deleteBannerError({ error }))) // Create an error action
        )
      )
    )
  );
}


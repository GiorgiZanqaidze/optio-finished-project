import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import { map, exhaustMap, catchError, finalize } from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../services/api/api.service";
import {bannersPageChange, setBannersData, setBannersSearchAndSortForm} from "./banners.actions";
import {BannersStore} from "./banners.reducer";
import {Store} from "@ngrx/store";

import * as BannerActions from './banners.actions';


import {
  drawerToggle,
  startLoading,
  startSubmitBannerLoading,
  stopLoading,
  stopSubmitBannerLoading
} from "../UI/UI.action";
import { Banner } from 'src/app/shared/types/banner';
@Injectable()
export class BannersEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private bannersStore: Store<{banners: BannersStore}>,
    private UIStore: Store<{drawer: boolean}>
  ) {}

  BannersRouterNavigatedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      exhaustMap((action: any) => {

        const {search, pageSize, page, sortBy, sortDirection} = action.payload.routerState.root.queryParams;
        this.UIStore.dispatch(startLoading());

        this.bannersStore.dispatch(bannersPageChange({ page: +page || 0, pageSize: +pageSize || 3 }));

        this.bannersStore.dispatch(setBannersSearchAndSortForm({search: search || "", sortBy: sortBy || "", sortDirection: sortDirection || ""}))

        return this.apiService.fetchBanners(search || "", page || 0, pageSize || 3, sortBy, sortDirection).pipe(
          map((bannersData: any) => {
            this.bannersStore.dispatch(stopLoading());
            return setBannersData({bannersData: bannersData.data})
          }),
          catchError((error) => {
            console.log(error.error.message);
            return of(BannerActions.errorResponse({error: error.error.message}));
          })
        );
      })
    )
  );


  deleteBanner$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannerActions.deleteBanner),
      exhaustMap((action) => {
        this.UIStore.dispatch(startSubmitBannerLoading());
        return this.apiService.deleteBanner(action.bannerId).pipe(
          map(() => {
            this.UIStore.dispatch(drawerToggle({drawerState: false}))
            this.UIStore.dispatch(stopSubmitBannerLoading());
            return BannerActions.deleteBanner({bannerId: action.bannerId})
          }),
          catchError((error) => {
            console.error('Error in DeleteBanner', error.error.error);
            return of(BannerActions.errorResponse({error: error.error.error}));
          })
        )
        }
      )
    )
  );

  getBannerById$ = createEffect(() =>
  this.actions$
    .pipe(
    ofType(BannerActions.getBannerById),
    exhaustMap((action) => {

      return this.apiService.fetchBannerById(action.bannerId).pipe(
        map((bannerData: any) => {
          // console.log(bannerData.data);

          return BannerActions.setBannerData({bannerData: bannerData.data});
        }),
        catchError((error) => {
          console.error('Error in DeleteBanner', error.error.error);
          return of(BannerActions.errorResponse({error: error.error.error}));
        })
      )
      }
    )
  )
);



}


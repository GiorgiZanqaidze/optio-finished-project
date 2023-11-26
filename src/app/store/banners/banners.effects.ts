import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../services/api/api.service";
import { setBannersData} from "./banners.actions";
import {BannersStore} from "./banners.reducer";
import {Store} from "@ngrx/store";

import * as BannerActions from './banners.actions';


import {
  drawerToggle, startLoading,
  startSubmitBannerLoading,
  stopSubmitBannerLoading
} from "../UI/UI.action";
import * as FormActions from "../form/form.actions";
@Injectable()
export class BannersEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private UIStore: Store<{drawer: boolean}>,
    private bannerStore: Store<{banner: BannersStore}>
  ) {}



  BannersRouterNavigatedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      exhaustMap((action: any) => {

        this.bannerStore.dispatch(startLoading())

        const {search, pageSize, page, sortBy, sortDirection} = action.payload.routerState.root.queryParams;

        const payloadAPI = {
          search: search || "",
          pageIndex: page || 0,
          pageSize: pageSize || 3,
          sortBy: sortBy || "",
          sortDirection: sortDirection || ""
        }

        return this.apiService.fetchBanners(payloadAPI).pipe(
          map((bannersData: any) => {
            const actionPayload = {
              bannersData: bannersData.data,
              page: page || 0,
              pageSize: +pageSize || 3,
              search: search || "",
              sortBy: sortBy || "",
              sortDirection: sortDirection || ""
            }
            console.log(bannersData)
            return setBannersData(actionPayload)
          }),
          catchError((error) => {
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
            return of(BannerActions.errorResponse({error: error.error.error}));
          })
        )
        }
      )
    )
  );

  onOpenEditForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.openEditForm),
      mergeMap(() => {
        const channelsApi = this.apiService.getChannels()
        const zonesApi = this.apiService.getZones()
        const labelsApi = this.apiService.getLabels()
        const languagesApi = this.apiService.getLanguages()

        return forkJoin([channelsApi, labelsApi, zonesApi, languagesApi]).pipe(
          map(([channels, labels, zones, languages]) => {
            return BannerActions.setReferenceData({channels, labels, zones, languages})
          }),
          catchError((error) => {
            return of(BannerActions.referenceDataApiError());
          })
        );
      })
    )
  );

  getBannerById$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannerActions.getBannerById),
      exhaustMap((action) => {

        return this.apiService.fetchBannerById(action.bannerId).pipe(
          map((bannerData: any) => {
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


  submitFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.submitFormData),
      exhaustMap(({data, blob}) => {
        const bannerId = JSON.parse(localStorage.getItem('bannerId') as string)
        const editFlag = JSON.parse(localStorage.getItem('editFlag') as string)
        return this.apiService.submitBlob(blob).pipe(
          map((blobResponse: any) => {
            const mergedSubmitData = {
              ...data,
              fileId: blobResponse.data.id,
              id: bannerId
            };
            return BannerActions.submitBannerData({bannerData: mergedSubmitData, editFlag})
          }),
          catchError((error) => {
            return of(BannerActions.submitServerError({error: "error"}));
          })
        )
      })
    )
  );

  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.submitBannerData),
      exhaustMap(({bannerData, editFlag}) =>
        this.apiService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            this.UIStore.dispatch(drawerToggle({drawerState: false}))
            this.UIStore.dispatch(stopSubmitBannerLoading())
            return BannerActions.addOrEditBanner({newBanner: newBannerData.data, editFlag})
          }),
          catchError((error) => {
            console.error('Error in DeleteBanner', error);
            return of(BannerActions.submitServerError({error: "error"}));
          })
        )
      )
    )
  );


}


import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../services/api/api.service";
import { setBannersData} from "./banners.actions";
import {Store} from "@ngrx/store";
import {BannersStore} from "./state/banners.state";

import * as BannerActions from './banners.actions';



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

        this.bannerStore.dispatch(BannerActions.startLoading())

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
        return this.apiService.deleteBanner(action.bannerId).pipe(
          map(() => {

            return BannerActions.deleteBannerSuccess({bannerId: action.bannerId, drawerState: false, submitBannerLoading: false})
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
        localStorage.setItem("editFlag", JSON.stringify(true))
        localStorage.setItem("bannerId", JSON.stringify(action.bannerId))

        return this.apiService.fetchBannerById(action.bannerId).pipe(
          map((bannerData: any) => {
            sessionStorage.setItem('editFileId', bannerData.data.fileId)
            return BannerActions.setBannerData({bannerData: bannerData.data, editFileId: bannerData.data.fileId});
          }),
          catchError((error) => {
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
            return BannerActions.addOrEditBanner({newBanner: newBannerData.data, editFlag, drawerState: false, submitBannerLoading: false})
          }),
          catchError((error) => {
            return of(BannerActions.submitServerError({error: "error"}));
          })
        )
      )
    )
  );


}


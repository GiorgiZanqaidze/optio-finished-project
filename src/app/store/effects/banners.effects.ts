import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../services/api/api.service";
import {Store} from "@ngrx/store";
import {BannersStore} from "../state/banners.state";
import * as BannerActions from '../actions/banners.actions';
import * as ApiActions from "../actions/api.actions"
@Injectable()
export class BannersEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
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
            return ApiActions.setBannersData(actionPayload)
          }),
          catchError((error) => {
            return of(ApiActions.errorResponse({error: error.error.message}));
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
            return ApiActions.deleteBannerSuccess({bannerId: action.bannerId, drawerState: false, submitBannerLoading: false})
          }),
          catchError((error) => {
            return of(ApiActions.errorResponse({error: error.error.error}));
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
            return ApiActions.setReferenceData({channels, labels, zones, languages})
          }),
          catchError(() => {
            return of(ApiActions.referenceDataApiError());
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
            return ApiActions.setBannerData({bannerData: bannerData.data});
          }),
          catchError((error) => {
            return of(ApiActions.errorResponse({error: error.error.error}));
          })
        )
        }
      )
    )
  );


  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.submitBannerData),
      exhaustMap(({bannerData, editFlag}) =>
        this.apiService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            return ApiActions.addOrEditBanner({newBanner: newBannerData.data, editFlag, drawerState: false, submitBannerLoading: false})
          }),
          catchError(() => {
            return of(ApiActions.submitServerError({error: "error"}));
          })
        )
      )
    )
  );

  uploadBlob = createEffect(() =>
      this.actions$.pipe(
          ofType(BannerActions.selectFile),
          exhaustMap(({file}) =>
              this.apiService.submitBlob(file).pipe(
                  map((image: any) => {
                      return ApiActions.selectFileSuccess({imageId: image.data.id})
                  }),
                  catchError(() => {
                      return of(ApiActions.submitServerError({error: "error"}));
                  })
              )
          )
      )
  );


}


import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";
import {ApiService} from "../../../services/api/api.service";
import { setBannersData} from "../actions/banners.actions";
import {Store} from "@ngrx/store";
import {BannersStore} from "../state/banners.state";
import * as BannerActions from '../actions/banners.actions';

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
          catchError(() => {
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


  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.submitBannerData),
      exhaustMap(({bannerData, editFlag}) =>
        this.apiService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            return BannerActions.addOrEditBanner({newBanner: newBannerData.data, editFlag, drawerState: false, submitBannerLoading: false})
          }),
          catchError((err) => {
            console.log(err);

            return of(BannerActions.submitServerError({error: "error"}));
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
                      return BannerActions.selectFileSuccess({imageId: image.data.id})
                  }),
                  catchError(() => {
                      return of(BannerActions.submitServerError({error: "error"}));
                  })
              )
          )
      )
  );


}


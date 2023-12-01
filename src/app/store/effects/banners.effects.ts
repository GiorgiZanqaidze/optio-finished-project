import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {BannersService} from "../services/banners.service";
import * as BannerActions from '../actions/banners.actions';
import * as ApiActions from "../actions/banners-api.actions"
@Injectable()
export class BannersEffects {
  constructor(
    private actions$: Actions,
    private bannersService: BannersService,
  ) {}

  BannersRouterNavigatedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.changeQueryParams),
      exhaustMap((action: any) => {

        const {search, sortBy, sortDirection, page, pageSize} = action.queryParams
        const payloadAPI = {
          search: search,
          pageIndex: page | 0,
          pageSize:  pageSize | 3,
          sortBy: sortBy,
          sortDirection: sortDirection
        }

        return this.bannersService.fetchBanners(payloadAPI).pipe(
          map((bannersData: any) => {
            const actionPayload = {
              bannersData: bannersData.data,
              page: page,
              pageSize: pageSize,
              search: search,
              sortBy: sortBy,
              sortDirection: sortDirection
            }
            return ApiActions.filterBannersSuccess(actionPayload)
          }),
          catchError(() => {
            return of(ApiActions.filterBannersFailed());
          })
        );
      })
    )
  );


  deleteBanner$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannerActions.deleteButtonClicked),
      exhaustMap((action) => {
        return this.bannersService.deleteBanner(action.bannerId).pipe(
          map(() => {
            return ApiActions.deleteBannerSuccess({bannerId: action.bannerId, drawerState: false, submitBannerLoading: false})
          }),
          catchError(() => {
            return of(ApiActions.deleteBannerFailed());
          })
        )
        }
      )
    )
  );

  onOpenEditForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.tableRowClicked),
      mergeMap(() => {
        const channelsApi = this.bannersService.getChannels()
        const zonesApi = this.bannersService.getZones()
        const labelsApi = this.bannersService.getLabels()
        const languagesApi = this.bannersService.getLanguages()

        return forkJoin([channelsApi, labelsApi, zonesApi, languagesApi]).pipe(
          map(([channels, labels, zones, languages]) => {
            return ApiActions.referenceDataLoadSuccess({channels, labels, zones, languages})
          }),
          catchError(() => {
            return of(ApiActions.referenceDataLoadFailed());
          })
        );
      })
    )
  );

  getBannerById$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannerActions.tableRowClicked),
      exhaustMap((action) => {

        return this.bannersService.fetchBannerById(action.bannerId).pipe(
          map((bannerData: any) => {
            return ApiActions.submitBannerSuccess({bannerData: bannerData.data});
          }),
          catchError((error) => {
            return of(ApiActions.submitBannerFailed({error: error.error.error}));
          })
        )
        }
      )
    )
  );


  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.submitBannerData),
      exhaustMap(({bannerData, bannerId}) =>
        this.bannersService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            return ApiActions.uploadBannerSuccess({newBanner: newBannerData.data, bannerId, drawerState: false, submitBannerLoading: false})
          }),
          catchError(() => {
            return of(ApiActions.uploadBannerFailed({error: "error"}));
          })
        )
      )
    )
  );

  uploadBlob = createEffect(() =>
      this.actions$.pipe(
          ofType(BannerActions.fileInputChanged),
          exhaustMap(({file}) =>
              this.bannersService.submitBlob(file).pipe(
                  map((image: any) => {
                      return ApiActions.fileUploadSuccess({imageId: image.data.id})
                  }),
                  catchError(() => {
                      return of(ApiActions.fileUploadFailed());
                  })
              )
          )
      )
  );


}


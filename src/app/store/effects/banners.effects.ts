import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {map, exhaustMap, catchError, mergeMap} from 'rxjs/operators';
import {BannersService} from "../services/banners.service";
import {BannersListPageActions, BannersApiActions} from "../actions"
@Injectable()
export class BannersEffects {
  constructor(
    private actions$: Actions,
    private bannersService: BannersService,
  ) {}

  queryParamsChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannersListPageActions.changeQueryParams),
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
            return BannersApiActions.filterBannersSuccess(actionPayload)
          }),
          catchError(() => {
            return of(BannersApiActions.filterBannersFailed());
          })
        );
      })
    )
  );

  bannerDeleted$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannersListPageActions.deleteButtonClicked),
      exhaustMap((action) => {
        return this.bannersService.deleteBanner(action.bannerId).pipe(
          map(() => {
            return BannersApiActions.deleteBannerSuccess({bannerId: action.bannerId})
          }),
          catchError(() => {
            return of(BannersApiActions.deleteBannerFailed());
          })
        )
        }
      )
    )
  );

  editFormOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannersListPageActions.drawerOpen),
      mergeMap(() => {
        const channelsApi = this.bannersService.getChannels()
        const zonesApi = this.bannersService.getZones()
        const labelsApi = this.bannersService.getLabels()
        const languagesApi = this.bannersService.getLanguages()

        return forkJoin([channelsApi, labelsApi, zonesApi, languagesApi]).pipe(
          map(([channels, labels, zones, languages]) => {
            return BannersApiActions.referenceDataLoadSuccess({channels, labels, zones, languages})
          }),
          catchError(() => {
            return of(BannersApiActions.referenceDataLoadFailed());
          })
        );
      })
    )
  );

  tableRowClicked$ = createEffect(() =>
    this.actions$
      .pipe(
      ofType(BannersListPageActions.tableRowClicked),
      exhaustMap((action) => {
        return this.bannersService.fetchBannerById(action.bannerId).pipe(
          map((bannerData: any) => {
            return BannersApiActions.findBannerSuccess({bannerData: bannerData.data});
          }),
          catchError((error) => {
            return of(BannersApiActions.submitBannerFailed({error: error.error.error}));
          })
        )
        }
      )
    )
  );

  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannersListPageActions.submitBannerData),
      exhaustMap(({bannerData, bannerId}) =>
        this.bannersService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            return BannersApiActions.uploadBannerSuccess({newBanner: newBannerData.data, bannerId, drawerState: false, submitBannerLoading: false})
          }),
          catchError(() => {
            return of(BannersApiActions.uploadBannerFailed({error: "error"}));
          })
        )
      )
    )
  );

  uploadBlob = createEffect(() =>
      this.actions$.pipe(
          ofType(BannersListPageActions.fileInputChanged),
          exhaustMap(({file}) =>
              this.bannersService.submitBlob(file).pipe(
                  map((image: any) => {
                      return BannersApiActions.fileUploadSuccess({imageId: image.data.id})
                  }),
                  catchError(() => {
                      return of(BannersApiActions.fileUploadFailed());
                  })
              )
          )
      )
  );


}


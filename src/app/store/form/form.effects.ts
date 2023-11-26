import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, exhaustMap, mergeMap} from "rxjs/operators";
import * as FormActions from './form.actions';
import {map, of} from "rxjs";
import {Injectable} from "@angular/core";
import * as BannerActions from "../banners/banners.actions";
import {drawerToggle, stopSubmitBannerLoading} from "../UI/UI.action";
import {ApiService} from "../../services/api/api.service";
import {Store} from "@ngrx/store";
import {BannersStore} from "../banners/banners.reducer";
import {FormStore} from "./form.reducer";
import {UIStore} from "../UI/UI.reducer";

@Injectable()
export class FormEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private UIStore: Store<{UI: UIStore}>,
    private bannersStore: Store<{banners: BannersStore}>,
    private formStore: Store<{form: FormStore}>
  ) {}


  submitFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.submitFormData),
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
            return FormActions.submitBannerData({bannerData: mergedSubmitData, editFlag})
          }),
          catchError((error) => {
            return of(FormActions.submitServerError({error: "error"}));
          })
        )
      })
    )
  );

  submitBannerData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.submitBannerData),
      exhaustMap(({bannerData, editFlag}) =>
        this.apiService.submitBannerForm(bannerData).pipe(
          map((newBannerData: any) => {
            this.UIStore.dispatch(drawerToggle({drawerState: false}))
            this.UIStore.dispatch(stopSubmitBannerLoading())
            return BannerActions.addOrEditBanner({newBanner: newBannerData.data, editFlag})
          }),
          catchError((error) => {
            console.error('Error in DeleteBanner', error);
            return of(FormActions.submitServerError({error: "error"}));
          })
        )
      )
    )
  );
}

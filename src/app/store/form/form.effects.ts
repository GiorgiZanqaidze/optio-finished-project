import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BannerActions from "../banners/banners.actions";
import {exhaustMap} from "rxjs/operators";
import {ApiService} from "../../services/api/api.service";
import {Store} from "@ngrx/store";
import {BannersStore} from "../banners/banners.reducer";


export class FormEffects {

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private bannersStore: Store<{banners: BannersStore}>,
    private drawerStore: Store<{drawer: boolean}>
  ) {}


  // submitBanner$ = createEffect(() => {
  //   this.actions$.pipe(
  //     ofType(BannerActions.submitBannersData),
  //     exhaustMap((action) => {
  //       this.apiService.
  //     })
  //   )
  // })
}

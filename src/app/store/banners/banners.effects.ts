import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {init} from "./banners.actions";
import {switchMap} from "rxjs";


@Injectable()
export class BannersEffects {
    loadBanners$ = createEffect(() =>
      this.actions$.pipe(
      ofType(init),

    ))


  constructor(
    private actions$: Actions
  ) {
  }
}

import { Injectable } from '@angular/core';
import {act, Actions, createEffect, ofType} from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import {ROUTER_NAVIGATED} from "@ngrx/router-store";


@Injectable()
export class BannersEffects {

  constructor(
    private actions$: Actions,
  ) {}

  BannersrouterNavigatedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => {
        console.log(action.payload.routerState.root.queryParams)

        return { type: '[Banners] changePageSize', page: 1 };
      })
    )
  );
}


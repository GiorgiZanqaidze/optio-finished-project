import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {BannersService} from "../../services/banners.service";
import {switchMap} from "rxjs";


@Injectable()
export class BannersEffects {



  constructor(
    private actions$: Actions,
    private bannersService: BannersService
  ) {
  }


  loadData$ = createEffect(() =>
    this.actions$.pipe(

    )
  )
}

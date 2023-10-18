import {Actions, createEffect, ofType} from "@ngrx/effects";
import { filter, mergeMap} from "rxjs/operators";
import * as FormActions from './form.actions';
import {fromEvent, map} from "rxjs";
import {Injectable} from "@angular/core";
@Injectable()
export class FormEffects {

  constructor(
    private actions$: Actions,
  ) {}


}

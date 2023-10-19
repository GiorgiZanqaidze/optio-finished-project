import { Injectable } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class RouteParamsService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onRouteParamsChange(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }
}

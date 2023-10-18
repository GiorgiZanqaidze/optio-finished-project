import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class BannersService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }
}

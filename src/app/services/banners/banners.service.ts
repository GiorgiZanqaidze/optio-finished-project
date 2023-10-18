import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BannerModel} from "../../shared/types/banner.model";


@Injectable({
  providedIn: 'root'
})
export class BannersService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  banners!: BannerModel[]
  drawerIsOpen!: boolean

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }
}

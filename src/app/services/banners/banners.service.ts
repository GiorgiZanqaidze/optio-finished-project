import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class BannersService {


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  fetchBanners(search: string | null | undefined, pageIndex: number, pageSize: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined) {
    return this.http.post("/banners/find",{search, pageIndex, pageSize, sortBy, sortDirection})
  }

  fetchBannerById(id: number) {
    return this.http.post("/banners/find-one",{id})
  }

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  private getBannerById = new Subject<{editFlag: boolean, bannerId: number}>();

  setItem(data: {editFlag: boolean, bannerId: number}): void {
    this.getBannerById.next(data);
  }

  getStorageObservable(): Observable<{editFlag: boolean, bannerId: number}> {
    return this.getBannerById.asObservable();
  }
}

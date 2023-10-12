import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'
import {ActivatedRoute, Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {MatDrawer} from "@angular/material/sidenav";
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

  drawer!: MatDrawer
  drawerIsOpen = false



  fetchBanners(search: string | null | undefined, pageIndex: number, pageSize: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined) {
    return this.http.post("/banners/find",{search, pageIndex, pageSize, sortBy, sortDirection})
  }

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  private storageSubject = new Subject<string>();

  setItem(data: any): void {
    this.storageSubject.next(data);
  }

  getStorageObservable(): Observable<string> {
    return this.storageSubject.asObservable();
  }
}

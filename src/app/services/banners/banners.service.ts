import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable, Subject} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {PageEvent} from "@angular/material/paginator";


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

  bannersPage!: number
  bannerPageSize!: number
  totalPages!: number
  banners!: BannerModel[]
  drawerIsOpen!: boolean

  setDrawerIsOpen(drawer: boolean) {
    this.drawerIsOpen = drawer
  }

  onPageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.onRouteParamsChange(queryParams)
  }

  onDrawerOpen(drawer: boolean) {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawer))
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  setBanners(banners: BannerModel[]) {
    this.banners = banners
  }
  setTotalPages(totalPages: number) {
    this.totalPages = totalPages
  }
  setBannerPageSize(newPageSize: number) {
    this.bannerPageSize = newPageSize
  }
  setBannerPage(newPage: number) {
    this.bannersPage = newPage
  }

  private fetchBanners(search: string | null | undefined, pageIndex: number, pageSize: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined) {
    return this.http.post("/banners/find",{search, pageIndex, pageSize, sortBy, sortDirection})
  }

  onFetchBanners() {
    this.fetchBanners(
      this.searchBannersForm.value.search,
      this.bannersPage,
      this.bannerPageSize,
      this.searchBannersForm.value.sortBy,
      this.searchBannersForm.value.sortDirection
    )
      .subscribe((data: any) => {
        this.setTotalPages(data.data.total)
        this.setBanners(data.data.entities)
      });
  }

  fetchBannerById(id: number) {
    return this.http.post("/banners/find-one",{id})
  }

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  private getBannerById = new Subject<{editFlag: boolean, bannerId: number}>();

  setItem(data: {editFlag: boolean, bannerId: number}): void {
    this.getBannerById.next(data);
  }

  getBannerIdObservable(): Observable<{editFlag: boolean, bannerId: number}> {
    return this.getBannerById.asObservable();
  }

  onDrawerClose() {
    localStorage.clear();
    sessionStorage.clear()
  }

  onBannersSearch() {
    const queryParams = {
      search: this.searchBannersForm.value.search,
      sortDirection: this.searchBannersForm.value.sortDirection,
      sortBy: this.searchBannersForm.value.sortBy,
    };
    this.onRouteParamsChange(queryParams)
    return this.fetchBanners(
        this.searchBannersForm.value.search,
        this.bannersPage,
        this.bannerPageSize,
        this.searchBannersForm.value.sortBy,
        this.searchBannersForm.value.sortDirection
    ).subscribe((data: any) => {
      this.setTotalPages(data.total)
      this.setBanners(data.banners)
    });

  }
}

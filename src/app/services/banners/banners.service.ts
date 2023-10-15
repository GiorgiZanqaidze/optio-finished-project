import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {PageEvent} from "@angular/material/paginator";
import {FormsService} from "../forms/forms.service";
import {ApiService} from "../api/api.service";
import {MatDrawer} from "@angular/material/sidenav";


@Injectable({
  providedIn: 'root'
})
export class BannersService {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsService,
    private apiService: ApiService
  ) {
  }

  bannersPage!: number
  bannerPageSize = 10
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

  onFetchBanners() {
    this.apiService.fetchBanners(
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


  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  onDrawerClose() {
    this.formService.bannerForm.reset()
    this.formService.imageName = ''
    this.formService.showDeleteButton = false
    localStorage.clear();
    sessionStorage.clear()
  }

  routerChangeFlag = false

  onBannersSearch() {
    const queryParams = {
      search: this.searchBannersForm.value.search,
      sortDirection: this.searchBannersForm.value.sortDirection,
      sortBy: this.searchBannersForm.value.sortBy,
      routerChangeFlag: !this.routerChangeFlag
    };
    this.routerChangeFlag = !this.routerChangeFlag
    this.onRouteParamsChange(queryParams)
    return this.apiService.fetchBanners(
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

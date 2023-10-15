import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {PageEvent} from "@angular/material/paginator";
import {FormsService} from "../forms/forms.service";
import {ApiService} from "../api/api.service";


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

  bannersPage = 0
  bannerPageSize = 3
  totalPages!: number
  banners!: BannerModel[]
  drawerIsOpen!: boolean

  setDrawerIsOpen(drawer: boolean) {
    localStorage.setItem('drawerIsOpen', JSON.stringify(drawer))
    this.drawerIsOpen = drawer
  }

  onPageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.onRouteParamsChange(queryParams)
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
      this.routerChangeFlag = !this.routerChangeFlag
    });
  }

  private filterBanners(id: string | number) {
    this.banners = this.banners.filter(banner => id != banner.id)
  }

  deleteBanner(id: string) {
    this.apiService.deleteBanner(id).subscribe(() => {
      this.filterBanners(id)
      this.drawerIsOpen = false
    })
  }

  addOrEditBanner(newBanner: BannerModel) {
    const editFlag = localStorage.getItem('editFlag')
    if (editFlag && JSON.parse(editFlag)) {
      this.banners = this.banners.map((banner) => {
        if (newBanner.id == banner.id) {
          return newBanner
        } else {
          return banner
        }
      })
    } else {
      const cloneBanners = this.banners.slice()
      cloneBanners.unshift(newBanner)
      this.banners = cloneBanners
    }
  }
}

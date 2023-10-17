import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {BannerModel} from "../../shared/types/banner.model";
import {PageEvent} from "@angular/material/paginator";
import {FormsService} from "../forms/forms.service";
import {ApiService} from "../api/api.service";
import {Store} from "@ngrx/store";
import {drawerClose} from "../../store/drawer/drawer.action";
import {BannersStore} from "../../store/banners/banners.reducer";
import {searchAndSortBannerForm} from "../../store/banners/banners.selector";


@Injectable({
  providedIn: 'root'
})
export class BannersService {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsService,
    private apiService: ApiService,
    private drawerStore: Store<{drawer: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>
  ) {
    this.bannersStore.select(searchAndSortBannerForm).subscribe((formValues) => {
      this.searchBannersForm.patchValue({
        search: formValues.search,
        sortDirection: formValues.sortDirection,
        sortBy: formValues.sortBy,
      });
    });

  }

  banners!: BannerModel[]
  drawerIsOpen!: boolean


  onPageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.onRouteParamsChange(queryParams)
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })


  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  onDrawerClose() {
    this.drawerStore.dispatch(drawerClose({drawerState: false}))
    this.formService.bannerForm.reset()
    this.formService.imageName = ''
    this.formService.showDeleteButton = false
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
  }

  private filterBanners(id: string | number) {
    this.banners = this.banners.filter(banner => id != banner.id)
  }

  deleteBanner(id: string) {
    this.apiService.deleteBanner(id).subscribe(() => {
      this.filterBanners(id)
      this.drawerStore.dispatch(drawerClose({drawerState: false}))
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

import { Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {BannerModel} from "../shared/types/banners/banner.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private bannersService: BannersService,
  ) {}

  banners!: BannerModel[]
  page!: number
  pageSize = 2
  totalPages!: number
  @ViewChild('drawer') drawer!: MatDrawer
  drawerIsOpen!: boolean
  editFlag!: boolean
  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    const editFlag = localStorage.getItem('editFlag')
    if (drawerIsOpen !== null) this.drawerIsOpen = JSON.parse(drawerIsOpen)
    if (editFlag !== null) this.editFlag = JSON.parse(editFlag)

    this.bannersService.getBannerIdObservable().subscribe(res => {
      this.drawer.toggle(true ).catch(err => console.log(err))
    })

    this.route.queryParams
      .subscribe((route: Params) => {
          this.page = +route['page'];
          this.pageSize= +route['pageSize']
          this.searchBannersForm.patchValue({
            'search': route['search'],
            'sortDirection': route['sortDirection'],
            'sortBy': route['sortBy']
          })
          this.bannersService
            .fetchBanners(
              this.searchBannersForm.value.search,
              this.page,
              this.pageSize,
              this.searchBannersForm.value.sortBy,
              this.searchBannersForm.value.sortDirection
            )
            .subscribe((data: any) => {
              this.totalPages = data.data.total;
              this.banners = data.data.entities;
            });
      });
  }

  drawerOpen() {
    localStorage.setItem('drawerIsOpen', JSON.stringify(this.drawer.opened))
  }

  onPageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.bannersService.onRouteParamsChange(queryParams)
  }

  closeDrawer() {
    localStorage.clear();
    sessionStorage.clear()
  }

  searchBanners() {
    const queryParams = {
      search: this.searchBannersForm.value.search,
      sortDirection: this.searchBannersForm.value.sortDirection,
      sortBy: this.searchBannersForm.value.sortBy,
    };
    this.bannersService.onRouteParamsChange(queryParams)
    this.bannersService
        .fetchBanners(
          this.searchBannersForm.value.search,
          this.page,
          this.pageSize,
          this.searchBannersForm.value.sortBy,
          this.searchBannersForm.value.sortDirection
        )
        .subscribe((data: any) => {
          this.totalPages = data.data.total;
          this.banners = data.data.entities;
        });
  }
}

import { Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {BannerModel} from "../types/banners/banner.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";
import {distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bannersService: BannersService,
  ) {
  }

  banners!: BannerModel[]
  page!: number
  totalPages!: number
  searchInput: string = ''
  @ViewChild('drawer') drawer!: MatDrawer
  drawerIsOpen!: boolean

  searchBannersForm = new FormGroup({
    "textInput": new FormControl(''),
  })

  searchBanners() {
    console.log(this.searchBannersForm.value)
  }

  ngOnInit() {
    this.route.queryParams.subscribe((route :Params) => {
      if (route['drawerIsOpen']) {
        this.drawerIsOpen = JSON.parse(route['drawerIsOpen'])
      }
    })
    this.route.queryParams
      .pipe(
        distinctUntilChanged((prev, current) => prev['page'] === current['page'])
      )
      .subscribe((route: Params) => {
        this.page = +route['page'];
        this.bannersService
          .fetchBanners(this.searchInput, this.page)
          .subscribe((data: any) => {
            console.log(data)
            this.totalPages = data.data.total;
            this.banners = data.data.entities;
          });

      });

  }

  drawerChange() {
    const queryParams = { drawerIsOpen: this.drawer.opened };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }


  onPageChange(event: PageEvent) {
    const queryParams = { page: event.pageIndex };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }
}

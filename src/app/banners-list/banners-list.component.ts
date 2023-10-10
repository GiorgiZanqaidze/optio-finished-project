import {AfterContentInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {PageEvent} from "@angular/material/paginator";
import {BannerModel} from "../types/banners/banner.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersService} from "../services/banners.service";
import {Observable} from "rxjs";
import { Store} from "@ngrx/store";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css']
})
export class BannersListComponent implements OnInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bannersService: BannersService,
    private http: HttpClient,
    private store: Store<{banner:any}>
  ) {
  }

  banners!: BannerModel[]
  page!: number
  totalPages!: number
  searchInput: string = ''

  searchBannersForm = new FormGroup({
    "textInput": new FormControl(''),
  })

  searchBanners() {
    console.log(this.searchBannersForm.value)
  }

  ngOnInit() {
    this.route.queryParams.subscribe((route :Params) => {
      this.page = +route['page']
      this.bannersService.fetchBanners(this.searchInput, this.page)
        .subscribe((data: any) => {
          this.totalPages = data.data.total
          this.banners = data.data.entities
        })
    })
  }




  onPageChange(event: PageEvent) {
    const queryParams = { page: event.pageIndex };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}

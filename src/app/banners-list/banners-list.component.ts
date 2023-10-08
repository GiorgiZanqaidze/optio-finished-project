import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {PageEvent} from "@angular/material/paginator";
import {BannerModel} from "../types/banners/banner.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersService} from "../services/banners.service";

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
    private http: HttpClient
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
      // this.http.post('https://development.api.optio.ai/api/v2/banners/find',
      //   {
      //     search:this.searchInput,
      //     "pageSize": 10,
      //     "pageIndex": this.page,
      //   },
      //   {
      //     headers: {
      //       accept: "application/json",
      //       Authorization: "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoiZ2lvcmdpemFucWFpZHplb2ZmaWNpYWxAZ21haWwuY29tIiwiaWF0IjoxNjk2NTY4OTI3LCJleHAiOjE2OTc0MzI5Mjd9.eXt_P4gBxAH6QwUDRpmKixVLn0BgLAq09Kj3F8W8oMJQqid8Sjxi-xVR1PNnrfRCViWuvVHX8D4B6FLzX15X9Q"
      //     },
      //   }).subscribe((banners : any) => {
      //   console.log(banners.data)
      //   this.totalPages = banners.data.total
      //   this.banners = banners.data.entities
      // })
      this.bannersService.fetchBanners(this.searchInput, this.page)
        .subscribe((data) => {
          this.totalPages = data.totalPages
          this.banners = data.banners
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

import {Component, Input, OnInit} from '@angular/core';
import {BannerModel} from "../../shared/types/banner.model";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";
import {FormsService} from "../../services/forms/forms.service";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Params} from "@angular/router";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent implements OnInit{

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', "Status", "Zone", "StartDate", "EndDate", "Labels", 'Image']

  public readonly apiUrl = environment.ApiUrl

  drawer$!: Observable<boolean>

  constructor(
    private formService: FormsService,
    public bannersService: BannersService,
    private route: ActivatedRoute,
    private store: Store<{drawer: boolean}>
  ) {
    this.drawer$ = store.select('drawer')
  }
  pageChange(event: PageEvent) { this.bannersService.onPageChange(event) }

  showEditBannerForm(rowData: BannerModel) {
    localStorage.setItem("editFlag", JSON.stringify(true))
    localStorage.setItem("bannerId", JSON.stringify(rowData.id))
    this.formService.setItem({editFlag: true, bannerId: rowData.id})
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe((route: Params) => {
        this.bannersService.setBannerPage(+route['page'])
        this.bannersService.setBannerPageSize(+route['pageSize'])

        this.bannersService.searchBannersForm.patchValue({
          'search': route['search'],
          'sortDirection': route['sortDirection'],
          'sortBy': route['sortBy']
        })
        this.bannersService.onFetchBanners()
      });
  }
}

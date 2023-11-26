import {Component, Input, OnInit} from '@angular/core';
import {Banner} from "../../shared/types/banner";
import {environment} from "../../../environments/environment";
import {RouteParamsService} from "../../services/banners/route-params.service";
import {FormsService} from "../../services/banners/forms.service";
import {PageEvent} from "@angular/material/paginator";
import {Store} from "@ngrx/store";
import {BannersStore} from "../../store/banners/banners.reducer";
import {
  apiError,
  bannersData,
  bannersPage,
  bannersPageSize, isLoadingUI,
  totalPages
} from "../../store/banners/banners.selector";
import {displayedColumns} from "../../constants/display-columns";
import { getBannerById } from 'src/app/store/banners/banners.actions';

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
})
export class BannerTableComponent implements OnInit{

  @Input() dataSource!: Banner[]

  public readonly displayedColumns = displayedColumns

  public readonly apiUrl = environment.ApiUrl

  bannersData$ = this.bannersStore.select(bannersData)
  totalPages$ = this.bannersStore.select(totalPages)
  bannersPage$ = this.bannersStore.select(bannersPage)
  bannersPageSize$ = this.bannersStore.select(bannersPageSize)
  isLoading$ = this.bannersStore.select(isLoadingUI)
  apiError$ = this.bannersStore.select(apiError)

  constructor(
    private formService: FormsService,
    public bannersService: RouteParamsService,
    private UIStore: Store<{drawer: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>
  ) {}


  pageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.bannersService.onRouteParamsChange(queryParams)
  }

  showEditBannerForm(rowData: Banner) {
    localStorage.setItem("editFlag", JSON.stringify(true))
    localStorage.setItem("bannerId", JSON.stringify(rowData.id))
    this.formService.setItem({editFlag: true, bannerId: rowData.id})

    this.bannersStore.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }


  ngOnInit(): void {
    const bannerId = localStorage.getItem("bannerId") as string
    const editFlag = localStorage.getItem("bannerId") as string

    const number = parseInt(bannerId)

    if (editFlag && number) {
      console.log(number);
      this.bannersStore.dispatch(getBannerById({editFlag: true, bannerId: number}))
    }

  }


}


import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Banner} from "../../shared/types/banner";
import {environment} from "../../../environments/environment";
import {PageEvent} from "@angular/material/paginator";
import {Store} from "@ngrx/store";
import {BannersStore} from "../store/banners.reducer";
import {
  apiError,
  bannersData,
  bannersPage,
  bannersPageSize, isLoadingUI,
  totalPages
} from "../store/banners.selector";
import {displayedColumns} from "../../constants/display-columns";
import {getBannerById, openEditForm} from 'src/app/banners/store/banners.actions';

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
})
export class BannerTableComponent{

  @Input() dataSource!: Banner[]

  @Output() routeParamsChange = new EventEmitter()

  @Input() bannersData$!: Banner[] | null

  onRouteParamsChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.routeParamsChange.emit(queryParams)
  }


  public readonly displayedColumns = displayedColumns

  public readonly apiUrl = environment.ApiUrl

  totalPages$ = this.bannersStore.select(totalPages)
  bannersPage$ = this.bannersStore.select(bannersPage)
  bannersPageSize$ = this.bannersStore.select(bannersPageSize)
  isLoading$ = this.bannersStore.select(isLoadingUI)
  apiError$ = this.bannersStore.select(apiError)

  constructor(
    private bannersStore: Store<{banners: BannersStore}>
  ) {}

  showEditBannerForm(rowData: Banner) {
    this.bannersStore.dispatch(openEditForm())
    this.bannersStore.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }
}


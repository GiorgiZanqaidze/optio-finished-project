import {Component, Input} from '@angular/core';
import {Banner} from "../../shared/types/banner";
import {environment} from "../../../environments/environment";
import {RouteParamsService} from "../../services/banners/route-params.service";
import {FormsService} from "../../services/banners/forms.service";
import {PageEvent} from "@angular/material/paginator";
import {Store} from "@ngrx/store";
import {BannersStore} from "../../store/banners/banners.reducer";
import {
  bannersData,
  bannersPage,
  bannersPageSize,
  totalPages
} from "../../store/banners/banners.selector";
import {displayedColumns} from "../../constants/display-columns";
import {drawerUI, isLoadingUI} from "../../store/UI/UI.selectors";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
})
export class BannerTableComponent{

  @Input() dataSource!: Banner[]

  public readonly displayedColumns = displayedColumns

  public readonly apiUrl = environment.ApiUrl

  drawer$ = this.UIStore.select(drawerUI)
  bannersData$!: Banner[]
  totalPages$ = this.bannersStore.select(totalPages)
  bannersPage$ = this.bannersStore.select(bannersPage)
  bannersPageSize$ = this.bannersStore.select(bannersPageSize)
  isLoading$ = this.UIStore.select(isLoadingUI)

  constructor(
    private formService: FormsService,
    public bannersService: RouteParamsService,
    private UIStore: Store<{drawer: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>
  ) {
    bannersStore.select(bannersData).subscribe(data => this.bannersData$ = data)
  }
  pageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.bannersService.onRouteParamsChange(queryParams)
  }

  showEditBannerForm(rowData: Banner) {
    localStorage.setItem("editFlag", JSON.stringify(true))
    localStorage.setItem("bannerId", JSON.stringify(rowData.id))
    this.formService.setItem({editFlag: true, bannerId: rowData.id})
  }
}

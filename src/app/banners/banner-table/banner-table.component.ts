import {Component, Input, OnInit} from '@angular/core';
import {Banner} from "../../shared/types/banner";
import {environment} from "../../../environments/environment";
import {RouteParamsService} from "../../services/banners/route-params.service";
import {FormsService} from "../../services/banners/forms.service";
import {PageEvent} from "@angular/material/paginator";
import {Store} from "@ngrx/store";
import {BannersStore} from "../../store/banners/banners.reducer";
import {
  apiError, bannerFormData,
  bannersData,
  bannersPage,
  bannersPageSize, isLoadingUI,
  totalPages
} from "../../store/banners/banners.selector";
import {displayedColumns} from "../../constants/display-columns";
import {getBannerById, openEditForm} from 'src/app/store/banners/banners.actions';

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
})
export class BannerTableComponent  implements OnInit{

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
    private bannersStore: Store<{banners: BannersStore}>
  ) {}


  pageChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.bannersService.onRouteParamsChange(queryParams)
  }

  showEditBannerForm(rowData: Banner) {
    localStorage.setItem("editFlag", JSON.stringify(true))
    localStorage.setItem("bannerId", JSON.stringify(rowData.id))
    this.bannersStore.dispatch(openEditForm())
    this.bannersStore.dispatch(getBannerById({editFlag: true, bannerId: rowData.id}))
  }

  ngOnInit() {
    this.bannersStore.select(bannerFormData).subscribe(formData => {
      this.formService.bannerForm.patchValue(formData)
    })

  }
}


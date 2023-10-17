import {Component, Input} from '@angular/core';
import {BannerModel} from "../../shared/types/banner.model";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";
import {FormsService} from "../../services/forms/forms.service";
import {PageEvent} from "@angular/material/paginator";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {BannersStore} from "../../store/banners/banners.reducer";
import {
  bannersData,
  bannersPage,
  bannersPageSize,
  totalPages
} from "../../store/banners/banners.selector";
import {showEditForm} from "../../store/banners/banners.actions";
import {drawerOpen} from "../../store/drawer/drawer.action";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent{

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', "Status", "Zone", "StartDate", "EndDate", "Labels", 'Image']

  public readonly apiUrl = environment.ApiUrl

  drawer$!: Observable<boolean>
  bannersData$!: Observable<BannerModel[]>
  totalPages$!: Observable<number>
  bannersPage$!: Observable<number>
  bannersPageSize$!: Observable<number>

  constructor(
    public bannersService: BannersService,
    private drawerStore: Store<{drawer: boolean}>,
    private bannersStore: Store<{banners: BannersStore}>
  ) {
    this.drawer$ = drawerStore.select('drawer')
    this.bannersData$ = bannersStore.select(bannersData)
    this.totalPages$ = bannersStore.select(totalPages)
    this.bannersPage$ = bannersStore.select(bannersPage)
    this.bannersPageSize$ = bannersStore.select(bannersPageSize)
  }
  pageChange(event: PageEvent) { this.bannersService.onPageChange(event) }

  showEditBannerForm(rowData: BannerModel) {
    this.bannersStore.dispatch(drawerOpen({drawerState: true}))
    this.bannersStore.dispatch(showEditForm({editFlag: true, bannerId: rowData.id}))
  }
}

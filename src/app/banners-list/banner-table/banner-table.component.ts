import {Component, Input, OnInit} from '@angular/core';
import {BannerModel} from "../../shared/types/banners/banner.model";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent{

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', "Active", "Zone", "StartDate", "EndDate", "Labels", 'Image']

  public readonly apiUrl = environment.ApiUrl

  constructor(
    private bannersService: BannersService
  ) {
  }

  showEditBannerForm(rowData: BannerModel) {
    const queryParams = {
      editFlag: true,
      bannerId: rowData.id,
      drawerIsOpen: true
    }
    this.bannersService.onRouteParamsChange(queryParams)
  }
}

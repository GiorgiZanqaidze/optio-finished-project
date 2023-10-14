import {Component, Input} from '@angular/core';
import {BannerModel} from "../../shared/types/banner.model";
import {environment} from "../../../environments/environment";
import {BannersService} from "../../services/banners/banners.service";
import {FormsService} from "../../services/forms/forms.service";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent{

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', "Status", "Zone", "StartDate", "EndDate", "Labels", 'Image']

  public readonly apiUrl = environment.ApiUrl

  constructor(
    private formService: FormsService
  ) {
  }
  showEditBannerForm(rowData: BannerModel) {
    localStorage.setItem("editFlag", JSON.stringify(true))
    localStorage.setItem("bannerId", JSON.stringify(rowData.id))
    this.formService.setItem({editFlag: true, bannerId: rowData.id})
  }
}

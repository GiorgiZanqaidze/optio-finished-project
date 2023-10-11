import {Component, Input} from '@angular/core';
import {BannerModel} from "../../types/banners/banner.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent {

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', 'Image', "Active", "Zone", "StartDate", "EndDate", "Labels"]

  public readonly apiUrl = environment.ApiUrl

  public imageBaseUrl!:string

  ngOnInit() {
  }

}

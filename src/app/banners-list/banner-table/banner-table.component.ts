import {Component, Input} from '@angular/core';
import {BannerModel} from "../../shared/types/banners/banner.model";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent {

  @Input() dataSource!: BannerModel[]

  displayedColumns = ['Name', "Active", "Zone", "StartDate", "EndDate", "Labels", 'Image']

  public readonly apiUrl = environment.ApiUrl


  constructor(private router: Router, private route: ActivatedRoute) {
  }

  showEditBunnerForm(rowData: BannerModel) {
    console.log(rowData.id)

    const queryParams = {
      editFlag: true,
      bannerId: rowData.id,
      drawerIsOpen: true
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })

  }

}

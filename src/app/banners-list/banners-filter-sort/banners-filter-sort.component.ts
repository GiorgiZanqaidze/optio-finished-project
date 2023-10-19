import {Component} from '@angular/core';
import {RouteParamsService} from "../../services/banners/route-params.service";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersStore} from "../../store/banners/banners.reducer";
import {Store} from "@ngrx/store";
import {searchAndSortBannerForm} from "../../store/banners/banners.selector";
@Component({
  selector: 'app-banners-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  styleUrls: ['./banners-filter-sort.component.css']
})
export class BannersFilterSortComponent{

  constructor(
    private bannersStore: Store<{banners: BannersStore}>,
    private bannersService: RouteParamsService
  ) {
      this.bannersStore.select(searchAndSortBannerForm).subscribe((form) => {
        this.searchBannersForm.patchValue(form)
      })
  }
  sortBy = [
      { name: "id", key: "id" },
      { name: "name", key: "name.raw" },
      { name: "isCorporate", key: "isCorporate" },
      { name: "channelId", key: "channelId" },
      { name: "language", key: "language" },
      { name: "zoneId", key: "zoneId" },
      { name: "startDate", key: "startDate" },
      { name: "endDate", key: "endDate" },
      { name: "url", key: "url.raw" },
      { name: "active", key: "active" },
      { name: "priority", key: "priority" },
      { name: "fileId", key: "fileId" },
      { name: "createdAt", key: "createdAt" },
      { name: "createdBy", key: "createdBy" },
      { name: "modifiedAt", key: "modifiedAt" },
      { name: "modifiedBy", key: "modifiedBy" },
      { name: "labels", key: "labels" },
  ]

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  bannersSearch() { this.bannersService.onRouteParamsChange(this.searchBannersForm.value) }
}

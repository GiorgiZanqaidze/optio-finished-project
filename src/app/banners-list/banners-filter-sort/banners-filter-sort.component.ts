import {Component, OnInit} from '@angular/core';
import {BannersService} from "../../services/banners/banners.service";
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
    private bannersService: BannersService
  ) {
      this.bannersStore.select(searchAndSortBannerForm).subscribe((form) => {
        this.searchBannersForm.patchValue(form)
      })
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  bannersSearch() { this.bannersService.onRouteParamsChange(this.searchBannersForm.value) }
}

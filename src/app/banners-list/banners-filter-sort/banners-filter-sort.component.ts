import {Component} from '@angular/core';
import {RouteParamsService} from "../../services/banners/route-params.service";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersStore} from "../../store/banners/banners.reducer";
import {Store} from "@ngrx/store";
import {searchAndSortBannerForm} from "../../store/banners/banners.selector";
import {SortBy} from "../../constants/sorting-options";

@Component({
  selector: 'app-banners-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
})
export class BannersFilterSortComponent{

    protected readonly SortBy = SortBy;
    
  constructor(
    private bannersStore: Store<{banners: BannersStore}>,
    private bannersService: RouteParamsService
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

import {Component, Input, Output,  EventEmitter, OnInit} from '@angular/core';
import {RouteParamsService} from "../../services/banners/route-params.service";
import { FormGroup } from "@angular/forms";
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

  @Input() searchBannersForm!: FormGroup

  @Output() bannersSearch = new EventEmitter<any>()

  onBannersSearch() {
    this.bannersSearch.emit(this.searchBannersForm.value)
   }


  constructor(
    private bannersStore: Store<{banners: BannersStore}>,
    private bannersService: RouteParamsService
  ) {
      this.bannersStore.select(searchAndSortBannerForm).subscribe((form) => {
        this.searchBannersForm.patchValue(form)
      })
  }



}

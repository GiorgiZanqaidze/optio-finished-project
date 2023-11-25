import {Component, Input, Output,  EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
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

  constructor(private bannersStore: Store<{banners: BannersStore}>, private formBuilder: FormBuilder) {
      this.searchBannersForm = this.formBuilder.group({
        search: '',
        sortDirection: '',
        sortBy: ''
      })

      this.bannersStore.select(searchAndSortBannerForm).subscribe((form) => {
        this.searchBannersForm.patchValue(form)
      })
  }

}

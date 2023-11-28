import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SortBy} from "../../constants/sorting-options";

@Component({
  selector: 'app-store-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersFilterSortComponent{

  protected readonly SortBy = SortBy;

  constructor(private formBuilder: FormBuilder) {}

  @Input() searchBannersForm = this.formBuilder.group({
    search: '',
    sortDirection: '',
    sortBy: ''
  })


  @Output() bannersSearch = new EventEmitter<any>()

  onBannersSearch() {
    this.bannersSearch.emit(this.searchBannersForm.value)
  }

}

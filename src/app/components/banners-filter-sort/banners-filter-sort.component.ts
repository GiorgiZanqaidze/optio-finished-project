import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SortBy} from "../../shared/constants/sorting-options";

@Component({
  selector: 'app-store-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersFilterSortComponent implements OnChanges{

  protected readonly SortBy = SortBy;

  @Input() searchBannersForm!: {search: string, sortDirection: string, sortBy: string} | null

  searchForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })


  @Output() bannersSearch = new EventEmitter()

  onBannersSearch() {
    this.bannersSearch.emit(this.searchForm.value)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchBannersForm']) {
      this.searchForm.patchValue(this.searchBannersForm as {search: string, sortDirection: string, sortBy: string})
    }
  }

}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SortBy} from "../../shared/constants/sorting-options";
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-store-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersFilterSortComponent implements OnChanges{

  @Input() searchBannersForm!: {search: string} | null

  searchForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  @Output() bannersSearch = new EventEmitter()

  onBannersSearch() {
    this.bannersSearch.emit(this.searchForm.value)
  }

  constructor() {
    this.searchForm.valueChanges
    .pipe( debounceTime(500))
    .subscribe((res: any) => {
      this.bannersSearch.emit(res)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchBannersForm']) {
      this.searchForm.patchValue(this.searchBannersForm as {search: string, sortDirection: string, sortBy: string})
    }
  }

}

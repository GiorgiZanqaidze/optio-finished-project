import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { debounceTime } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-store-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannersFilterSortComponent implements OnChanges{

  @Input() searchBannersForm!: {search: string} | null

  @Output() bannersSearch = new EventEmitter()


  searchForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })

  constructor() {
    this.searchForm.valueChanges
    .pipe(
       debounceTime(500),
       untilDestroyed(this)
       )
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

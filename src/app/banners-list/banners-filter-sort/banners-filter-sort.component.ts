import {Component, OnInit} from '@angular/core';
import {BannersService} from "../../services/banners/banners.service";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersStore} from "../../store/banners/banners.reducer";
import {Store} from "@ngrx/store";
import {searchAndSortBannerForm} from "../../store/banners/banners.selector";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-banners-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  styleUrls: ['./banners-filter-sort.component.css']
})
export class BannersFilterSortComponent{

  constructor(
    private bannersService: BannersService,
    private bannersStore: Store<{banners: BannersStore}>,
    private router: Router,
    private route: ActivatedRoute
  ) {
      this.bannersStore.select(searchAndSortBannerForm).subscribe((form) => {
        this.searchBannersForm.patchValue(form)
      })
  }

  onRouteParamsChange(queryParams: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    }).catch(err => console.log(err))
  }

  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
    "sortDirection": new  FormControl<string>('asc'),
    "sortBy": new FormControl<string>('name.raw')
  })


  bannersSearch() {
    this.onRouteParamsChange(this.searchBannersForm.value)
  }
}

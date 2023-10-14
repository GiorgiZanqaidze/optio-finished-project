import { Component } from '@angular/core';
import {BannersService} from "../../services/banners/banners.service";

@Component({
  selector: 'app-banners-filter-sort',
  templateUrl: './banners-filter-sort.component.html',
  styleUrls: ['./banners-filter-sort.component.css']
})
export class BannersFilterSortComponent {

  constructor(private bannersService: BannersService) {
  }

  searchBannersForm = this.bannersService.searchBannersForm

  bannersSearch() { this.bannersService.onBannersSearch() }
}

import { Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    public bannersService: BannersService,
  ) {}

  @ViewChild('drawer') drawer!: MatDrawer
  searchBannersForm = this.bannersService.searchBannersForm

  ngOnInit() {
    const drawerIsOpen = localStorage.getItem('drawerIsOpen')
    if (drawerIsOpen !== null) this.bannersService.setDrawerIsOpen(JSON.parse(drawerIsOpen))

    this.bannersService.getBannerIdObservable().subscribe(() => {
      this.drawer.toggle(true ).catch(err => console.log(err))
    })

    this.route.queryParams
      .subscribe((route: Params) => {
          this.bannersService.setBannerPage(+route['page'])
          this.bannersService.setBannerPageSize(+route['pageSize'])
          this.bannersService.searchBannersForm.patchValue({
            'search': route['search'],
            'sortDirection': route['sortDirection'],
            'sortBy': route['sortBy']
          })
          this.bannersService.onFetchBanners()
      });
  }

  drawerOpen() { this.bannersService.onDrawerOpen(this.drawer.opened) }

  pageChange(event: PageEvent) { this.bannersService.onPageChange(event) }

  drawerClose() { this.bannersService.onDrawerClose() }

  bannersSearch() { this.bannersService.onBannersSearch() }
}

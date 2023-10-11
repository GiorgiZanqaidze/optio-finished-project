import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BannerModel} from "../types/banners/banner.model";
import {FormControl, FormGroup} from "@angular/forms";
import {BannersService} from "../services/banners/banners.service";
import {MatDrawer} from "@angular/material/sidenav";
import {distinctUntilChanged} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {TableColumn} from "../shared/enums";

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.css'],
})
export class BannersListComponent implements OnInit, AfterViewInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bannersService: BannersService,
  ) {
  }

  banners!: BannerModel[]
  page!: number
  totalPages!: number
  @ViewChild('drawer') drawer!: MatDrawer
  drawerIsOpen!: boolean
  tableColumn = TableColumn;
  displayedColumns = ['Name', 'Image']




  searchBannersForm = new FormGroup({
    "search": new FormControl<string>(''),
  })

  ngOnInit() {
    this.route.queryParams.subscribe((route :Params) => {

      if (route['drawerIsOpen']) {
        this.drawerIsOpen = JSON.parse(route['drawerIsOpen'])
      }
    })
    this.route.queryParams
      .pipe(
        distinctUntilChanged((prev, current) => prev['page'] === current['page'])
      )
      .subscribe((route: Params) => {
        this.page = +route['page'];
        this.searchBannersForm.patchValue({'search': route['search']} )
        this.bannersService
          .fetchBanners(this.searchBannersForm.value.search, this.page, 4)
          .subscribe((data: any) => {
            console.log(data)
            this.totalPages = data.data.total;
            this.banners = data.data.entities;
          });
      });
  }

  drawerChange() {
    const queryParams = { drawerIsOpen: this.drawer.opened };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }


  onPageChange(event: PageEvent) {
    const queryParams = { page: event.pageIndex };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  searchBanners() {
    const queryParams = { search: this.searchBannersForm.value.search };
    console.log(queryParams)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
    this.bannersService
        .fetchBanners(this.searchBannersForm.value.search, this.page, 4)
        .subscribe((data: any) => {
          console.log(data)
          this.totalPages = data.data.total;
          this.banners = data.data.entities;
        });
  }

  dataSource = new MatTableDataSource<BannerModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

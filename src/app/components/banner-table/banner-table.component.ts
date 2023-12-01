import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Banner} from "../../shared/types/banner";
import {environment} from "../../../environments/environment";
import {PageEvent} from "@angular/material/paginator";
import {displayedColumns} from "../../shared/constants/display-columns";

@Component({
  selector: 'app-banner-table',
  templateUrl: './banner-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerTableComponent {

  public readonly displayedColumns = displayedColumns

  public readonly apiUrl = environment.ApiUrl

  @Output() routeParamsChange = new EventEmitter()

  @Input() bannersData$!: Banner[] | null

  @Input() totalPages$!: number | null

  @Input() bannersPage$!: number | null

  @Input() bannersPageSize$!: number | null

  @Input() isLoading$!: boolean | null

  @Input() apiError$!: string | null

  @Output() showEditBannerForm = new EventEmitter()

  @Input() queryParams!: any

  onShowEditBannerForm(rowData: Banner) {
    this.showEditBannerForm.emit(rowData.id)
  }

  onRouteParamsChange(event: PageEvent) {
    const queryParams = {page: event.pageIndex, pageSize: event.pageSize};
    this.routeParamsChange.emit(queryParams)
  }
}


import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class BannersService {

    private readonly ApiBaseUrl: string

  constructor(
    private http: HttpClient,
  ) {
        this.ApiBaseUrl = environment.ApiUrl
  }

  fetchBanners(search: string | null | undefined, pageIndex: number, pageSize: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined) {
    return this.http.post("/banners/find",{search, pageIndex, pageSize, sortBy, sortDirection})
  }
}

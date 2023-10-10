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

  fetchBanners(searchInput: string, page: number) {
    return this.http.post(`${this.ApiBaseUrl}/banners/find`,
      {
        search:searchInput,
        "pageSize": 4,
        "pageIndex": page,
      })
  }
}

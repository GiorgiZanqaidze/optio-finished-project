import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {ReferenceData} from "../../shared/types/reference-data";
import { Banner } from 'src/app/shared/types/banner';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  private readonly baseUrl = environment.ApiUrl

  constructor(private http: HttpClient) { }

  fetchBanners(payload: {search?: string | null | undefined, pageIndex?: number, pageSize?: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined}) {
    const {search, pageIndex, pageSize, sortBy, sortDirection} = payload
    return this.http.post(`${this.baseUrl}/banners/find`, {search, pageIndex, pageSize, sortBy, sortDirection, excludes: ['url', 'priority', 'createdAt', 'modifiedAt'],})
  }

  fetchBannerById(id: number) {
    return this.http.post(`${this.baseUrl}/banners/find-one`,{id, excludes: ['createdAt', 'modifiedAt']})
  }

  submitBlob(fileData: FormData) {
    return this.http.post(`${this.baseUrl}/blob/upload`, fileData)
  }

  submitBannerForm(formData: Banner) {
    return this.http.post(`${this.baseUrl}/banners/save`, formData)
  }

  getChannels() {
    return this.http
      .post(`${this.baseUrl}/reference-data/find`, {
        typeId: environment.channels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceData[])
      );
  }

  getZones() {
    return this.http
      .post(`${this.baseUrl}/reference-data/find`, {
        typeId: environment.zones_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceData[])
      );
  }

  getLabels() {
    return this.http
      .post(`${this.baseUrl}/reference-data/find`, {
        typeId: environment.labels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceData[])
      );
  }

  getLanguages() {
    return this.http
      .post(`${this.baseUrl}/reference-data/find`, {
        typeId: environment.languages_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceData[])
      );
  }

  deleteBanner(id: string | number) {
    return this.http.post(`${this.baseUrl}/banners/remove`, {id: id})
  }
}

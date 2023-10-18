import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {ReferenceDataModel} from "../../shared/types/reference-data.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchBanners(search?: string | null | undefined, pageIndex?: number, pageSize?: number, sortBy?: string | null | undefined, sortDirection?: string | null | undefined) {
    return this.http.post("/banners/find",{search, pageIndex, pageSize, sortBy, sortDirection})
  }

  fetchBannerById(id: number) {
    return this.http.post("/banners/find-one",{id})
  }

  submitBlob(formData: any) {
    return this.http.post('/blob/upload', formData)
  }

  submitBannerForm(formData:any) {
    return this.http.post('/banners/save', formData)
  }
  getChannels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.channels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getZones() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.zones_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLabels() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.labels_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  getLanguages() {
    return this.http
      .post('/reference-data/find', {
        typeId: environment.languages_type_id,
        includes: ['key', 'name'],
      })
      .pipe(
        map((data: any) => data.data.entities as ReferenceDataModel[])
      );
  }

  deleteBanner(id: string | number) {
    return this.http.post('/banners/remove', {id: id})
  }
}

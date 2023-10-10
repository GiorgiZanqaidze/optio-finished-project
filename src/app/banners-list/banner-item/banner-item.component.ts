import {Component, Input, OnInit} from '@angular/core';
import {BannerModel} from "../../types/banners/banner.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-banner-item',
  templateUrl: './banner-item.component.html',
  styleUrls: ['./banner-item.component.css']
})
export class BannerItemComponent implements OnInit{

  @Input() banner!: BannerModel

  public readonly apiUrl = environment.ApiUrl

  public imageBaseUrl!:string

  ngOnInit() {
    this.imageBaseUrl = `${this.apiUrl}/blob/${this.banner.fileId}`;
  }
}

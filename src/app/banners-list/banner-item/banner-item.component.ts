import {Component, Input} from '@angular/core';
import {BannerModel} from "../../types/banners/banner.model";

@Component({
  selector: 'app-banner-item',
  templateUrl: './banner-item.component.html',
  styleUrls: ['./banner-item.component.css']
})
export class BannerItemComponent {

  @Input() banner!: BannerModel

}

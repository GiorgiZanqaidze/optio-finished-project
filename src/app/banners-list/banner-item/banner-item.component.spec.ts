import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerItemComponent } from './banner-item.component';

describe('BannerItemComponent', () => {
  let component: BannerItemComponent;
  let fixture: ComponentFixture<BannerItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerItemComponent]
    });
    fixture = TestBed.createComponent(BannerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

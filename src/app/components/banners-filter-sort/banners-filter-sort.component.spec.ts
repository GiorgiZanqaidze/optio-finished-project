import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersFilterSortComponent } from './banners-filter-sort.component';

describe('BannersFilterSortComponent', () => {
  let component: BannersFilterSortComponent;
  let fixture: ComponentFixture<BannersFilterSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannersFilterSortComponent]
    });
    fixture = TestBed.createComponent(BannersFilterSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

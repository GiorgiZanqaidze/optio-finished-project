import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersComponent } from './banners.component';

describe('BannersListComponent', () => {
  let component: BannersComponent;
  let fixture: ComponentFixture<BannersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannersComponent]
    });
    fixture = TestBed.createComponent(BannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

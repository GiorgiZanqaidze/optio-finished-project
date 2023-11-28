import { TestBed } from '@angular/core/testing';

import { ApiUrlInterceptorService } from './api-url-interceptor.service';

describe('ApiUrlInterceptorService', () => {
  let service: ApiUrlInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUrlInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

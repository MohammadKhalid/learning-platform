import { TestBed } from '@angular/core/testing';

import { PublicRestApiService } from './public-rest-api.service';

describe('PublicRestApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicRestApiService = TestBed.get(PublicRestApiService);
    expect(service).toBeTruthy();
  });
});

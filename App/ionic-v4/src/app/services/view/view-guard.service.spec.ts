import { TestBed } from '@angular/core/testing';

import { ViewGuardService } from './view-guard.service';

describe('ViewGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewGuardService = TestBed.get(ViewGuardService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RtcRecorderService } from './rtc-recorder.service';

describe('RtcRecorderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RtcRecorderService = TestBed.get(RtcRecorderService);
    expect(service).toBeTruthy();
  });
});

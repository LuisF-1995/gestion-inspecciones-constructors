import { TestBed } from '@angular/core/testing';

import { ValidateDataService } from './validate-data.service';

describe('ValidateDataService', () => {
  let service: ValidateDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

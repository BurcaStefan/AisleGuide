import { TestBed } from '@angular/core/testing';

import { HistorylistService } from './historylist.service';

describe('HistorylistService', () => {
  let service: HistorylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

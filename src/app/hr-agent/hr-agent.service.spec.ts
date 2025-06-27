import { TestBed } from '@angular/core/testing';

import { HrAgentService } from './hr-agent.service';

describe('HrAgentService', () => {
  let service: HrAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

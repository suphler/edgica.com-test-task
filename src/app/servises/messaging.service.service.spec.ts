import { TestBed, inject } from '@angular/core/testing';

import { Messaging.ServiceService } from './messaging.service.service';

describe('Messaging.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Messaging.ServiceService]
    });
  });

  it('should be created', inject([Messaging.ServiceService], (service: Messaging.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});

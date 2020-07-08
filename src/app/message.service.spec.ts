import { TestBed } from '@angular/core/testing';

import { Message.Service } from './message.service';

describe('Message.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Message.ServiceService = TestBed.get(Message.ServiceService);
    expect(service).toBeTruthy();
  });
});

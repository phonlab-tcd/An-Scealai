import { TestBed } from '@angular/core/testing';

import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationServiceService = TestBed.get(NotificationServiceService);
    expect(service).toBeTruthy();
  });
});

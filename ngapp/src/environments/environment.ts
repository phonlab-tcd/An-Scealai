import { ModuleTeardownOptions } from '@angular/core/testing';
const moduleTeardownOptions: ModuleTeardownOptions =
{
  destroyAfterEach: false
}

export const environment = {
  production: false,
  moduleTeardownOptions,
};

import 'zone.js/dist/zone-error';  // do not import in production

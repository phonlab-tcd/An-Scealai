import { ModuleTeardownOptions } from '@angular/core/testing';
const moduleTeardownOptions: ModuleTeardownOptions =
{
  destroyAfterEach: false
}

export const environment = {
  production: true,
  moduleTeardownOptions,
};

import 'zone.js/dist/zone-error';  // do not import in production

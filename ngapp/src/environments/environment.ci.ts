import { ModuleTeardownOptions } from '@angular/core/testing';
const moduleTeardownOptions: ModuleTeardownOptions =
{
  destroyAfterEach: true
}

export const environment = {
  production: true,
  moduleTeardownOptions,
};

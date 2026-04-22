import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data';

// Neļauj nepieslēgtiem lietotājiem piekļūt aizsargātām lapām.
// Novirza uz pieslēgšanās lapu, ja nav aktīvas sesijas.
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  const user = userDataService.getUserData();

  if (user && user.id > 0) {
    return true;
  }
  return router.parseUrl('');
};

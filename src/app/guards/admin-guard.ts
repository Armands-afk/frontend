import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data';


// te citi netiek klat un ar attiecigo epastu ko noradu ka admin tikai es tieku admin paneli
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  const currentUser = userDataService.getUserData();
  const isAdmin = currentUser.email.toLowerCase() === 'admin@gmail.com';
  if (isAdmin) {
    return true;
  }
  return router.parseUrl('');
  
};

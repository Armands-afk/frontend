import { Injectable } from '@angular/core';

import { UserDataModel } from '../user-login/user-login-model';

@Injectable({
  providedIn: 'root',
})
// Saglabā un nolasa pieslēgtā lietotāja datus, izmantojot sessionStorage.
export class UserDataService {
  
  // Saglabā lietotāja datus (id + e-pasts) pēc pieslēgšanās vai reģistrācijas.
  setUserData(data: UserDataModel): void {
    sessionStorage.setItem('userData', JSON.stringify(data));
  }

  // Nolasa lietotāja datus no sessionStorage. Ja nav nekas saglabāts,
  //  atgriež tukšas noklusējuma vērtības.
  getUserData(): UserDataModel {
    const raw = sessionStorage.getItem('userData');
    if (!raw) {
      return { id: 0, email: '' };
    }

    try {
      return JSON.parse(raw) as UserDataModel;
    } catch {
      sessionStorage.removeItem('userData');
      return { id: 0, email: '' };
    }
  }

}


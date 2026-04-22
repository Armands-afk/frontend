import { Component, inject, input, signal } from '@angular/core';
import { FieldTree, FormField} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserLoginModel } from './user-login-model';
import { ErrorValidation } from '../error-validation/error-validation';
import { UserRegService } from '../services/user-reg-service';
import { UserDataService } from '../services/user-data';

@Component({
  selector: 'app-user-login',
  imports: [FormField, ErrorValidation],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
// Pārvalda pieslēgšanās un reģistrācijas formas loģiku. Saņem formas koku no MainPage.
export class UserLogin {
  userRegService = inject(UserRegService);
  userDataService = inject(UserDataService);
  router = inject(Router);
  fromMain = input.required<FieldTree<UserLoginModel>>();

  // nuu seit man ja ir true tad dod pieslegsanos a vot ja false tad displejoo registraciju
  isRegistered = signal<boolean>(true);
  // labs signals nosaka vai paradit paroles lauku
  show = signal<boolean>(false);

  // reg jaunu lietotaju plus save data un tad atgriez admin vai events lapu atkariba no emaila
  saveUser() {
    this.userRegService.saveUser(this.fromMain()().value()).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.userDataService.setUserData({
            id: response.body!,
            email: this.fromMain()().value().email,
          });
          // Jauni lietotāji nekad nav admins — vienmēr novirza uz pasākumiem
          this.router.navigateByUrl('/events');
        } else {
          alert('Reģistrācija neizdevās. Lūdzu mēģiniet vēlreiz.');
        }
      },
      error: () => {
        alert('Reģistrācija neizdevās. Serveris nav pieejams.');
      },
    });
  }

  // Piesaka esošu lietotāju. Admins tiek novirzīts uz /admin, pārējie uz /events.
  onSignIn() {
    const userData = this.fromMain()().value();
    const userLogin = {
      ...userData,
      email: userData.email.trim().toLowerCase(),
      confirmPassword: userData.password,
    };
    this.userRegService.signInUser(userLogin).subscribe({
      next: (response) => {
        if (response.status === 200 && (response.body ?? -1) > 0) {
          const email = userLogin.email;
          this.userDataService.setUserData({
            id: response.body!,
            email,
          });
          // Salidzina un ja admin emails ir istais tad aiziet uz admin lapu
          const destination = email === 'admin@gmail.com' ? '/admin' : '/events';
          this.router.navigateByUrl(destination);
        } else {
          this.fromMain()().reset({
            email: this.fromMain()().value().email,
            password: '',
            confirmPassword: '',
          })
          alert('Pieslēgšanās neizdevās. Pārbaudiet e-pastu un paroli.');
        }
      },
      error: () => {
        this.fromMain()().reset({
          email: this.fromMain()().value().email,
          password: '',
          confirmPassword: '',
        });
        alert('Pieslēgšanās neizdevās. Serveris nav pieejams.');
      },
    });
  }

  // Parbauda kad ierakstu email vai tads ir un tikai tad parada paroles laukus(Ja ir piemeram)
  onEmailInput() {
    const email = this.fromMain()().value().email.trim().toLowerCase();
    this.userRegService.checkEmailExists(email).subscribe({
      next: (response) => {
        this.isRegistered.set(response.body!);
        this.show.set(true);
      },
      error: (e) => {
        console.error('Kļūda pārbaudot e-pastu', e);
      },
    });
  }
}


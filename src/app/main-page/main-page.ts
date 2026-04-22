import { Component, signal } from '@angular/core';
import { createUserLoginForm, validateUserLoginForm } from '../user-login/user-login-model';
import { MainPageModel } from './main_page_model';
import { form } from '@angular/forms/signals';
import { UserLogin } from '../user-login/user-login';


@Component({
  selector: 'app-main-page',
  imports: [UserLogin],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  mainSignal = signal<MainPageModel>({
    userLoginMain: createUserLoginForm()(),
    
  });
  mainForm = form(this.mainSignal, (v) => {
    validateUserLoginForm(v.userLoginMain);
    
  });
}

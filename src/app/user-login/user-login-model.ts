import { signal, WritableSignal } from '@angular/core';
import { required, SchemaPathTree, validate } from '@angular/forms/signals';

export interface UserLoginModel {
  id?: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserDataModel {
  id: number;
  email: string;
}


export function createUserLoginForm(): WritableSignal<UserLoginModel> {
  return signal<UserLoginModel>({
    email: '',
    password: '',
    confirmPassword: '',
  });
}

export function validateUserLoginForm(s: SchemaPathTree<UserLoginModel>) {
  required(s.email, { message: 'E-pasts ir obligāts' });
  validate(s.email, ({ value }) => {
    const email = value().trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      return {
        kind: 'emailInvalid',
        message: 'E-pasts nav derīgs',
      };
    }
    return null;
  });
  required(s.password, { message: 'Parole ir obligāta' });
  validate(s.confirmPassword, ({ value, valueOf }) => {
    const password = valueOf(s.password);
    const confirmPassword = value();
    if (password !== confirmPassword) {
      return {
        kind: 'passwordMismatch',
        message: 'Paroles nesakrīt',
      };
    }
    return null;
  });
  
}

import { Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-error-validation',
  imports: [],
  templateUrl: './error-validation.html',
  styleUrl: './error-validation.css',
})
// Atkārtoti izmantojams komponente kas rāda validācijas kļūdu ziņojumus...
export class ErrorValidation {
  // Saņem lauka pašreizējo validācijas stāvokli no vecākformas kas ir parents principa..
  fieldValid = input.required<FieldState<any, string>>();
}

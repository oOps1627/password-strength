import { Component } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public passwordControl: FormControl;
  public readonly passwordValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(8)
  ];

  constructor() {
    this.passwordControl = new FormControl(null, this.passwordValidators);
  }
}

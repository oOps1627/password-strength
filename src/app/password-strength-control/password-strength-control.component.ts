import { Component, forwardRef, Input, OnDestroy } from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ValidatorFn
} from "@angular/forms";
import { ReplaySubject, takeUntil } from "rxjs";

enum PasswordStrength {
  Easy,
  Medium,
  Hard,
}

@Component({
  selector: 'app-password-strength-control',
  templateUrl: './password-strength-control.component.html',
  styleUrls: ['./password-strength-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PasswordStrengthControl),
    },
  ],
})
export class PasswordStrengthControl implements ControlValueAccessor, OnDestroy {
  @Input() set validators(value: ValidatorFn[]) {
    this.control.setValidators(value);
  }

  public readonly control: FormControl = new FormControl(null);
  public strengthClassName: string = '';

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  static getPasswordStrength(password: string): PasswordStrength {
    const hasLetterReg = /.*[a-zA-Z-яА-Я].*/;
    const hasSymbolReg = /.*\W.*/;
    const hasNumberReg = /.*\d.*/;

    const matches: number = [hasLetterReg, hasSymbolReg, hasNumberReg]
      .reduce((acc, regexp) => (acc + (regexp.test(password) ? 1 : 0)), 0);

    switch (matches) {
      case 2:
        return PasswordStrength.Medium;
      case 3:
        return PasswordStrength.Hard;
      default:
        return PasswordStrength.Easy;
    }
  }

  ngOnInit() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => this.updateStrengthClassName(value))
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  writeValue(password: string): void {
    this.control.setValue(password, {emitEvent: false});
  }

  private updateStrengthClassName(value: string): void {
    const strength: PasswordStrength = PasswordStrengthControl.getPasswordStrength(value);
    this.strengthClassName = PasswordStrength[strength].toLowerCase();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

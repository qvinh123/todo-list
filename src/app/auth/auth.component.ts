import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth.model';
import { Router } from '@angular/router';

function matchPassword(password: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } => {
    if (!control || !control.parent) {
      return null;
    }
    return control.value === control.parent.get(password).value
      ? null
      : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class AuthComponent implements OnInit {
  form: FormGroup;

  mode = true;

  nameControls = {
    email: 'email',
    password: 'password',
    confirmPassword: 'confirmPassword',
  };

  private keysMsgError = {
    required: 'Field is required',
    email: 'Enter a valid email address',
    passwordMismatch: 'Passwords doesnot match',
    minlength: 'Password should have minimum 8 characters',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.logout();
    this.form = this.fb.group({
      [this.nameControls.email]: this.fb.control(null, [
        Validators.required,
        Validators.email,
      ]),
      [this.nameControls.password]: this.fb.control(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSwitchMode() {
    this.mode = !this.mode;

    if (!this.mode) {
      this.form.addControl(
        this.nameControls.confirmPassword,
        this.fb.control(null, [
          Validators.required,
          matchPassword(this.nameControls.password),
        ])
      );
    } else {
      this.form.removeControl(this.nameControls.confirmPassword);
    }

    this.form.reset();
    this.form.markAsPristine();
  }

  isControlValid(nameControl: string) {
    const control = this.form.get(nameControl);

    if (!control) {
      return false;
    }

    return control.invalid && (control.touched || control.dirty);
  }

  messageErrorOfControl(nameControl: string) {
    const control = this.form.get(nameControl);

    if (!control || !control.errors) {
      return '';
    }

    const keysOfControl = Object.keys(control.errors);

    for (const key of keysOfControl) {
      return this.keysMsgError[key];
    }

    return '';
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const { password, email } = this.form.getRawValue();

    let authObs: Observable<AuthResponse>;

    if (!this.mode) {
      authObs = this.authService.signup({ password, email });
    } else {
      authObs = this.authService.login({ password, email });
    }

    authObs.subscribe((_) => {
      this.form.reset();
      this.router.navigate(['/']);
    });
  }
}

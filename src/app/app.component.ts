import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { AuthService } from './auth/auth.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoComponent, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthencated = false;
  destroy$ = new Subject<boolean>();

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

  onLogout() {
    this.authService.logout();
  }
}

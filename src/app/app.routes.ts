import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { TodoComponent } from './todo/todo.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: NotFoundComponent },
];

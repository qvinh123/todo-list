import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import Todo from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  url =
    'https://todo-10a6a-default-rtdb.asia-southeast1.firebasedatabase.app/todos';

  constructor(private http: HttpClient) {}

  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.url}.json`, todo);
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.url}.json`).pipe(
      map((res) => {
        const tempArr = [];
        for (const key in res) {
          if (res[key]) {
            tempArr.push({ ...res[key], id: key });
          }
        }
        return tempArr;
      })
    );
  }

  deleteTodo(todo: Todo): Observable<Todo> {
    return this.http.delete<Todo>(`${this.url}/${todo.id}.json`);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.url}/${todo.id}.json`, todo);
  }
}

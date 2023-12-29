import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  IRichCellEditorParams,
  IDateFilterParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ValueFormatterParams } from 'ag-grid-enterprise';
import Todo from './todo.model';
import { TodoService } from './todo.service';

function actionCellRenderer(params) {
  let eGui = document.createElement('div');
  eGui.innerHTML = `
  <button style="color:red; background:transparent; border:none" class="action-button delete">
  <span data-action="delete" class="material-symbols-outlined">
    delete
  </span>
  </button>`;
  return eGui;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AgGridModule,
  ],
})
export class TodoComponent {
  content = '';

  rowData: Todo[];

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  completeMappings = {
    true: 'Completed',
    false: 'Incomplete',
  };

  filterParams: IDateFilterParams = {
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2022,
    maxValidYear: 2024,
    inRangeFloatingFilterDateFormat: 'MM DD YYYY',
  };

  colDefs: ColDef[] = [
    {
      field: 'task',
      editable: true,
      resizable: false,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      field: 'completed',
      filter: 'agSetColumnFilter',
      floatingFilter: true,
      cellEditor: 'agRichSelectCellEditor',
      editable: true,
      resizable: false,
      minWidth: 150,
      cellEditorParams: {
        values: this.extractKeys(this.completeMappings),
      } as IRichCellEditorParams,
      cellStyle: (params) => {
        if (params.value === String(true)) {
          return { color: 'forestgreen' };
        }
        return { color: 'dodgerblue' };
      },
      filterParams: {
        values: this.extractKeys(this.completeMappings),
        valueFormatter: (params: ValueFormatterParams) => {
          return this.lookupValue(this.completeMappings, params.value);
        },
      },
      valueFormatter: (params) => {
        return this.lookupValue(this.completeMappings, params.value);
      },
    },
    {
      field: 'date',
      resizable: false,
      minWidth: 250,
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      filterParams: this.filterParams,
    },
    {
      headerName: 'Action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'Action',
      resizable: false,
      sortable: false,
      maxWidth: 150,
    },
  ];

  constructor(private todoService: TodoService) {}

  extractKeys(mappings: Record<string, string>) {
    return Object.keys(mappings);
  }
  lookupValue(mappings: Record<string, string>, key: string) {
    return mappings[key];
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe((data) => {
      this.rowData = data.map((item) => ({
        ...item,
        completed: String(item.completed),
      }));
    });
  }

  onAddTodo() {
    const todo: Todo = {
      task: this.content,
      completed: false,
      date: new Date().toLocaleDateString('en-GB'),
    };
    this.todoService.addTodo(todo).subscribe((_) => {
      this.content = '';
      this.fetchTodos();
    });
  }

  onCellClicked(params) {
    if (
      params.column.colId === 'Action' &&
      params.event.target.dataset.action
    ) {
      let { action } = params.event.target.dataset;

      if (action === 'delete') {
        this.todoService.deleteTodo(params.node.data).subscribe((_) => {
          this.fetchTodos();
        });
      }
    }
  }

  onUpdateTodo(params) {
    const todoUpdate: Todo = {
      ...params.node.data,
      task: params.node.data.task,
      completed: /^true$/i.test(params.node.data.completed),
      date: new Date().toLocaleDateString('en-GB'),
    };

    this.todoService.updateTodo(todoUpdate).subscribe((_) => {
      this.fetchTodos();
    });
  }
}

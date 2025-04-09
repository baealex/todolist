import { TodoListApp } from './components/todo-list/TodoListApp';

import './style.css';

const todoListApp = new TodoListApp({
  el: document.getElementById('app')!,
  useDnd: true,
});

todoListApp.render();

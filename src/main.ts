import { TodoListApp } from './components/todo-list/TodoListApp';

const todoListApp = new TodoListApp({
  el: document.getElementById('app')!,
  useDnd: true,
});

todoListApp.render();

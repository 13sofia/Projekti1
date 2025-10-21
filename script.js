const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const STORAGE_KEY = 'todos-v1';

let todos = loadTodos();
renderTodos();

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const todo = { id: Date.now().toString(), text, done: false };
  todos.push(todo);
  saveTodos();
  appendTodoItem(todo);
  input.value = '';
  input.focus();
});

function loadTodos(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos(){
  list.innerHTML = '';
  todos.forEach(appendTodoItem);
}

function appendTodoItem(todo){
  const li = document.createElement('li');
  li.dataset.id = todo.id;
  if (todo.done) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => toggleDone(todo.id, checkbox.checked));

  const span = document.createElement('span');
  span.className = 'text';
  span.textContent = todo.text;

  const del = document.createElement('button');
  del.className = 'delete';
  del.type = 'button';
  del.textContent = 'Poista';
  del.addEventListener('click', () => removeTodo(todo.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);
}

function toggleDone(id, done){
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.done = done;
  saveTodos();
  const li = list.querySelector(`li[data-id="${id}"]`);
  if (li) li.classList.toggle('completed', done);
}

function removeTodo(id){
  todos = todos.filter(x => x.id !== id);
  saveTodos();
  const li = list.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();
}
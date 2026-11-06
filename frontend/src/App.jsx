import { useRef, useState } from 'react';

/**
 * Render the in-memory task list and its complete interaction flow.
 *
 * @returns {import('react').JSX.Element} The todo workflow interface.
 */
function App() {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const nextId = useRef(1);

  /**
   * Add a task when the input contains non-whitespace text.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} event The form submission event.
   */
  function handleAdd(event) {
    event.preventDefault();
    const title = inputValue.trim();

    if (title === '') {
      return;
    }

    const todo = { id: nextId.current, title, completed: false };
    nextId.current += 1;
    setTodos((currentTodos) => [...currentTodos, todo]);
    setInputValue('');
  }

  /**
   * Toggle completion for only the selected task.
   *
   * @param {number} id The sequential task identifier.
   */
  function handleToggle(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  /**
   * Remove only the selected task.
   *
   * @param {number} id The sequential task identifier.
   */
  function handleDelete(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  /**
   * Submit the form when Enter is pressed in the task input.
   *
   * @param {import('react').KeyboardEvent<HTMLInputElement>} event The input key event.
   */
  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <main className="page-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="todo-header">
          <p className="eyebrow">A little more focus</p>
          <h1 id="page-title">Todo App</h1>
          <p className="intro">Make room for what matters, one task at a time.</p>
        </header>

        <form className="task-form" onSubmit={handleAdd}>
          <label className="visually-hidden" htmlFor="todo-input-field">
            Add a task
          </label>
          <input
            id="todo-input-field"
            data-testid="todo-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="What needs doing?"
            autoComplete="off"
          />
          <button className="add-button" data-testid="add-button" type="submit">
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="empty-state" data-testid="empty-state">
            No tasks yet.
          </p>
        ) : (
          <ul className="todo-list" data-testid="todo-list" aria-label="Tasks">
            {todos.map((todo) => (
              <li
                className="todo-item"
                data-testid={`todo-item-${todo.id}`}
                key={todo.id}
              >
                <input
                  className="todo-checkbox"
                  data-testid={`todo-checkbox-${todo.id}`}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  aria-label={`Mark ${todo.title} as complete`}
                />
                <span
                  className="todo-title"
                  data-testid={`todo-title-${todo.id}`}
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                >
                  {todo.title}
                </span>
                <button
                  className="delete-button"
                  data-testid={`todo-delete-${todo.id}`}
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  aria-label={`Delete ${todo.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="page-note">Small steps count.</p>
    </main>
  );
}

export default App;

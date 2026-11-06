import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('Todo App', () => {
  it('shows the exact empty state before tasks are added', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Todo App' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
  });

  it('adds trimmed tasks with sequential IDs and clears the input', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, '  First task  ');
    await user.click(screen.getByTestId('add-button'));
    expect(screen.getByTestId('todo-item-1')).toHaveTextContent('First task');
    expect(input).toHaveValue('');

    await user.type(input, 'Second task{Enter}');
    expect(screen.getByTestId('todo-item-2')).toHaveTextContent('Second task');
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('ignores empty and whitespace-only submissions without showing an error', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.click(screen.getByTestId('add-button'));
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');

    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps tasks in insertion order', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'First{Enter}');
    await user.type(input, 'Second{Enter}');

    const list = screen.getByTestId('todo-list');
    expect(within(list).getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      expect.stringContaining('First'),
      expect.stringContaining('Second'),
    ]);
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
  });

  it('toggles only the selected task and updates its completion styling', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'First{Enter}');
    await user.type(input, 'Second{Enter}');
    await user.click(screen.getByTestId('todo-checkbox-1'));

    expect(screen.getByTestId('todo-checkbox-1')).toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'line-through' });
    expect(screen.getByTestId('todo-checkbox-2')).not.toBeChecked();
    expect(screen.getByTestId('todo-title-2')).toHaveStyle({ textDecoration: 'none' });

    fireEvent.click(screen.getByTestId('todo-checkbox-1'));
    expect(screen.getByTestId('todo-checkbox-1')).not.toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'none' });
  });

  it('deletes only the selected task and restores the empty state after the last deletion', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'First{Enter}');
    await user.type(input, 'Second{Enter}');
    await user.click(screen.getByTestId('todo-delete-1'));

    expect(screen.queryByTestId('todo-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toHaveTextContent('Second');

    await user.click(screen.getByTestId('todo-delete-2'));
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
  });
});

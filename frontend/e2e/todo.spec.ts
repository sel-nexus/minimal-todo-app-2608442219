import { expect, test } from '@playwright/test';

test('user can add, complete, and delete tasks through the todo workflow', async ({ page }) => {
  const browserErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      browserErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');

  const input = page.getByTestId('todo-input');
  await input.fill('First task');
  await page.getByTestId('add-button').click();
  await expect(input).toHaveValue('');
  await expect(page.getByTestId('todo-item-1')).toContainText('First task');

  await input.fill('Second task');
  await input.press('Enter');
  await expect(page.getByTestId('todo-item-2')).toContainText('Second task');
  await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(2);

  await page.getByTestId('todo-checkbox-1').check();
  await expect(page.getByTestId('todo-title-1')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.getByTestId('todo-checkbox-2')).not.toBeChecked();

  await page.getByTestId('todo-delete-1').click();
  await expect(page.getByTestId('todo-item-1')).toHaveCount(0);
  await expect(page.getByTestId('todo-item-2')).toContainText('Second task');

  await page.getByTestId('todo-delete-2').click();
  await expect(page.getByTestId('empty-state')).toHaveText('No tasks yet.');
  expect(browserErrors).toEqual([]);
});

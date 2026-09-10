import { test, expect } from '@playwright/test';

test.describe('Kanban Board MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the board to mount
    await expect(page.locator('[data-testid="kanban-page"]')).toBeVisible();
  });

  test('loads the board with 5 fixed columns and initial dummy tasks', async ({ page }) => {
    const columns = page.locator('[data-testid^="column-col-"]');
    await expect(columns).toHaveCount(5);

    await expect(page.locator('[data-testid="column-title-col-1"]')).toHaveText('Backlog');
    await expect(page.locator('[data-testid="column-title-col-2"]')).toHaveText('Ready');
    await expect(page.locator('[data-testid="column-title-col-3"]')).toHaveText('In Progress');
    await expect(page.locator('[data-testid="column-title-col-4"]')).toHaveText('In Review');
    await expect(page.locator('[data-testid="column-title-col-5"]')).toHaveText('Done');

    // Verify initial cards exist
    await expect(page.locator('[data-testid="card-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-card-8"]')).toBeVisible();
  });

  test('renames an existing column', async ({ page }) => {
    const editBtn = page.locator('[data-testid="edit-title-col-1"]');
    await editBtn.click();

    const input = page.locator('[data-testid="column-input-col-1"]');
    await expect(input).toBeVisible();

    await input.fill('Sprint Goals');
    await input.press('Enter');

    await expect(page.locator('[data-testid="column-title-col-1"]')).toHaveText('Sprint Goals');
  });

  test('adds a new card to a column', async ({ page }) => {
    const initialCountText = await page.locator('[data-testid="column-count-col-1"]').innerText();
    const initialCount = parseInt(initialCountText, 10);

    await page.locator('[data-testid="add-card-button-col-1"]').click();
    await expect(page.locator('[data-testid="add-card-overlay"]')).toBeVisible();

    await page.locator('[data-testid="card-title-input"]').fill('End-to-End Test Task');
    await page.locator('[data-testid="card-details-input"]').fill('Verified with Playwright test automation');
    await page.locator('[data-testid="submit-card-button"]').click();

    await expect(page.locator('[data-testid="add-card-overlay"]')).not.toBeVisible();
    await expect(page.locator('text=End-to-End Test Task')).toBeVisible();
    await expect(page.locator('[data-testid="column-count-col-1"]')).toHaveText(String(initialCount + 1));
  });

  test('deletes an existing card from a column', async ({ page }) => {
    const card = page.locator('[data-testid="card-card-1"]');
    await expect(card).toBeVisible();

    const deleteBtn = page.locator('[data-testid="delete-card-card-1"]');
    await deleteBtn.click();

    await expect(page.locator('[data-testid="card-card-1"]')).not.toBeVisible();
  });

  test('moves a card between columns using keyboard accessibility', async ({ page }) => {
    // hello-pangea/dnd has built-in keyboard accessibility: Space to lift, Arrow keys to move, Space to drop
    const card = page.locator('[data-testid="card-card-1"]');
    await card.focus();
    await page.keyboard.press('Space'); // Pick up card
    await page.keyboard.press('ArrowRight'); // Move to col-2
    await page.keyboard.press('Space'); // Drop card

    // Check that card-1 is now inside col-2
    const col2Card = page.locator('[data-testid="column-col-2"] [data-testid="card-card-1"]');
    await expect(col2Card).toBeVisible();
  });

  test('verifies zero emojis across the application interface', async ({ page }) => {
    const bodyText = await page.locator('body').innerText();
    // Regular expression for common emoji unicode ranges
    const emojiRegex = /(\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])/u;
    expect(emojiRegex.test(bodyText)).toBe(false);
  });
});

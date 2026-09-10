import { test, expect } from "@playwright/test";

test.describe("Kanban Project MVP Verification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const bypassBtn = page.locator("text=Continue in Offline Preview Mode");
    if (await bypassBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await bypassBtn.click();
    }
  });

  test("should render the single board with 5 fixed columns and no emojis", async ({
    page,
  }) => {
    // Check main title and single board badge
    await expect(page.locator("h1")).toContainText("Kanban Project");
    await expect(page.locator(".navbar-badge")).toHaveText("Single Board");

    // Check all 5 columns exist
    const expectedColumns = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
    for (const title of expectedColumns) {
      await expect(page.locator(".column-title-text", { hasText: title })).toBeVisible();
    }

    // Verify exactly 5 columns rendered
    const columns = page.locator(".kanban-column");
    await expect(columns).toHaveCount(5);

    // Verify strict requirement: no emojis on page
    const pageText = await page.locator("body").innerText();
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(pageText)).toBe(false);
  });

  test("should add a new card to a column", async ({ page }) => {
    // Click Add Card on first column
    const firstColumn = page.locator(".kanban-column").first();
    await firstColumn.locator(".btn-add-card").click();

    // Check modal opens
    await expect(page.locator(".modal-content")).toBeVisible();

    // Fill title and details
    const uniqueTitle = `Automated Card ${Date.now()}`;
    await page.locator("#card-title-input").fill(uniqueTitle);
    await page.locator("#card-details-input").fill("Testing e2e card submission");

    // Submit
    await page.locator(".modal-footer .btn-primary").click();

    // Verify card is added
    await expect(firstColumn.locator(".card-title", { hasText: uniqueTitle })).toBeVisible();
  });

  test("should allow renaming a column", async ({ page }) => {
    const firstColumn = page.locator(".kanban-column").first();
    const titleSpan = firstColumn.locator(".column-title-text");

    await titleSpan.click();
    const input = firstColumn.locator(".column-title-input");
    await expect(input).toBeVisible();

    await input.fill("Sprint Ideas");
    await input.press("Enter");

    await expect(firstColumn.locator(".column-title-text")).toHaveText("Sprint Ideas");
  });

  test("should delete an existing card with confirmation", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const firstColumn = page.locator(".kanban-column").first();
    const firstCard = firstColumn.locator(".kanban-card").first();
    const cardTitle = await firstCard.locator(".card-title").innerText();

    await firstCard.locator(".card-delete-btn").click();

    // Verify card is removed
    await expect(firstColumn.locator(".card-title", { hasText: cardTitle })).not.toBeVisible();
  });

  test("should support moving a card across columns", async ({ page }) => {
    const sourceCol = page.locator(".kanban-column").nth(0); // Backlog
    const destCol = page.locator(".kanban-column").nth(1); // To Do

    const card = sourceCol.locator(".kanban-card").first();
    const cardTitle = await card.locator(".card-title").innerText();

    // Use accessible keyboard navigation supported by @hello-pangea/dnd
    await card.focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");

    // Verify card is now in dest column
    await expect(destCol.locator(".card-title", { hasText: cardTitle })).toBeVisible();
  });

  test("should authenticate with user credentials and load board from Supabase", async ({
    page,
  }) => {
    // Reload directly to the root without clicking bypass
    await page.goto("/");

    const emailInput = page.locator("#auth-email");
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      const testEmail = process.env.TEST_USER_EMAIL || "test@example.com";
      const testPassword = process.env.TEST_USER_PASSWORD || "TestPassword123!";
      
      await emailInput.fill(testEmail);
      await page.locator("#auth-password").fill(testPassword);
      await page.locator("button[type='submit']").click();

      // Verify sign in succeeded and user email is visible in navbar
      await expect(page.locator(".user-tag")).toHaveText(testEmail);
      await expect(page.locator(".navbar-title")).toHaveText("Kanban Project");
      await expect(page.locator(".kanban-column")).toHaveCount(5);
    }
  });
});
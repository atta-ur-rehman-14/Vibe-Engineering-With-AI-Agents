import { expect, test } from "@playwright/test";

test("renders the seeded board", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product launch plan" })).toBeVisible();
  await expect(page.getByText("Interview early adopters")).toBeVisible();
  await expect(page.locator(".column")).toHaveCount(5);
});

test("renames a column, adds a card, and deletes it", async ({ page }) => {
  await page.goto("/");
  const backlog = page.getByRole("region", { name: "Backlog" });
  const title = backlog.getByRole("textbox", { name: "Rename Backlog column" });
  await title.fill("Ideas");
  await title.blur();
  await expect(page.getByRole("region", { name: "Ideas" })).toBeVisible();

  await page.getByRole("button", { name: "Add card" }).first().click();
  await page.getByRole("textbox", { name: "New card title for Ideas" }).fill("Map the first release");
  await page.getByRole("textbox", { name: "Card details" }).fill("Keep the scope focused.");
  await backlog.locator("form").getByRole("button", { name: "Add card" }).click();
  await expect(page.getByText("Map the first release")).toBeVisible();

  await page.getByRole("button", { name: "Delete Map the first release" }).click();
  await expect(page.getByText("Map the first release")).toHaveCount(0);
});

test("shows validation for a blank card title", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add card" }).first().click();
  await page.getByRole("button", { name: "Add card" }).last().click();
  await expect(page.getByText("Add a title to create this card.")).toBeVisible();
});

test("moves a card to another column and remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product launch plan" })).toBeVisible();
  await page.getByText("Polish homepage copy").dragTo(page.getByRole("region", { name: "Done" }));
  await expect(page.getByRole("region", { name: "Done" }).getByText("Polish homepage copy")).toBeVisible();
});
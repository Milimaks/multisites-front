import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.getByPlaceholder("m@example.com").click();
  await page.getByPlaceholder("m@example.com").fill("maxime.faure93@gmail.com");
  await page.getByPlaceholder("m@example.com").press("Tab");
  await page.getByRole("link", { name: "Forgot your password?" }).press("Tab");
  await page.getByLabel("Password").fill("test1234");

  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page.getByText("le mot de passe est invalide.")).toBeVisible();
  await page.getByLabel("Password").fill("test123");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Créer un design" })
  ).toBeVisible();
});

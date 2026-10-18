import { expect, test } from "@playwright/test";

const historyFile = {
  name: "portfolio-history.csv",
  mimeType: "text/csv",
  buffer: Buffer.from([
    "date,portfolio_value,benchmark_value",
    "2025-01-01,100,100",
    "2025-01-02,110,105",
    "2025-01-03,99,99.75",
    "2025-01-04,108.9,104.7375",
  ].join("\n")),
};

test("imports portfolio history and shows portfolio and benchmark risk metrics", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Neptune — Personal Portfolio");
  await page.getByRole("button", { name: "Analytics" }).click();
  await page.getByLabel("History CSV").setInputFiles(historyFile);
  await expect(page.getByText("Historical data loaded", { exact: true })).toBeVisible();
  await expect(page.getByText("ANNUALIZED VOLATILITY", { exact: true })).toBeVisible();
  await expect(page.getByText("MAX DRAWDOWN", { exact: true })).toBeVisible();
  await expect(page.getByText("HISTORICAL 95% VAR", { exact: true })).toBeVisible();
  await expect(page.getByText("HISTORICAL 95% CVAR", { exact: true })).toBeVisible();
  await expect(page.getByText("BETA VS BENCHMARK", { exact: true })).toBeVisible();
  await expect(page.locator(".risk-metrics .panel").filter({ hasText: "MAX DRAWDOWN" }).locator("strong")).toHaveText("-10.00%");
  await expect(page.locator(".risk-metrics .panel").filter({ hasText: "HISTORICAL 95% VAR" }).locator("strong")).toHaveText("10.00%");
  await expect(page.locator(".risk-metrics .panel").filter({ hasText: "ANNUALIZED VOLATILITY" }).locator("strong")).toHaveText("183.30%");
  await expect(page.locator(".risk-metrics .panel").filter({ hasText: "BETA VS BENCHMARK" }).locator("strong")).toHaveText("2.00");
  await expect(page.locator(".risk-metrics .panel").filter({ hasText: "PORTFOLIO RETURN" }).locator("strong")).toHaveText("8.90%");
  await page.reload();
  await page.getByRole("button", { name: "Analytics" }).click();
  await expect(page.getByText("Historical data loaded", { exact: false })).toBeVisible();
});

test("rejects malformed portfolio history with a clear message", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Analytics" }).click();
  await page.getByLabel("History CSV").setInputFiles({
    name: "bad.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("date,price\n2025-01-01,100\n2025-01-02,101\n2025-01-03,102"),
  });
  await expect(page.getByText("CSV needs date,portfolio_value columns", { exact: false })).toBeVisible();
});

import { test, expect } from '@playwright/test';

test.describe('Waterfall Break Scheduler', () => {

  test('page loads with correct title and header', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Waterfall Break Scheduler');
    await expect(page.locator('h1')).toContainText('Waterfall Break Scheduler');
  });

  test('shift configuration is visible with default values', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Shift Details' })).toBeVisible();

    // Global shift time inputs are the first two
    const shiftStart = page.locator('input[type="time"]').first();
    await expect(shiftStart).toHaveValue('18:30');

    const shiftEnd = page.locator('input[type="time"]').nth(1);
    await expect(shiftEnd).toHaveValue('05:00');

    await expect(page.getByText('10h 30m')).toBeVisible();
  });

  test('spacing slider defaults to 45 minutes', async ({ page }) => {
    await page.goto('/');
    const slider = page.locator('input[type="range"]').nth(1);
    await expect(slider).toHaveValue('45');
    await expect(page.getByText('45m')).toBeVisible();
  });

  test('three default employees are shown', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible();
    await expect(page.locator('input[value="Alice"]')).toBeVisible();
    await expect(page.locator('input[value="Bob"]')).toBeVisible();
    await expect(page.locator('input[value="Charlie"]')).toBeVisible();
  });

  test('each employee has 2 rest breaks and 1 lunch break', async ({ page }) => {
    await page.goto('/');
    const restPills = page.locator('span.capitalize:text("rest")');
    const lunchPills = page.locator('span.capitalize:text("lunch")');
    await expect(restPills).toHaveCount(6);
    await expect(lunchPills).toHaveCount(3);
  });

  test('can add a new employee', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("+ Add Employee")');
    await expect(page.locator('input[value="Employee 4"]')).toBeVisible();
  });

  test('can remove an employee', async ({ page }) => {
    await page.goto('/');
    await page.locator('button:text("Remove")').first().click();
    await expect(page.locator('input[value="Alice"]')).toHaveCount(0);
    await expect(page.locator('input[value="Bob"]')).toBeVisible();
    await expect(page.locator('input[value="Charlie"]')).toBeVisible();
  });

  test('shows empty state before generating schedule', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('No Schedule Generated')).toBeVisible();
  });

  test('generates schedule and shows timeline', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Generate Schedule")');

    await expect(page.getByText('No Schedule Generated')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Floor Coverage' })).toBeVisible();
  });

  test('can switch between timeline and table views', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Generate Schedule")');

    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();

    await page.locator('button:text("Table")').click();
    await expect(page.getByRole('heading', { name: 'Schedule Table' })).toBeVisible();

    await expect(page.locator('td').filter({ hasText: 'Alice' }).first()).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'Bob' }).first()).toBeVisible();
  });

  test('schedule table shows correct break types', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Generate Schedule")');
    await page.locator('button:text("Table")').click();

    const restBadges = page.locator('td span:text("rest")');
    const lunchBadges = page.locator('td span:text("lunch")');
    expect(await restBadges.count()).toBeGreaterThan(0);
    expect(await lunchBadges.count()).toBeGreaterThan(0);
  });

  test('coverage chart is displayed after generation', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Generate Schedule")');
    await expect(page.getByRole('heading', { name: 'Floor Coverage' })).toBeVisible();
    const bars = page.locator('[class*="bg-brand-400"], [class*="bg-amber-400"]');
    expect(await bars.count()).toBeGreaterThan(0);
  });

  test('clear button removes results', async ({ page }) => {
    await page.goto('/');
    await page.click('button:text("Generate Schedule")');
    await expect(page.getByRole('heading', { name: 'Floor Coverage' })).toBeVisible();

    await page.click('button:text("Clear")');
    await expect(page.getByText('No Schedule Generated')).toBeVisible();
  });

  test('can add preferred and avoid times', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Preferred Break Times')).toBeVisible();

    const timeInputsBefore = await page.locator('input[type="time"]').count();
    await page.click('text=+ Add preferred time');
    const timeInputsAfterPref = await page.locator('input[type="time"]').count();
    expect(timeInputsAfterPref).toBeGreaterThan(timeInputsBefore);

    await page.click('text=+ Add time to avoid');
    const timeInputsAfterAvoid = await page.locator('input[type="time"]').count();
    expect(timeInputsAfterAvoid).toBeGreaterThan(timeInputsAfterPref);
  });

  test('can adjust break duration', async ({ page }) => {
    await page.goto('/');
    const durationInput = page.locator('.rounded-full input[type="number"]').first();
    await expect(durationInput).toHaveValue('15');

    await durationInput.fill('20');
    await expect(durationInput).toHaveValue('20');
  });

  test('can change shift times and see updated duration', async ({ page }) => {
    await page.goto('/');
    const shiftStart = page.locator('input[type="time"]').first();
    await shiftStart.fill('09:00');

    const shiftEnd = page.locator('input[type="time"]').nth(1);
    await shiftEnd.fill('17:00');

    await expect(page.getByText('8h')).toBeVisible();
  });

  test('responsive: page renders without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(380);
  });

  test('full workflow: configure and generate overnight shift', async ({ page }) => {
    await page.goto('/');

    await page.click('text=+ Add preferred time');
    await page.click('button:text("Generate Schedule")');

    await expect(page.getByRole('heading', { name: 'Floor Coverage' })).toBeVisible();

    await page.locator('button:text("Table")').click();
    await expect(page.getByRole('heading', { name: 'Schedule Table' })).toBeVisible();

    await expect(page.locator('td').filter({ hasText: 'Alice' }).first()).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'Bob' }).first()).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'Charlie' }).first()).toBeVisible();
  });

  // === NEW: Military time toggle tests ===

  test('military time toggle button is visible and defaults to 12H', async ({ page }) => {
    await page.goto('/');
    const toggleBtn = page.locator('button[aria-label="Toggle military time"]');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toContainText('12H');
  });

  test('clicking toggle switches to 24H mode', async ({ page }) => {
    await page.goto('/');
    const toggleBtn = page.locator('button[aria-label="Toggle military time"]');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('24H');
  });

  test('24H mode shows military time in schedule table', async ({ page }) => {
    await page.goto('/');
    // Switch to 24H
    await page.locator('button[aria-label="Toggle military time"]').click();
    // Generate and go to table
    await page.click('button:text("Generate Schedule")');
    await page.locator('button:text("Table")').click();

    // In 24H mode, times should NOT have AM/PM
    const tableText = await page.locator('table').textContent();
    expect(tableText).not.toMatch(/AM|PM/);
  });

  test('12H mode shows AM/PM in schedule table', async ({ page }) => {
    await page.goto('/');
    // Ensure 12H (default)
    await page.click('button:text("Generate Schedule")');
    await page.locator('button:text("Table")').click();

    // In 12H mode, times should have AM or PM
    const tableText = await page.locator('table').textContent();
    expect(tableText).toMatch(/AM|PM/);
  });

  // === NEW: Per-employee shift time tests ===

  test('each employee has shift start and end time inputs', async ({ page }) => {
    await page.goto('/');
    // Each employee card has its own Start/End inputs
    // "uses global shift" text appears once per employee by default
    const globalShiftTexts = page.getByText('uses global shift');
    await expect(globalShiftTexts).toHaveCount(3);
  });

  test('employee shift times default to empty (uses global shift)', async ({ page }) => {
    await page.goto('/');
    // All employee shift time inputs should be empty by default
    await expect(page.getByText('uses global shift').first()).toBeVisible();
  });

  test('can set per-employee shift start time', async ({ page }) => {
    await page.goto('/');
    // Find the first employee's shift start input (3rd time input overall: global start, global end, then emp1 start)
    const empShiftStart = page.locator('input[type="time"]').nth(2);
    await empShiftStart.fill('19:00');
    await expect(empShiftStart).toHaveValue('19:00');

    // "uses global shift" should no longer appear for this employee
    // Instead should show duration
    // The first employee card should now show a duration instead of "uses global shift"
    const firstEmpCard = page.locator('.rounded-lg.border.border-gray-200.bg-gray-50\\/50').first();
    await expect(firstEmpCard.locator('text=uses global shift')).toHaveCount(0);
  });

  test('can reset per-employee shift time back to global', async ({ page }) => {
    await page.goto('/');
    // Set a custom shift time for Alice
    const empShiftStart = page.locator('input[type="time"]').nth(2);
    await empShiftStart.fill('19:00');

    // "uses global shift" should now only appear for Bob and Charlie (2 total)
    await expect(page.getByText('uses global shift')).toHaveCount(2);

    // Click the reset button that appeared
    await page.locator('button:text("reset")').first().click();

    // Should show "uses global shift" for all 3 again
    await expect(page.getByText('uses global shift')).toHaveCount(3);
  });

  test('per-employee shift times work with schedule generation', async ({ page }) => {
    await page.goto('/');
    // Set Alice to start at 19:00
    const empShiftStart = page.locator('input[type="time"]').nth(2);
    await empShiftStart.fill('19:00');

    // Generate schedule
    await page.click('button:text("Generate Schedule")');

    // Should still generate successfully
    await expect(page.getByRole('heading', { name: 'Floor Coverage' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Timeline' })).toBeVisible();
  });
});

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 480, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto("https://mania-tracker.com/player/NUTTOBELT2/skills", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "skills.png", fullPage: true });
  await browser.close();
})();

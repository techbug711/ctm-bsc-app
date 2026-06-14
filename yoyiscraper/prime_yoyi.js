const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // This folder will save your login session (cookies, local storage, etc.)
  const userDataDir = path.join(__dirname, 'yoyi-session-profile');
  
  console.log('🚀 Launching browser...');
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // MUST be false so you can see it
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await context.newPage();
  
  console.log('🌐 Navigating to Yoyi Login...');
  await page.goto('https://station-site.jtexpress.my');

  console.log('\n--- ACTION REQUIRED ---');
  console.log('1. Log in manually in the browser window.');
  console.log('2. Solve the sliding puzzle captcha if it appears.');
  console.log('3. Once you are fully logged in and see the dashboard, come back here.');
  console.log('------------------------\n');

  // Keep the browser open until you manually close it or press Ctrl+C in the terminal
  console.log('Waiting for you to finish logging in... Close the browser window when done.');
  
  // We wait for the browser to be closed manually
  await new Promise((resolve) => {
    context.on('close', resolve);
  });

  console.log('✅ Session captured successfully in the "yoyi-session-profile" folder.');
})();

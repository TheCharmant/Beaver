const { chromium } = require('playwright');

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:3001';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    console.log('Opening login...');
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' });

    // Fill and submit login form (stores email in localStorage)
    await page.fill('input[name="email"]', 'test.user@example.com');
    await page.click('.auth-submit');
    await page.waitForTimeout(300); // allow localStorage to be written

    console.log('Navigating to onboarding...');
    await page.goto(`${base}/onboarding`, { waitUntil: 'networkidle' });

    // Check helper text and disabled email
    await page.waitForSelector('.email-helper', { timeout: 5000 });
    const helper = await page.textContent('.email-helper');
    const disabled = await page.$eval('.profile-field input[type="email"]', (el) => el.disabled);

    if (!helper || !helper.includes('This email is linked to your BEAVER account')) {
      throw new Error('Helper text missing');
    }
    if (!disabled) throw new Error('Email input is not disabled');
    console.log('Profile email helper present and input disabled — OK');

    // Step 1: click elements for required checkboxes to toggle React state
    await page.evaluate(()=>{
      const texts = [
        'I certify that the information provided is accurate.',
        'I authorize BEAVER to verify the information and documents provided.',
        "I understand that BEAVER provides ethical mentoring and technical support, and I remain responsible for complying with my institution's academic policies."
      ];
      texts.forEach(text => {
        const el = Array.from(document.querySelectorAll('*')).find(n => n.textContent && n.textContent.trim() === text);
        if (el) el.click();
      });
    });
    // try click Continue (if enabled)
    try { await page.click('button:has-text("Continue")'); } catch(e) { await page.evaluate(()=>{ const n = document.querySelector('.nav-next'); if (n && !n.disabled) n.click(); }); }
    await page.waitForTimeout(300);

    // Step 2: fill project info
    const titleSelector = 'input[placeholder="Enter your approved research or capstone title"], input[placeholder*="approved research"], input[placeholder*="project title"]';
    try { await page.fill(titleSelector, 'Test Project Title'); } catch(e) { /* fallback */ try { await page.fill('input[type="text"]', 'Test Project Title'); } catch(_) {} }
    // click approval button with 'Yes' text
    await page.evaluate(()=>{ const yes = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Yes')); if (yes) yes.click(); });
    // choose first non-empty select option
    await page.evaluate(()=>{
      const sel = document.querySelector('select');
      if (sel) {
        for (let i=0;i<sel.options.length;i++){ if (sel.options[i].value){ sel.selectedIndex = i; sel.dispatchEvent(new Event('change',{bubbles:true})); break; } }
      }
    });
    try { await page.click('button:has-text("Continue")'); } catch(e) { await page.evaluate(()=>{ const n = document.querySelector('.nav-next'); if (n && !n.disabled) n.click(); }); }
    await page.waitForTimeout(300);

    // Step 3: choose Research Package (robust)
    try { await page.click('button:has-text("Research Package")'); } catch(e) {
      await page.evaluate(()=>{
        const svc = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('Research Package'));
        if (svc) svc.click();
      });
    }
    await page.waitForTimeout(400);
    // debug: log which buttons are selected
    const selState = await page.evaluate(()=> Array.from(document.querySelectorAll('button')).map(b=>({ text: b.textContent.trim(), classes: b.className, ariaPressed: b.getAttribute('aria-pressed') })) );
    console.log('BUTTON_SELECTION_STATE:', JSON.stringify(selState, null, 2));
    // Fill additional service details (budget, decision maker, adviser, reason) using Playwright actions
    const selectCount = await page.$$eval('select', s => s.length);
    for (let i=0;i<selectCount;i++){
      try { await page.selectOption(`select:nth-of-type(${i+1})`, { index: 1 }); } catch(e) { /*ignore*/ }
    }
    // click a reason button
    try { await page.click('button:has-text("Need technical guidance")'); } catch(e) { try { await page.click('button:has-text("Tight deadline")'); } catch(_) {} }
    // fill textarea
    try { await page.fill('textarea', 'Test details'); } catch(e) {}
    // check the consultation checkbox (if present)
    try {
      const cb = await page.$('label.check-line input[type="checkbox"]');
      if (cb) await cb.check();
    } catch(e) {}
    await page.waitForTimeout(400);
    const contDisabled = await page.evaluate(()=>{ const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent && x.textContent.includes('Continue')); return b ? !!b.disabled : null; });
    console.log('CONTINUE_DISABLED_AFTER_SERVICES:', contDisabled);
    try { await page.click('button:has-text("Continue")'); } catch(e) { await page.evaluate(()=>{ const n = document.querySelector('.nav-next'); if (n && !n.disabled) n.click(); }); }
    await page.waitForTimeout(300);

    // Step 4: confirm commitment by clicking the matching element
    await page.evaluate(()=>{
      const text = 'I understand that an approved quotation may require a consultation and that a verified initial payment is required before a project workspace is created.';
      const el = Array.from(document.querySelectorAll('*')).find(n => n.textContent && n.textContent.includes('I understand that an approved quotation'));
      if (el) el.click();
    });
    await page.evaluate(()=>{ const b = Array.from(document.querySelectorAll('button')).find(x=>x.textContent && x.textContent.includes('Continue')); if (b && !b.disabled) { b.click(); return; } const n = document.querySelector('.nav-next'); if (n && !n.disabled) n.click(); });
    await page.waitForTimeout(300);

    // Step 5: add required documents (Research Package)
    const docs = [
      'Approved Title Document',
      'Research Proposal',
      'Current Research Manuscript',
      'School Template',
      'Rubrics',
      'Adviser/Panel Comments',
    ];
    for (const d of docs) {
      await page.evaluate((dtext) => { const btn = Array.from(document.querySelectorAll('*')).find(n=>n.textContent && n.textContent.includes(dtext)); if (btn) btn.click(); }, d);
      await page.waitForTimeout(100);
    }
    try { await page.click('button:has-text("Continue")'); } catch(e) { await page.evaluate(()=>{ const n = document.querySelector('.nav-next'); if (n && !n.disabled) n.click(); }); }
    await page.waitForTimeout(300);

    // Step 6: Review — dump review content then assert edit links exist
    const reviewText = await page.evaluate(()=>{
      const el = document.querySelector('.form-content');
      return el ? el.innerText.slice(0,2000) : '';
    });
    console.log('REVIEW_SNIPPET:', reviewText);
    const editCount = await page.$$eval('.edit-link', els => els.length);
    // debug dump if missing
    if (editCount < 1) {
      const buttons = await page.$$eval('button', btns => btns.map(b => ({ text: b.textContent.trim(), className: b.className })));
      console.log('BUTTONS_ON_REVIEW:', JSON.stringify(buttons, null, 2));
      const html = await page.evaluate(()=>document.querySelector('.form-content')?.outerHTML || document.body.outerHTML.slice(0,2000));
      console.log('FORM_CONTENT_HTML_SNIPPET:', html.slice(0,2000));
      throw new Error('Edit links missing on Review page');
    }
    console.log('Review page has edit links — OK');

    console.log('All checks passed');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('TEST_ERROR', err.message);
    await browser.close();
    process.exit(2);
  }
})();

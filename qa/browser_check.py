import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1100},device_scale_factor=1)
 page=context.new_page(); errors=[];console=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 page.on('console',lambda msg:console.append(msg.text) if msg.type=='error' else None)
 page.goto('http://127.0.0.1:4177');page.locator('.stop-card').first.wait_for()
 assert page.locator('.stop-card').count()==3
 assert page.get_by_text('SAMPLE MODE',exact=True).is_visible()
 page.screenshot(path=str(ROOT/'desktop.png'),full_page=True)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.locator('#save-plan').click();page.locator('#saved-tab').click();assert page.locator('.saved-card').count()==1
 page.reload();page.locator('.stop-card').first.wait_for();page.locator('#saved-tab').click();assert page.locator('.saved-card').count()==1
 page.get_by_role('button',name='Open night').click();assert page.locator('#save-plan').inner_text()=='♥ Saved'
 old=page.locator('.stop-card h4').first.inner_text();page.locator('[data-swap="0"]').click();assert page.locator('#swap-dialog').is_visible();page.locator('.alternative').first.click();assert page.locator('.stop-card h4').first.inner_text()!=old
 page.locator('#save-plan').click();page.locator('#saved-tab').click();page.get_by_role('button',name='Open night').click();assert page.locator('.stop-card h4').first.inner_text()!=old
 with page.expect_download() as download:page.locator('#export-plan').click()
 download.value.save_as(str(ROOT/'export-test.txt'))
 assert 'FICTIONAL SAMPLE' in (ROOT/'export-test.txt').read_text()
 page.locator('.add-taste').first.click();assert page.locator('#taste-dialog').is_visible();page.keyboard.press('Escape');assert not page.locator('#taste-dialog').is_visible()
 page.locator('.add-taste').first.click();page.locator('[data-taste="nature"]').click();page.get_by_role('button',name='Looks like me').click();assert 'Mary Oliver' in page.locator('#tastes-a').inner_text()
 page.locator('#budget').fill('50');page.locator('#budget').dispatch_event('input');page.locator('#generate').click();page.wait_for_function("document.querySelector('#generate').disabled === false");assert int(page.locator('.budget-summary strong').inner_text().strip('$'))<=50
 # Clear profile and verify the error leaves the existing plan visible.
 while page.locator('#tastes-a button').count():page.locator('#tastes-a button').first.click()
 page.locator('#generate').click();page.locator('#form-error:not(.hidden)').wait_for();assert 'one and five' in page.locator('#form-error').inner_text();assert page.locator('.stop-card').count()==3
 page.locator('#source-button').click();assert page.locator('#use-live').is_disabled();assert 'not connected' in page.locator('#connection-status').inner_text();page.keyboard.press('Escape')
 page.locator('#saved-tab').click();page.get_by_role('button',name='Remove saved night').click();assert page.locator('.saved-card').count()==0;assert page.locator('.empty-saved').is_visible()
 # Fresh mobile run and several modal sizes.
 mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True).new_page();mobile.on('pageerror',lambda error:errors.append(str(error)));mobile.goto('http://127.0.0.1:4177');mobile.locator('.stop-card').first.wait_for();assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth')
 mobile.screenshot(path=str(ROOT/'mobile.png'),full_page=True)
 mobile.locator('.add-taste').first.click();assert mobile.locator('#taste-dialog').is_visible();assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth');mobile.screenshot(path=str(ROOT/'mobile-tastes.png'));mobile.keyboard.press('Escape')
 for width in [320,768,1024]:
  page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow {width}'
 assert not errors,errors;assert not console,console
 results={'passed':['initial plan','sample disclosure','save','save survives reload','open saved','swap','save edited plan','export','modal Escape/reopen','taste change','budget enforcement','empty taste error preserves result','live missing-credential state','remove saved','mobile rendering','320/390/768/1024/1440 widths without horizontal overflow'],'pageErrors':errors,'consoleErrors':console}
 (ROOT/'browser-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2));browser.close()

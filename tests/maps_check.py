import asyncio, sys
from playwright.async_api import async_playwright
BASE="http://localhost:8765/index.html#/kort"
MOCK=open('/home/claude/tests/mock-maps.js').read()
def cfg(key): return f"export const config = {{ googleMapsApiKey: '{key}', googleMapsMapId: '' }};"
async def scenario(b, name, key=None, maps='mock', vp={"width":390,"height":844}):
    ctx=await b.new_context(viewport=vp); page=await ctx.new_page(); errs=[]
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.on("console", lambda m: m.type=="error" and errs.append(m.text))
    if key is not None:
        await page.route("**/js/config.js", lambda r: r.fulfill(body=cfg(key), content_type="text/javascript"))
    async def maps_route(r):
        if maps=='abort': await r.abort()
        else: await r.fulfill(body=MOCK, content_type="text/javascript")
    await page.route("https://maps.googleapis.com/**", maps_route)
    await page.goto(BASE); await page.wait_for_timeout(600)
    g=await page.is_visible("#gmap"); dk=await page.is_visible("#dk-map")
    status=(await page.inner_text("#map-status")).strip()
    out=[name, f"gmap={g}", f"fallback={dk}", status[:70]]
    if g:
        await page.click("[data-mock-marker='Gudenåen']"); await page.wait_for_timeout(100)
        out.append("detail="+(await page.inner_text("#spot-detail h3")))
        out.append("listPressed="+(await page.get_attribute(".spot-row[data-spot-id='gudenaaen']","aria-pressed")))
        await page.click("[data-chip-value='Kyst']"); await page.wait_for_timeout(100)
        vis=await page.locator("[data-mock-marker]:visible").count(); out.append(f"kystVisible={vis}")
        await page.click(".spot-row[data-spot-id='oeresund']"); await page.wait_for_timeout(100)
        out.append("sel="+str(await page.get_attribute("[data-mock-marker='Øresund']","data-selected")))
        log=await page.evaluate("window.__mapsLog"); out.append("log="+str(log[:2])+"…"+str(log[-1]))
        # navigate away and back: no reload of script, still works
        await page.evaluate("location.hash='#/hjem'"); await page.wait_for_timeout(150)
        await page.evaluate("location.hash='#/kort'"); await page.wait_for_timeout(300)
        out.append("revisit gmap="+str(await page.is_visible("#gmap")))
        await page.screenshot(path=f"/home/claude/shots/maps-{name}.png")
    print(" | ".join(out)); 
    if errs: print("   ERR:", errs)
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        await scenario(b,"no-key",key="")
        await scenario(b,"mock-ok",key="TESTKEY")
        await scenario(b,"mock-desktop",key="TESTKEY",vp={"width":1440,"height":900})
        await scenario(b,"blocked",key="TESTKEY",maps='abort')
        await scenario(b,"bad-key",key="BAD")
        await b.close()
asyncio.run(main())

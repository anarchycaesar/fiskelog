import sys, asyncio, re
from playwright.async_api import async_playwright

BASE = "http://localhost:8765/index.html"
ROUTES = ["hjem", "fisk", "fangster", "kort", "grej", "profil", "ai", "design"]
OUT = sys.argv[1]

async def main():
    errors = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for name, vp in [("mobile", {"width": 390, "height": 844}), ("desktop", {"width": 1440, "height": 900})]:
            ctx = await b.new_context(viewport=vp, device_scale_factor=1)
            await ctx.route("https://maps.googleapis.com/**", lambda r: r.fulfill(body=open('/home/claude/tests/mock-maps.js').read(), content_type="text/javascript"))
            page = await ctx.new_page()
            page.on("console", lambda m: m.type in ("error", "warning") and errors.append(f"{name} console {m.type}: {m.text}"))
            page.on("pageerror", lambda e: errors.append(f"{name} pageerror: {e}"))
            page.on("requestfailed", lambda r: errors.append(f"{name} reqfail: {r.url}"))
            await page.goto(BASE + "#/hjem")
            await page.wait_for_timeout(400)
            for r in ROUTES:
                await page.evaluate(f"location.hash = '#/{r}'")
                await page.wait_for_timeout(250)
                title = await page.title()
                # horisontal overflow?
                ow = await page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if ow > 0: errors.append(f"{name} {r}: horizontal overflow {ow}px")
                # links skal pege på kendte ruter
                hrefs = await page.eval_on_selector_all("a[href]", "els => els.map(e => e.getAttribute('href'))")
                for h in hrefs:
                    if not re.fullmatch(r"#/(" + "|".join(ROUTES) + ")|#main", h):
                        errors.append(f"{name} {r}: bad href {h}")
                print(name, r, title, "links:", len(hrefs))
                await page.screenshot(path=f"{OUT}/{name}-{r}.png", full_page=True)
            # interaktioner
            await page.evaluate("location.hash = '#/fisk'"); await page.wait_for_timeout(200)
            await page.fill("#fish-search", "gedde"); await page.wait_for_timeout(100)
            print("search gedde ->", await page.locator("#fish-grid [data-fish-id]").count())
            await page.fill("#fish-search", "");
            await page.click("[data-chip-value='Saltvand']"); await page.wait_for_timeout(100)
            print("saltvand ->", await page.locator("#fish-grid [data-fish-id]").count())
            await page.click("#fish-grid [data-fish-id]"); await page.wait_for_timeout(350)
            print("modal open:", await page.locator("dialog.modal[open]").count())
            await page.screenshot(path=f"{OUT}/{name}-modal.png")
            await page.keyboard.press("Escape"); await page.wait_for_timeout(150)
            print("modal after esc:", await page.locator("dialog.modal").count())
            await page.evaluate("location.hash = '#/grej'"); await page.wait_for_timeout(200)
            await page.click("[data-gear-cat='agn']"); await page.wait_for_timeout(100)
            print("agn rows:", await page.locator("#gear-list .row").count(), "pressed:", await page.get_attribute("[data-chip-value='agn']", "aria-pressed"))
            await page.evaluate("location.hash = '#/profil'"); await page.wait_for_timeout(200)
            await page.click("[data-toggle='badges']"); await page.wait_for_timeout(100)
            print("all badges visible:", await page.is_visible("#all-badges"))
            await page.screenshot(path=f"{OUT}/{name}-profil-expanded.png", full_page=True)
            await page.evaluate("location.hash = '#/kort'"); await page.wait_for_timeout(200)
            await page.click("[data-chip-value='Å']"); await page.wait_for_timeout(100)
            print("pins Å:", await page.locator("#dk-pins .dk-pin").count())
            await page.evaluate("location.hash = '#/findesikke'"); await page.wait_for_timeout(200)
            print("unknown route ->", await page.evaluate("location.hash"))
            # nav-klik
            if name == "mobile":
                await page.click(".bottomnav__fab"); await page.wait_for_timeout(200)
                print("fab ->", await page.evaluate("location.hash"))
                await page.click(".avatar-chip"); await page.wait_for_timeout(200)
                print("avatar ->", await page.evaluate("location.hash"))
            else:
                await page.click(".sidebar__item--ai"); await page.wait_for_timeout(200)
                print("sidebar ai ->", await page.evaluate("location.hash"))
            await ctx.close()
        await b.close()
    print("\nERRORS:" if errors else "\nNo errors")
    for e in errors: print(" -", e)

asyncio.run(main())

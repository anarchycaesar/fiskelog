"""End-to-end test af fangstflowet. Kør: python3 -I catch_check.py <screenshot-mappe>"""
import asyncio, sys, datetime
from playwright.async_api import async_playwright

BASE = "http://localhost:8765/index.html"
OUT = sys.argv[1]
fails, notes = [], []

def check(cond, msg):
    (notes if cond else fails).append(("ok   " if cond else "FAIL ") + msg)

async def text(page, sel):
    return (await page.inner_text(sel)).strip()

async def run(b, label, vp, no_storage=False):
    ctx = await b.new_context(viewport=vp)
    if no_storage:
        await ctx.add_init_script("""
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
        """)
    await ctx.route("https://maps.googleapis.com/**", lambda r: r.fulfill(body=open('/home/claude/tests/mock-maps.js').read(), content_type="text/javascript"))
    page = await ctx.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
    page.on("console", lambda m: m.type == "error" and errs.append(f"console: {m.text}"))
    page.on("requestfailed", lambda r: errs.append(f"reqfail: {r.url}"))
    p = lambda name: f"[{label}] {name}"

    # --- tom start, ingen "Mads" nogen steder ---
    await page.goto(BASE + "#/hjem"); await page.wait_for_timeout(300)
    check(await text(page, "h1") == "Hjem", p("hjem hedder Hjem"))
    for route in ["hjem", "fisk", "fangster", "kort", "grej", "profil", "ai", "design"]:
        await page.evaluate(f"location.hash='#/{route}'"); await page.wait_for_timeout(120)
        body = await page.inner_text("body")
        check("Mads" not in body and "Nielsen" not in body, p(f"{route}: ingen rester af Mads"))
        ow = await page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        check(ow <= 0, p(f"{route}: ingen vandret overflow"))
    await page.evaluate("location.hash='#/profil'"); await page.wait_for_timeout(150)
    check("Marcus" in await text(page, ".profile-summary"), p("profil viser Marcus"))
    check("Ingen fangster endnu" in await text(page, ".profile-summary"), p("profil: nul aktivitet"))
    check(await page.locator(".badge.is-locked").count() >= 4 and await page.locator(".badge:not(.is-locked)").count() == 0, p("alle badges er låste"))
    await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
    check("Ingen fangster endnu" in await text(page, "#main"), p("fangster: tom tilstand"))
    await page.evaluate("location.hash='#/fisk'"); await page.wait_for_timeout(150)
    check(await page.locator(".fish-card.is-locked").count() == 9, p("fisk: alle 9 arter er låste"))
    check("0 af 9" in await text(page, ".progress__head"), p("fisk: samling 0 af 9"))

    # --- formular: validering ---
    await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
    await page.click("[data-new-catch]"); await page.wait_for_timeout(300)
    check(await page.locator("dialog.modal[open]").count() == 1, p("formular åbner"))
    today = await page.input_value("#catch-date")
    check(len(today) == 10, p(f"dato er forudfyldt ({today})"))
    await page.click("button[type=submit]"); await page.wait_for_timeout(150)
    check(await page.locator("dialog.modal[open]").count() == 1, p("tom formular lukker ikke"))
    check("Vælg en art" in await text(page, "#catch-fishId-error") and "længden" in await text(page, "#catch-cm-error"), p("fejl på art og længde"))
    check(await page.evaluate("document.activeElement.id") == "catch-fishId", p("fokus på første fejlfelt"))
    check(await page.get_attribute("#catch-cm", "aria-invalid") == "true", p("aria-invalid sat"))
    tomorrow = (datetime.date.fromisoformat(today) + datetime.timedelta(days=1)).isoformat()
    await page.select_option("#catch-fishId", "gedde")
    await page.fill("#catch-cm", "abc"); await page.click("button[type=submit]"); await page.wait_for_timeout(100)
    check("mellem 1 og 300" in await text(page, "#catch-cm-error"), p("tekst i længdefelt afvises"))
    await page.fill("#catch-cm", "0"); await page.fill("#catch-kg", "900"); await page.fill("#catch-date", tomorrow)
    await page.click("button[type=submit]"); await page.wait_for_timeout(150)
    check("mellem 1 og 300" in await text(page, "#catch-cm-error"), p("længde 0 afvises"))
    check("0,01 og 500" in await text(page, "#catch-kg-error"), p("vægt 900 afvises"))
    check("fremtiden" in await text(page, "#catch-date-error"), p("fremtidig dato afvises"))
    check(await page.locator(".field__error:not([hidden])").count() == 3, p("præcis 3 fejl vises"))
    await page.screenshot(path=f"{OUT}/{label}-form-errors.png")

    # --- gem første fangst ---
    await page.fill("#catch-cm", "84,5"); await page.fill("#catch-kg", "4.8"); await page.fill("#catch-date", today)
    await page.fill("#catch-place", "Buresø"); await page.fill("#catch-note", "Gul shad <b>fint</b> i vegetationen")
    await page.click("button[type=submit]"); await page.wait_for_timeout(400)
    check(await page.locator("dialog.modal").count() == 0, p("formular lukker efter gem"))
    check("Ny art i samlingen: Gedde" in await text(page, "#toast"), p("toast: ny art"))
    check(await page.locator(".toast.is-visible").count() == 1, p("toast er synlig"))
    check(await page.locator("[data-catch-id]").count() == 1, p("fangst vises på siden uden at skifte side"))
    check("84,5 cm" in await text(page, "[data-catch-id]"), p("længde formateret med komma"))
    check("Ingen fangster endnu" not in await text(page, "#main"), p("tom tilstand er væk"))
    await page.screenshot(path=f"{OUT}/{label}-catches.png", full_page=True)

    # --- afledte tal ---
    await page.evaluate("location.hash='#/fisk'"); await page.wait_for_timeout(150)
    check("1 af 9" in await text(page, ".progress__head"), p("samling 1 af 9"))
    gedde = page.locator("[data-fish-id='gedde']")
    check("84,5 cm" in await gedde.inner_text() and "4,8" in await gedde.inner_text(), p("gedde-kort viser rekord"))
    check(await page.locator(".fish-card.is-locked").count() == 8, p("8 arter stadig låste"))
    await gedde.click(); await page.wait_for_timeout(250)
    check("Fangst" in await text(page, "dialog.modal"), p("artsdetalje viser antal fangster"))
    await page.keyboard.press("Escape"); await page.wait_for_timeout(150)

    # --- to flere fangster: mindre gedde (ingen ny rekord) + ny, større ---
    await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
    for fish_id, cm, kg in [("gedde", "60", "1.9"), ("aborre", "38", "")]:
        await page.click("[data-new-catch]"); await page.wait_for_timeout(250)
        await page.select_option("#catch-fishId", fish_id); await page.fill("#catch-cm", cm); await page.fill("#catch-kg", kg)
        await page.click("button[type=submit]"); await page.wait_for_timeout(300)
    check("Aborre på 38 cm er gemt" in await text(page, "#toast") or "Ny art i samlingen: Aborre" in await text(page, "#toast"), p("toast for aborre"))
    check(await page.locator("[data-catch-id]").count() == 3, p("fangster viser 3 fangster"))
    check(await text(page, "h1") == "Fangster", p("stadig på fangster efter gem"))
    await page.evaluate("location.hash='#/profil'"); await page.wait_for_timeout(150)
    check("3 fangster registreret" in await text(page, ".profile-summary"), p("profil: 3 fangster registreret"))
    rec = await text(page, ".record-card")
    check("Gedde" in rec and "84,5 cm" in rec, p("rekordkort = største gedde, ikke den mindre"))
    await page.screenshot(path=f"{OUT}/{label}-profil.png", full_page=True)

    # --- XSS: note vises som tekst ---
    await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
    await page.locator("[data-catch-id]").filter(has_text="84,5").click(); await page.wait_for_timeout(250)
    note = await text(page, ".catch-note")
    check("<b>fint</b>" in note and await page.locator(".catch-note b").count() == 0, p("note escapes (ingen HTML-injektion)"))
    await page.screenshot(path=f"{OUT}/{label}-detail.png")

    # --- sletning: annullér, derefter slet ---
    await page.click("[data-delete-start]"); await page.wait_for_timeout(100)
    check(await page.is_visible("[data-delete-confirm]") and not await page.is_visible("[data-delete-idle]"), p("bekræftelse vises"))
    check(await page.evaluate("document.activeElement.hasAttribute('data-delete-cancel')"), p("fokus på Annullér (sikreste valg)"))
    await page.click("[data-delete-cancel]"); await page.wait_for_timeout(100)
    check(await page.is_visible("[data-delete-idle]"), p("annullér går tilbage"))
    await page.click("[data-delete-start]"); await page.click("[data-delete-yes]"); await page.wait_for_timeout(350)
    check(await page.locator("dialog.modal").count() == 0, p("modal lukket efter sletning"))
    check(await page.locator("[data-catch-id]").count() == 2, p("fangst slettet fra listen"))
    check("slettet" in await text(page, "#toast"), p("toast: slettet"))
    await page.evaluate("location.hash='#/profil'"); await page.wait_for_timeout(150)
    rec = await text(page, ".record-card")
    check("Gedde" in rec and "60 cm" in rec, p("rekord falder tilbage til næststørste gedde"))

    # --- persistens ---
    if not no_storage:
        await page.reload(); await page.wait_for_timeout(400)
        await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
        check(await page.locator("[data-catch-id]").count() == 2, p("fangster overlever genindlæsning"))
        check("gemmes i denne browser" in await text(page, "#main"), p("note: lokal lagring"))
        # ødelagte data i storage må ikke vælte appen
        await page.evaluate("localStorage.setItem('fiskelog.catches.v1', '[{\"id\":\"x\",\"fishId\":\"findesikke\"},null,5,{\"id\":\"y\",\"fishId\":\"gedde\",\"cm\":50,\"date\":\"2026-01-02\"}]')")
        await page.reload(); await page.wait_for_timeout(400)
        await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
        check(await page.locator("[data-catch-id]").count() == 1, p("ødelagte poster sorteres fra, gyldig bevares"))
        await page.evaluate("localStorage.setItem('fiskelog.catches.v1', '{ikke json')")
        await page.reload(); await page.wait_for_timeout(400)
        check(await text(page, "h1") == "Fangster" and "Ingen fangster endnu" in await text(page, "#main"), p("ugyldig JSON: appen starter med tom liste"))
    else:
        await page.evaluate("location.hash='#/fangster'"); await page.wait_for_timeout(150)
        check("forsvinder" in await text(page, "#main"), p("uden lagring: note advarer"))
        check(await page.locator("[data-catch-id]").count() == 2, p("uden lagring virker appen stadig i hukommelsen"))

    # --- ingen fejl ---
    real = [e for e in errs if "favicon" not in e]
    check(not real, p(f"ingen konsol-/netværksfejl {real[:3]}"))
    await ctx.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        await run(b, "mobile", {"width": 390, "height": 844})
        await run(b, "desktop", {"width": 1440, "height": 900})
        await run(b, "nostorage", {"width": 390, "height": 844}, no_storage=True)
        await b.close()
    print("\n".join(notes)); print()
    print("\n".join(fails) if fails else f"ALLE {len(notes)} KONTROLLER BESTÅET")
    sys.exit(1 if fails else 0)

asyncio.run(main())

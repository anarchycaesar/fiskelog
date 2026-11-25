import asyncio, sys, json
from playwright.async_api import async_playwright
OUT=sys.argv[1]; fails=[]; MOCK=open('/home/claude/tests/mock-maps.js').read()
def ck(c,m): (None if c else fails.append(m)); print(("ok   " if c else "FAIL ")+m)
OSM={"elements":[
 {"type":"way","id":1,"center":{"lat":55.7900,"lon":12.4800},"tags":{"name":"Lyngby Sø","natural":"water","water":"lake"}},
 {"type":"way","id":2,"center":{"lat":55.8020,"lon":12.4150},"tags":{"name":"Furesøen","natural":"water","water":"lake"}},
 {"type":"way","id":3,"center":{"lat":55.7700,"lon":12.4300},"tags":{"name":"Mølleåen","waterway":"river"}},
 {"type":"node","id":4,"lat":55.6300,"lon":12.7000,"tags":{"name":"Saltholm","place":"island"}},
 {"type":"way","id":5,"center":{"lat":55.8100,"lon":12.4200},"tags":{"name":"Lille Pøl","natural":"water","water":"pond"}},
]}
async def run(b,label,vp,geo=True,overpass="ok",maps="mock",at=(55.80,12.41),osm=None):
    ctx=await b.new_context(viewport=vp,**({"geolocation":{"latitude":at[0],"longitude":at[1]},"permissions":["geolocation"]} if geo else {}))
    pg=await ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    async def ov(r):
        if overpass=="ok": await r.fulfill(body=json.dumps(OSM if osm is None else osm),content_type="application/json")
        else: await r.fulfill(status=500,body="x")
    await pg.route("**/overpass-api.de/**",ov)
    async def mp(r):
        if maps=="abort": await r.abort()
        else: await r.fulfill(body=MOCK,content_type="text/javascript")
    await pg.route("https://maps.googleapis.com/**",mp)
    await pg.goto("http://localhost:8765/index.html#/hjem"); await pg.wait_for_timeout(900)
    L=lambda m:f"[{label}] {m}"
    ck((await pg.inner_text("h1")).strip()=="Hjem",L("titel er Hjem"))
    bb=await pg.locator(".mini-map").bounding_box(); ck(0.33<=bb["height"]/vp["height"]<=0.62,L(f"kort fylder en stor del af skærmen ({bb['height']:.0f}px)"))
    chips=await pg.locator("[data-chip-value]").all_inner_texts()
    st=(await pg.inner_text("#geo-status")).strip()
    if maps=="abort":
        ck(await pg.is_visible("#mini-fallback") and not await pg.is_visible("#mini-gmap"),L("Maps fejler: reservekort"))
        ck(len(chips)>=4,L("Maps fejler: chips virker stadig"))
    elif label=="susaaen":
        ck(chips[0].startswith("Susåen ·"),L(f"Susåen er nærmeste vand: {chips[:2]}"))
        t=await pg.inner_text("#spot-guide")
        ck("dit nærmeste vand" in t.lower() and "Susåen" in t and "Gerdrup" in t and "Skalle" in t and "Gedde" in t,L("Susåen: kendt guide med arter og noter"))
        ck("Appen kender ikke" not in t and "stålforfang" in t,L("Susåen: kendt sted, stålforfang nævnt"))
        await pg.screenshot(path=f"{OUT}/home-susaaen.png",full_page=True)
    elif geo and overpass=="ok":
        ck("Vande inden for" in st,L("status ok"))
        ck(chips[0].startswith("Furesøen ·"),L(f"nærmeste først: {chips[:4]}"))
        ck(sum("Furesøen" in c for c in chips)==1,L("OSM-dublet af kendt sted fjernet"))
        ck(any("Lyngby Sø" in c for c in chips) and any("Mølleåen" in c for c in chips),L("OSM-vande vises"))
        ck(not any("Lille Pøl" in c for c in chips),L("damme filtreres fra"))
        ck(all(" · " in c for c in chips),L("alle chips har afstand"))
        ck(await pg.is_visible("#mini-gmap") and not await pg.is_visible("#mini-fallback"),L("Google Maps vises"))
        ck(await pg.locator("[data-mock-marker='Din position']").count()==1,L("din position vist på kortet"))
        ck(await pg.locator("[data-mock-marker='Lyngby Sø']").count()==1,L("pin for vand i nærheden"))
        t=await pg.inner_text("#spot-guide")
        ck("dit nærmeste vand" in t.lower() and "Furesøen" in t,L("nærmeste vand er valgt som standard"))
        ck(all(x in t for x in ["Det skal du bruge","Det skal du vide først","Sådan gør du","Stang:"]),L("nybegynderguide: grej, regler, trin"))
        href=await pg.get_attribute("a:has-text('Vis vej')","href")
        ck(href.startswith("https://www.google.com/maps/dir/?api=1&destination=55.799"),L("Vis vej linker til Google Maps"))
        ck("Din samling: 0 af" in await pg.inner_text(".collection-link"),L("samlingslinje vises"))
        await pg.click("[data-new-catch]"); await pg.wait_for_timeout(250)
        ck(await pg.input_value("#catch-place")=="Furesøen",L("fangstformular har stedet forudfyldt"))
        await pg.select_option("#catch-fishId","aborre"); await pg.fill("#catch-cm","25")
        await pg.click("button[type=submit]"); await pg.wait_for_timeout(350)
        ck("Din samling: 1 af" in await pg.inner_text(".collection-link"),L("samling opdateres uden at siden nulstilles"))
        ck(await pg.is_visible("#mini-gmap") and "dit nærmeste vand" in (await pg.inner_text("#spot-guide")).lower(),L("kort og valgt sted bevares efter fangst"))
        await pg.click("[data-chip-value='osm:way1']"); await pg.wait_for_timeout(150)
        t=await pg.inner_text("#spot-guide")
        ck("Lyngby Sø" in t and "Appen kender ikke" in t and "Aborre" in t and "Bait" in t,L("ukendt vand: generel guide"))
        await pg.click("[data-chip-value='furesoeen']"); await pg.wait_for_timeout(150)
        t=await pg.inner_text("#spot-guide")
        ck("Appen kender ikke" not in t and "Skalle" in t and "Vær opmærksom på" in t,L("kendt sted: fuld guide"))
        await pg.screenshot(path=f"{OUT}/home-{label}-nearby.png",full_page=True)
        await pg.click(".mini-map"); await pg.wait_for_timeout(250); ck(pg.url.endswith("#/kort"),L("tryk på kort åbner Kort"))
    elif not geo:
        ck("ikke adgang" in st,L("nægtet: forklarende status"))
        ck(await pg.is_visible("[data-geo-retry]"),L("nægtet: knap til at prøve igen"))
        await pg.click("[data-chip-value='buresoe']"); await pg.wait_for_timeout(150)
        ck("Buresø" in await pg.inner_text("#spot-guide"),L("nægtet: kan stadig vælge kendt sted"))
        await pg.screenshot(path=f"{OUT}/home-{label}-denied.png",full_page=True)
    elif overpass!="ok":
        ck("Kunne ikke hente vande" in st,L("OSM fejler: status"))
        ck(chips[0].startswith("Furesøen ·"),L("OSM fejler: kendte steder med afstand"))
    ck(await pg.evaluate("document.documentElement.scrollWidth-innerWidth")<=0,L("ingen vandret overflow"))
    ck(not errs,L(f"ingen JS-fejl {errs[:2]}"))
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        await run(b,"mobile",{"width":390,"height":844})
        await run(b,"desktop",{"width":1440,"height":900})
        await run(b,"susaaen",{"width":390,"height":844},at=(55.2300,11.7600),osm={"elements":[]})
        await run(b,"denied",{"width":390,"height":844},geo=False)
        await run(b,"osmfail",{"width":390,"height":844},overpass="fail")
        await run(b,"nomaps",{"width":390,"height":844},maps="abort")
        await b.close()
    sys.exit(1 if fails else 0)
asyncio.run(main())

from patchright.sync_api import sync_playwright
import pathlib
u = pathlib.Path("reel.html").resolve().as_uri() + "#static"
FPS, T = 30, 14
with sync_playwright() as p:
    pg = p.chromium.launch(headless=True).new_page(viewport={"width": 1600, "height": 900})
    pg.goto(u); pg.wait_for_timeout(800)
    for k in range(FPS * T):
        pg.evaluate(f"window.draw({k / FPS})", isolated_context=False)
        pg.screenshot(path=f"frames/f{k:04d}.png")

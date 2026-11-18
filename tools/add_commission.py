"""Add finished commissions to the Million Commission wall.

  py -3.12 tools/add_commission.py photo.jpg [photo2.jpg ...] [--name "Sam"]
  py -3.12 tools/add_commission.py --set raised=12 openThisMonth=20 kofiUrl=https://ko-fi.com/...

Each photo is straightened (phone rotation), cleaned (paper pushed to white),
saved as commissions/wall/NNNN.jpg plus a small thumb, and added to wall.js in order.
"""
import argparse, json, re
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / "commissions"
WALL = ROOT / "wall"
JS = ROOT / "wall.js"
DEFAULT = {"kofiUrl": "", "raised": 0, "openThisMonth": 0, "commissions": []}


def load():
    if not JS.exists():
        return dict(DEFAULT)
    m = re.search(r"window\.WALL\s*=\s*(\{.*\});?\s*$", JS.read_text(encoding="utf-8"), re.S)
    return json.loads(m.group(1)) if m else dict(DEFAULT)


def save(data):
    JS.write_text("window.WALL = " + json.dumps(data, indent=1) + ";\n", encoding="utf-8")


def clean(path):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    # Push the paper toward white and the lines toward black, ignoring the extreme 1%.
    return ImageOps.autocontrast(img, cutoff=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("photos", nargs="*")
    ap.add_argument("--name", default="", help="name or nickname shown on the wall (blank = anonymous)")
    ap.add_argument("--set", nargs="*", default=[], help="key=value for kofiUrl, raised, openThisMonth")
    a = ap.parse_args()
    data = load()
    for kv in a.set:
        k, v = kv.split("=", 1)
        data[k] = int(v) if v.isdigit() else v
    (WALL / "thumbs").mkdir(parents=True, exist_ok=True)
    for p in a.photos:
        n = len(data["commissions"]) + 1
        img = clean(p)
        full = img.copy(); full.thumbnail((1600, 1600))
        full.save(WALL / f"{n:04d}.jpg", quality=86, optimize=True, progressive=True)
        thumb = ImageOps.fit(img, (240, 300))
        thumb.save(WALL / "thumbs" / f"{n:04d}.jpg", quality=80, optimize=True)
        entry = {"img": f"wall/{n:04d}.jpg", "thumb": f"wall/thumbs/{n:04d}.jpg"}
        if a.name:
            entry["name"] = a.name
        data["commissions"].append(entry)
        print(f"No. {n}: {p} -> wall/{n:04d}.jpg")
    save(data)
    print(f"wall.js: {len(data['commissions'])} drawn, ${data['raised']} raised, {data['openThisMonth']} open, kofi={'set' if data['kofiUrl'] else 'not set'}")


if __name__ == "__main__":
    main()

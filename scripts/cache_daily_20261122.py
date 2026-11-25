"""Cache and decode the reviewed 2026-11-22 artwork, opportunity and exhibition images."""
import concurrent.futures
import hashlib
import io
import json
import pathlib
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE_FILE = ROOT / "review/20261122-image-sources.json"
OUTPUT_DIR = ROOT / "assets/images/daily-20261122"


def cache(item):
    target = OUTPUT_DIR / f"{item['id']}.jpg"
    url = urllib.parse.quote(item["url"], safe=":/?&=%+,;@!$()*'~-")
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 public-art-research/1.0",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        content_type = response.headers.get("Content-Type", "").split(";", 1)[0]
        raw = response.read(25_000_000)
    image = Image.open(io.BytesIO(raw))
    image.load()
    if min(image.size) < 120:
        raise ValueError(f"{item['id']}: image too small {image.size}")
    image = ImageOps.exif_transpose(image).convert("RGB")
    image.thumbnail((1100, 1100))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    image.save(target, "JPEG", quality=81, optimize=True)
    return {
        "id": item["id"],
        "sourceUrl": item["sourceUrl"],
        "imageOriginalUrl": item["url"],
        "path": str(target.relative_to(ROOT)),
        "width": image.width,
        "height": image.height,
        "bytes": target.stat().st_size,
        "reportedContentType": content_type,
        "decodedFormat": "JPEG",
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "decoded": True,
    }


if __name__ == "__main__":
    sources = json.loads(SOURCE_FILE.read_text(encoding="utf-8"))["entries"]
    assert len(sources) == 30 and len({x["id"] for x in sources}) == 30
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        records = list(pool.map(cache, sources))
    report = {
        "date": "2026-11-22",
        "total": len(records),
        "decoded": len(records),
        "images": records,
        "note": "逐檔完成影像解碼與等比例 JPEG 轉存；解碼成功不代表取得開放再利用授權。",
    }
    path = ROOT / "review/20261122-image-download-validation.json"
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"total": len(records), "decoded": len(records), "bytes": sum(x["bytes"] for x in records)}))

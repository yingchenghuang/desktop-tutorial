"""Fetch only the reviewed November 21 image sources, with decoded-image validation."""
import concurrent.futures, hashlib, io, json, pathlib, urllib.request
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCES = json.loads((ROOT / 'review/20261121-image-sources.json').read_text())['images']

def cache(item):
    path = ROOT / item['path']
    assert path.parent == ROOT / 'assets/images/daily-20261121'
    assert item['url'].startswith('https://')
    with urllib.request.urlopen(item['url'], timeout=50) as response:
        assert response.status == 200
        content_type = response.headers.get('Content-Type', '')
        assert content_type.startswith('image/'), (item['id'], content_type)
        raw = response.read(25000000)
    image = Image.open(io.BytesIO(raw))
    image.load()
    assert min(image.size) >= 120, (item['id'], image.size)
    image = ImageOps.exif_transpose(image).convert('RGB')
    image.thumbnail((1100, 1100))
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, quality=81, optimize=True)
    return {'id': item['id'], 'sourceUrl': item['source'], 'imageOriginalUrl': item['url'],
            'path': item['path'], 'width': image.width, 'height': image.height,
            'bytes': path.stat().st_size, 'contentType': content_type,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'decoded': True}

if __name__ == '__main__':
    assert len(SOURCES) == 30 and len({x['id'] for x in SOURCES}) == 30
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        records = list(pool.map(cache, SOURCES))
    report = {'date': '2026-11-21', 'total': len(records), 'decoded': len(records), 'images': records,
              'note': 'Image identity reviewed separately. Source copyright is retained; decoding does not imply an open license.'}
    (ROOT / 'review/20261121-image-download-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'total': len(records), 'decoded': len(records), 'bytes': sum(x['bytes'] for x in records)}))

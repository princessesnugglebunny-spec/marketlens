"""MarketLens optional image backend: compositing + pure-white background."""
import io
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image

app = FastAPI(title="MarketLens Image Backend")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/composite")
async def composite(file: UploadFile = File(...)) -> StreamingResponse:
    """Remove near-white background and composite product on pure white at 87% fill."""
    data = await file.read()
    img = Image.open(io.BytesIO(data)).convert("RGBA")
    # simple threshold: pixels close to white become transparent
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r > 235 and g > 235 and b > 235:
                pixels[x, y] = (r, g, b, 0)
    # bounding box of non-transparent
    bbox = img.getbbox()
    if bbox:
        cropped = img.crop(bbox)
    else:
        cropped = img
    # composite on white canvas at 87% fill
    cw, ch = 2000, 2000
    canvas = Image.new("RGB", (cw, ch), (255, 255, 255))
    scale = min((cw * 0.87) / cropped.width, (ch * 0.87) / cropped.height)
    nw, nh = int(cropped.width * scale), int(cropped.height * scale)
    resized = cropped.resize((nw, nh), Image.LANCZOS)
    ox = (cw - nw) // 2
    oy = (ch - nh) // 2
    canvas.paste(resized, (ox, oy), resized if resized.mode == "RGBA" else None)
    buf = io.BytesIO()
    canvas.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

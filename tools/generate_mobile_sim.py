"""
Mobile Simulation Screenshot Generator
Task: I3.T3 - Responsiveness & Performance Hardening

Generates the fallback screenshot for VisualSimulationWindow used on
mobile devices (<768px). The output includes both a compressed WebP
and a JPEG fallback while keeping the combined size under 35KB.

Usage:
    python tools/generate_mobile_sim.py

Requires Pillow (install via `.venv/bin/pip install pillow` or globally).
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


def build_image(width: int = 900, height: int = 675) -> Image.Image:
  """Create the desktop simulation illustration."""

  img = Image.new("RGB", (width, height), "#050505")
  draw = ImageDraw.Draw(img)

  # Background gradient
  for y in range(height):
    shade = int(8 + (y / height) * 12)
    draw.line([(0, y), (width, y)], fill=(shade, shade + 2, shade + 4))

  padding = 40
  container = [padding, padding, width - padding, height - padding]
  draw.rounded_rectangle(container, radius=28, fill=(12, 12, 14))

  # Window chrome
  dot_y = padding + 20
  for i, color in enumerate(((235, 87, 87), (242, 201, 76), (34, 197, 94))):
    cx = padding + 24 + i * 22
    draw.ellipse((cx - 7, dot_y - 7, cx + 7, dot_y + 7), fill=color)

  draw.rectangle(
    (padding + 110, dot_y - 6, width - padding - 40, dot_y + 6),
    fill=(40, 40, 50),
  )

  # Pane grid (3 columns)
  pane_width = (width - padding * 2 - 24) // 3
  pane_height = 320
  pane_top = padding + 60

  for idx in range(3):
    left = padding + idx * (pane_width + 12)
    box = [left, pane_top, left + pane_width, pane_top + pane_height]
    draw.rounded_rectangle(
      box,
      radius=18,
      fill=(20, 20, 26),
      outline=(45, 45, 60),
      width=2,
    )

    draw.ellipse((left + 20, pane_top + 18, left + 50, pane_top + 48), fill=(30, 30, 38))
    draw.rectangle((left + 60, pane_top + 22, left + pane_width - 20, pane_top + 32), fill=(60, 78, 255))

    line_y = pane_top + 50
    for line_index in range(10):
      if line_index in (2, 3):
        color = (83, 216, 106)
      elif line_index % 3 == 0:
        color = (145, 105, 255)
      else:
        color = (120, 138, 196)
      draw.rectangle((left + 20, line_y, left + pane_width - 24, line_y + 8), fill=color)
      line_y += 20

  # Metrics row
  metric_top = pane_top + pane_height + 30
  metric_height = 100
  block_width = (width - padding * 2 - 32) / 3

  for i in range(3):
    left = padding + i * (block_width + 16)
    right = left + block_width
    draw.rounded_rectangle(
      (left, metric_top, right, metric_top + metric_height),
      radius=18,
      fill=(18, 18, 24),
      outline=(55, 55, 70),
      width=1,
    )
    draw.rectangle((left + 20, metric_top + 18, right - 20, metric_top + 30), fill=(167, 139, 250))
    draw.rectangle((left + 20, metric_top + 46, right - 80, metric_top + 54), fill=(94, 234, 212))
    draw.rectangle((left + 20, metric_top + 70, left + 140, metric_top + 78), fill=(250, 204, 21))

  # Glows
  glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
  glow_draw = ImageDraw.Draw(glow_layer)
  glow_draw.ellipse((width / 2 - 180, pane_top - 40, width / 2 + 180, pane_top + 300), fill=(139, 92, 246, 45))
  glow_draw.ellipse((padding, height - 220, padding + 280, height), fill=(56, 189, 248, 65))
  glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(40))

  return Image.alpha_composite(img.convert("RGBA"), glow_layer).convert("RGB")


def main() -> None:
  img = build_image()
  output_dir = Path("public")
  output_dir.mkdir(exist_ok=True)

  # Resize for mobile (750px width)
  mobile = img.resize((750, int(750 / img.width * img.height)))

  mobile.save(output_dir / "mobile-sim.webp", "WEBP", quality=70, method=6)
  mobile.save(
    output_dir / "mobile-sim.jpg",
    "JPEG",
    quality=70,
    optimize=True,
    progressive=True,
  )

  print("Generated mobile-sim.webp and mobile-sim.jpg in ./public")


if __name__ == "__main__":
  main()

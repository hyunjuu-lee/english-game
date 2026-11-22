#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""홈 화면 아이콘(180x180) — 로비와 같은 결(민트 하늘 · 구름 · 언덕 · ㅌ 마스코트 · 블루 발판).
   게임 안의 마스코트 path(MG_PATH)를 그대로 써서 캐릭터가 100% 같게 나온다."""
import cairosvg, io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icon-180.png"

MG_PATH = ("M32.0 4.0C35.5 3.8 38.6 4.5 41.4 4.8C44.1 5.2 46.7 5.7 48.6 6.2C50.5 6.8 51.9 7.4 52.8 7.9"
           "C53.7 8.4 53.3 8.8 53.8 9.3C54.4 9.8 55.6 10.4 56.2 11.0C56.8 11.6 57.2 12.3 57.5 13.0"
           "C57.8 13.7 58.0 14.5 58.0 15.2C58.0 15.9 57.8 16.7 57.5 17.4C57.2 18.1 56.8 18.8 56.2 19.4"
           "C55.6 20.0 54.3 20.4 53.8 21.1C53.4 21.8 53.6 22.8 53.6 23.6C53.6 24.4 53.5 25.4 53.8 26.1"
           "C54.2 26.8 55.1 27.2 55.7 27.8C56.2 28.4 56.8 29.1 57.2 29.8C57.6 30.5 57.9 31.3 57.9 32.0"
           "C57.9 32.7 57.6 33.5 57.2 34.2C56.8 34.9 56.2 35.6 55.7 36.2C55.1 36.8 54.4 37.2 54.1 37.9"
           "C53.8 38.6 53.8 39.6 53.8 40.4C53.8 41.2 53.8 42.2 54.1 42.9C54.4 43.6 55.4 44.0 55.9 44.6"
           "C56.5 45.2 57.1 45.9 57.5 46.6C57.8 47.3 58.0 48.1 58.0 48.8C58.0 49.5 57.7 50.3 57.2 51.0"
           "C56.8 51.7 56.1 52.4 55.4 53.0C54.7 53.6 53.9 54.1 52.8 54.7C51.7 55.3 50.4 56.0 48.6 56.6"
           "C46.9 57.2 45.2 57.8 42.4 58.3C39.6 58.9 36.2 60.0 32.0 60.0C27.8 60.0 20.0 59.1 16.9 58.4"
           "C13.8 57.8 14.4 57.0 13.3 56.1C12.2 55.1 11.2 54.0 10.4 52.7C9.6 51.4 8.9 49.8 8.3 48.2"
           "C7.8 46.7 7.4 44.9 7.0 43.2C6.7 41.5 6.5 39.7 6.3 38.2C6.1 36.6 6.0 35.2 6.0 33.7"
           "C6.0 32.2 6.2 30.7 6.3 29.2C6.5 27.7 6.7 26.2 6.9 24.7C7.2 23.2 7.5 21.7 7.9 20.2"
           "C8.3 18.7 8.7 17.2 9.2 15.8C9.8 14.4 10.2 13.0 11.1 11.8C12.0 10.7 13.0 9.8 14.6 8.8"
           "C16.1 7.8 17.4 6.6 20.3 5.8C23.2 5.0 28.5 4.2 32.0 4.0Z")

SVG = """<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E9FDF7"/><stop offset=".55" stop-color="#DCFAF0"/><stop offset="1" stop-color="#C9F5E6"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FFF7DC" stop-opacity=".95"/><stop offset="1" stop-color="#FFF7DC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mg" cx="38%" cy="20%" r="92%">
      <stop offset="0" stop-color="#95FBE5"/><stop offset=".38" stop-color="#66F4CE"/>
      <stop offset=".78" stop-color="#48EABF"/><stop offset="1" stop-color="#37E2B4"/>
    </radialGradient>
    <linearGradient id="mgShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".58" stop-color="#0FA57F" stop-opacity="0"/><stop offset="1" stop-color="#0FA57F" stop-opacity=".16"/>
    </linearGradient>
    <linearGradient id="hillA" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#B7F0DC"/><stop offset="1" stop-color="#93E7C8"/>
    </linearGradient>
    <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#84E7BE"/><stop offset="1" stop-color="#5FD7AC"/>
    </linearGradient>
    <linearGradient id="pod" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5AB0FF"/><stop offset=".55" stop-color="#007AFF"/><stop offset="1" stop-color="#005CE6"/>
    </linearGradient>
    <radialGradient id="pond" cx="42%" cy="40%" r="70%">
      <stop offset="0" stop-color="#E7FAFF"/><stop offset="1" stop-color="#A9E3FF"/>
    </radialGradient>
  </defs>

  <!-- 하늘 -->
  <rect width="180" height="180" fill="url(#sky)"/>
  <circle cx="150" cy="28" r="46" fill="url(#sunGlow)"/>
  <circle cx="150" cy="28" r="17" fill="#FFE9A8" opacity=".95"/>

  <!-- 구름 -->
  <g fill="#FFFFFF" opacity=".95">
    <ellipse cx="30" cy="34" rx="20" ry="8.5"/><ellipse cx="46" cy="38" rx="14" ry="6.5"/>
    <ellipse cx="120" cy="58" rx="16" ry="7"/><ellipse cx="132" cy="61" rx="11" ry="5"/>
  </g>

  <!-- 언덕 -->
  <path d="M0 118 C26 100 58 104 92 112 C126 120 152 104 180 110 V180 H0 Z" fill="url(#hillA)"/>
  <path d="M0 138 C30 122 64 128 96 136 C128 144 154 132 180 136 V180 H0 Z" fill="url(#hillB)"/>
  <ellipse cx="146" cy="160" rx="34" ry="11" fill="url(#pond)" opacity=".85"/>

  <!-- ㅌ 마스코트 -->
  <ellipse cx="87" cy="140" rx="40" ry="7" fill="#0FA57F" opacity=".14"/>
  <g transform="translate(34.0,24.0) scale(1.65)">
    <path d="%MG%" fill="url(#mg)"/>
    <path d="%MG%" fill="url(#mgShade)"/>
    <ellipse cx="22" cy="15" rx="7.5" ry="4.4" fill="#FFFFFF" opacity=".14" transform="rotate(-20 22 15)"/>
    <ellipse cx="23.6" cy="32.4" rx="3.7" ry="7.3" fill="#111827"/>
    <ellipse cx="38.4" cy="32.4" rx="3.7" ry="7.3" fill="#111827"/>
    <ellipse cx="22.5" cy="29.2" rx="1.25" ry="1.6" fill="#FFFFFF" opacity=".95"/>
    <ellipse cx="37.3" cy="29.2" rx="1.25" ry="1.6" fill="#FFFFFF" opacity=".95"/>
  </g>

  <!-- 3D 블루 발판 -->
  <g>
    <ellipse cx="89" cy="158" rx="29" ry="8.5" fill="#0047B3" opacity=".22"/>
    <rect x="61" y="140" width="56" height="19" rx="9.5" fill="url(#pod)"/>
    <ellipse cx="89" cy="141" rx="28" ry="8.4" fill="#5AB0FF"/>
    <ellipse cx="89" cy="140.4" rx="18" ry="4.8" fill="#BEE3FF" opacity=".82"/>
  </g>
</svg>"""

svg = SVG.replace("%MG%", MG_PATH)
png = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=180, output_height=180)
im = Image.open(io.BytesIO(png)).convert("RGB")
im.save(OUT, "PNG", optimize=True)
print("saved", OUT, im.size)

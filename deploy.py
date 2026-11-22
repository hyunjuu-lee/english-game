#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""sharehtml.org 페이지 덮어쓰기 배포."""
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGE = "63b77f05-796e-4744-bae4-2a31388692ed"
KEY  = (ROOT / ".sharehtml_key").read_text(encoding="utf-8").strip()
html = (ROOT / "bundle" / "index.html").read_bytes()

req = urllib.request.Request(
    "https://sharehtml.org/api/v1/pages/" + PAGE,
    data=html,
    method="PUT",
    headers={
        "Authorization": "Bearer " + KEY,
        "Content-Type": "text/html; charset=utf-8",
    },
)
with urllib.request.urlopen(req, timeout=120) as r:
    print(r.status, r.read().decode("utf-8")[:400])

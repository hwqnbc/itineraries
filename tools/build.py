#!/usr/bin/env python3
"""Build the public site into _site/.

- Copies the static site (HTML, assets, pois.js, images) into _site/.
- Converts selected markdown docs into HTML pages that share the site's
  header (with the Home button), stylesheet and footer.
- Leaves raw .md files, tooling and agent docs out of the published site.

Usage:
    python3 tools/build.py            # build
    python3 tools/build.py --check    # build, then fail on broken local links

The markdown files are the source of truth. Never edit or commit the
generated .html for them, and never commit _site/.
"""

import argparse
import html
import os
import re
import shutil
import sys
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"

# Never published
EXCLUDE_DIRS = {".git", ".github", ".claude", "tools", "_site", "node_modules"}
EXCLUDE_SUFFIXES = {".md"}
EXCLUDE_FILES = {".gitkeep", ".gitignore"}
# The blank template is for copying, not for the public site
EXCLUDE_PATHS = {Path("destinations/_template")}

SITE_NAME = "Family Itineraries"


def pages_to_generate():
    """Yield (source .md, output .html relative to ROOT, kind)."""
    yield ROOT / "docs/packing-list.md", Path("docs/packing-list.html"), "doc"
    for md in sorted((ROOT / "docs/participants").glob("*.md")):
        if md.name.lower() != "readme.md":
            yield md, md.relative_to(ROOT).with_suffix(".html"), "doc"
    for md in sorted((ROOT / "destinations").glob("*/notes.md")):
        if md.parent.name != "_template":
            yield md, md.relative_to(ROOT).with_suffix(".html"), "notes"


# ---------- Copy static files ----------

def copy_static():
    if OUT.exists():
        shutil.rmtree(OUT)
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel = Path(dirpath).relative_to(ROOT)
        dirnames[:] = [d for d in dirnames
                       if d not in EXCLUDE_DIRS and rel / d not in EXCLUDE_PATHS]
        for name in filenames:
            if Path(name).suffix.lower() in EXCLUDE_SUFFIXES or name in EXCLUDE_FILES:
                continue
            dest = OUT / rel / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(Path(dirpath) / name, dest)


# ---------- Markdown → HTML ----------

def trip_name(trip_dir: Path) -> str:
    """Short trip name from the trip page's <title>, e.g. 'Taipei June 2027'."""
    page = trip_dir / "index.html"
    if page.exists():
        m = re.search(r"<title>(.*?)</title>", page.read_text(encoding="utf-8"), re.S)
        if m:
            return html.unescape(m.group(1).split("·")[0].strip())
    return trip_dir.name


def preprocess(text: str, out_rel: Path) -> str:
    # "Participants: default-family" → link to that profile page
    def link_profile(m):
        name = m.group(1)
        if (ROOT / "docs/participants" / f"{name}.md").exists():
            target = os.path.relpath(ROOT / "docs/participants" / f"{name}.html",
                                     (ROOT / out_rel).parent)
            return f"Participants: [{name}]({Path(target).as_posix()})"
        return m.group(0)
    text = re.sub(r"^Participants:\s*([\w-]+)\s*$", link_profile, text, flags=re.M)
    # Keep single metadata lines (Participants / Status) on separate lines
    text = re.sub(r"^(Participants:.*|Status:.*)$", r"\1  ", text, flags=re.M)
    return text


def postprocess(body: str) -> str:
    # Task list items → checkboxes
    def task(m):
        checked = " checked" if m.group(2).lower() == "x" else ""
        return f'<li class="task"><label><input type="checkbox"{checked}> '
    body = re.sub(r"<li>(<p>)?\[( |x|X)\]\s*", lambda m: task(m) + (m.group(1) or ""), body)
    # close the <label> at the end of each task item
    body = re.sub(r'(<li class="task"><label>.*?)(</li>)', r"\1</label>\2", body, flags=re.S)
    # Tables scroll inside themselves on phones
    body = body.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")
    # Relative links to .md → .html
    body = re.sub(r'href="(?!https?:|mailto:|#)([^"]+?)\.md(#[^"]*)?"',
                  lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"', body)
    return body


def render_page(src: Path, out_rel: Path, kind: str) -> str:
    text = preprocess(src.read_text(encoding="utf-8"), out_rel)
    md = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists", "toc"])
    body = postprocess(md.convert(text))

    h1 = re.search(r"^#\s+(.+)$", text, re.M)
    title = h1.group(1).strip() if h1 else src.stem

    depth = len(out_rel.parts) - 1
    up = "../" * depth
    home = f"{up}index.html"

    if kind == "notes":
        trip = trip_name(src.parent)
        crumb = (f'<a href="{home}">Trips</a> › <a href="index.html">{html.escape(trip)}</a> › Planning notes')
        page_title = f"{trip} planning notes"
        back = f'<a href="index.html">← Back to {html.escape(trip)}</a> · <a href="{home}">All trips</a>'
    else:
        crumb = f'<a href="{home}">Trips</a> › {html.escape(title)}'
        page_title = title
        back = f'<a href="{home}">← Back to all trips</a>'

    src_rel = src.relative_to(ROOT).as_posix()
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(page_title)} · {SITE_NAME}</title>
  <link rel="stylesheet" href="{up}assets/css/style.css">
</head>
<body>
  <!-- GENERATED by tools/build.py from {src_rel}. Edit the .md file, not this page. -->
  <header class="site-header">
    <div class="container">
      <a class="home-btn" href="{home}" aria-label="Back to all trips">🏠 Home</a>
      <nav class="breadcrumb" aria-label="Breadcrumb">{crumb}</nav>
    </div>
  </header>

  <main class="container prose">
{body}
  </main>

  <footer class="site-footer">
    <div class="container">{back} · Generated from <code>{html.escape(src_rel)}</code></div>
  </footer>
  <script src="{up}assets/js/main.js"></script>
</body>
</html>
"""


# ---------- Link check ----------

LINK_RE = re.compile(r'(?:href|src)="([^"]+)"')


def check_links() -> list:
    broken = []
    for page in OUT.rglob("*.html"):
        for target in LINK_RE.findall(page.read_text(encoding="utf-8")):
            if re.match(r"^(https?:|mailto:|tel:|data:|#|javascript:)", target):
                continue
            if target.startswith("/"):
                broken.append(f"{page.relative_to(OUT)}: absolute link {target}")
                continue
            path = target.split("#")[0].split("?")[0]
            if not path:
                continue
            resolved = (page.parent / path)
            if resolved.is_dir():
                resolved = resolved / "index.html"
            if not resolved.exists():
                broken.append(f"{page.relative_to(OUT)}: {target}")
    return broken


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="fail on broken local links")
    args = ap.parse_args()

    copy_static()
    count = 0
    for src, out_rel, kind in pages_to_generate():
        if not src.exists():
            continue
        dest = OUT / out_rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(render_page(src, out_rel, kind), encoding="utf-8")
        print(f"generated {out_rel.as_posix()}  <- {src.relative_to(ROOT).as_posix()}")
        count += 1
    print(f"built _site/ ({count} generated pages)")

    if args.check:
        broken = check_links()
        if broken:
            print("\nBroken links:", *broken, sep="\n  ")
            sys.exit(1)
        print("link check passed")


if __name__ == "__main__":
    main()

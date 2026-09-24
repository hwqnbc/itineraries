#!/usr/bin/env python3
"""Build the public site into _site/.

Markdown is the source of truth; this script turns it into the website:

- destinations/<trip>/trip.md   -> destinations/<trip>/index.html (trip page)
- destinations/<trip>/notes.md  -> destinations/<trip>/notes.html ("Planning notes")
- docs/packing-list.md          -> docs/packing-list.html
- docs/participants/<name>.md   -> docs/participants/<name>.html
- index.html (home page)        -> trip cards filled in from each trip.md

Static files (assets/, pois.js, images) are copied as they are. Raw .md files,
tooling, agent docs and destinations/_template/ are not published.

Usage:
    python3 tools/build.py            # build
    python3 tools/build.py --check    # build, then fail on broken local links

Never edit or commit the generated pages, and never commit _site/.
"""

import argparse
import html
import os
import re
import shutil
import sys
import urllib.parse
from pathlib import Path
from string import Template

import markdown

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site"
PAGE = Template((ROOT / "tools/templates/page.html").read_text(encoding="utf-8"))

# Never published
EXCLUDE_DIRS = {".git", ".github", ".claude", "tools", "_site", "node_modules", "__pycache__"}
EXCLUDE_SUFFIXES = {".md"}
EXCLUDE_FILES = {".gitkeep", ".gitignore"}
# The blank template is for copying, not for the public site
EXCLUDE_PATHS = {Path("destinations/_template")}

# trip.md rules
STATUSES = ["idea", "planning", "booked", "completed"]
REQUIRED_KEYS = ["title", "short", "flag", "status", "start", "dates", "card",
                 "participants", "updated"]
SECTIONS = ["whos-going", "flights", "accommodation", "days", "map", "bookings",
            "budget", "practical", "emergency", "packing"]

LEAFLET = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/"
VERIFY_TOKEN = "@@VERIFY@@"


class BuildError(Exception):
    pass


def esc(s):
    return html.escape(str(s), quote=True)


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


# ---------- Markdown helpers ----------

def md_to_html(text: str) -> str:
    """Markdown → HTML with the site's shorthands applied."""
    text = text.replace("{verify}", VERIFY_TOKEN)
    # [Name](map:) and [text](map:Query+text) → Google Maps search links
    def maps(m):
        label, query = m.group(1), m.group(2) or m.group(1)
        query = urllib.parse.unquote_plus(query)
        url = "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote_plus(query)
        return f"[{label}]({url})"
    text = re.sub(r"\[([^\]]+)\]\(map:([^)\s]*)\)", maps, text)

    body = markdown.markdown(text, extensions=["tables", "fenced_code", "sane_lists"])

    body = body.replace(VERIFY_TOKEN, '<span class="verify"></span>')
    # Task list items → checkboxes (ticks are remembered by assets/js/main.js)
    def task(m):
        checked = " checked" if m.group(2).lower() == "x" else ""
        return f'<li class="task"><label><input type="checkbox"{checked}> ' + (m.group(1) or "")
    body = re.sub(r"<li>(<p>)?\[( |x|X)\]\s*", task, body)
    body = re.sub(r'(<li class="task"><label>.*?)(</li>)', r"\1</label>\2", body, flags=re.S)
    # Tables scroll inside themselves on phones
    body = body.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")
    # Relative links to .md → the generated .html
    body = re.sub(r'href="(?!https?:|mailto:|#)([^"]+?)\.md(#[^"]*)?"',
                  lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"', body)
    return body


def rel_link(target: Path, from_page: Path) -> str:
    """Relative URL from one output page (relative to ROOT) to another."""
    return Path(os.path.relpath(target, from_page.parent)).as_posix()


def profile_link(name: str, from_page: Path):
    if (ROOT / "docs/participants" / f"{name}.md").exists():
        return rel_link(Path("docs/participants") / f"{name}.html", from_page)
    return None


def render(out_rel: Path, **fields) -> str:
    up = "../" * (len(out_rel.parts) - 1)
    values = dict(title="", description="", head_extra="", crumb="", main_class="",
                  body="", footer="", scripts="", source="")
    values.update(fields)
    values["up"] = up
    return PAGE.substitute(values)


# ---------- trip.md ----------

def parse_front_matter(src: Path):
    text = src.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    if not m:
        raise BuildError(f"{src.relative_to(ROOT)}: missing front matter (--- block at the top)")
    meta = {}
    for line in m.group(1).splitlines():
        line = re.sub(r"\s+#.*$", "", line).strip()   # allow trailing # comments
        if not line or line.startswith("#"):
            continue
        key, sep, value = line.partition(":")
        if not sep:
            raise BuildError(f"{src.relative_to(ROOT)}: bad front matter line: {line!r}")
        meta[key.strip()] = value.strip()
    return meta, text[m.end():]


def load_trip(src: Path):
    rel = src.relative_to(ROOT)
    meta, body = parse_front_matter(src)
    missing = [k for k in REQUIRED_KEYS if not meta.get(k)]
    if missing:
        raise BuildError(f"{rel}: missing front matter keys: {', '.join(missing)}")
    meta["status"] = meta["status"].lower()
    if meta["status"] not in STATUSES:
        raise BuildError(f"{rel}: status must be one of {', '.join(STATUSES)} (got {meta['status']!r})")

    # Split into the preamble (lede) and "## Heading {#id}" sections
    parts = re.split(r"^##\s+(.+?)\s*$", body, flags=re.M)
    preamble, sections = parts[0], []
    for heading, content in zip(parts[1::2], parts[2::2]):
        idm = re.search(r"\{#([\w-]+)\}\s*$", heading)
        if not idm:
            raise BuildError(f"{rel}: section '## {heading}' needs an id, e.g. {{#flights}}")
        sections.append((idm.group(1), heading[:idm.start()].strip(), content))
    ids = [s[0] for s in sections]
    if ids != SECTIONS:
        missing = [s for s in SECTIONS if s not in ids]
        extra = [s for s in ids if s not in SECTIONS]
        detail = []
        if missing:
            detail.append("missing " + ", ".join(missing))
        if extra:
            detail.append("unknown " + ", ".join(extra))
        if not missing and not extra:
            detail.append("wrong order")
        raise BuildError(f"{rel}: sections must be {' → '.join(SECTIONS)} ({'; '.join(detail)})")
    return dict(meta=meta, preamble=preamble, sections=sections, dir=src.parent, src=src)


def render_days(content: str) -> str:
    """### Day N · Theme blocks → <details class="day">; other ### stay headings."""
    parts = re.split(r"^###\s+(.+?)\s*$", content, flags=re.M)
    out = [md_to_html(parts[0]) if parts[0].strip() else ""]
    first = True
    for heading, body in zip(parts[1::2], parts[2::2]):
        if re.match(r"Day\s+\d+", heading):
            label, _, tag = heading.partition("·")
            tag_html = f' <span class="day-tag">· {esc(tag.strip())}</span>' if tag else ""
            out.append(
                f'<details class="day"{" open" if first else ""}>\n'
                f'  <summary>{esc(label.strip())}{tag_html}</summary>\n'
                f'  <div class="day-body">\n{md_to_html(body)}\n  </div>\n</details>')
            first = False
        else:
            out.append(f"<h3>{esc(heading)}</h3>\n{md_to_html(body)}")
    return "\n".join(out)


def render_trip(trip) -> str:
    meta, tdir = trip["meta"], trip["dir"]
    out_rel = tdir.relative_to(ROOT) / "index.html"
    has_map = (tdir / "pois.js").exists()
    has_notes = (tdir / "notes.md").exists()

    meta_row = [f'<span class="status status-{meta["status"]}">{esc(meta["status"].capitalize())}</span>',
                f'<span>📅 {esc(meta["dates"])}</span>']
    plink = profile_link(meta["participants"], out_rel)
    who = f'<a href="{plink}">{esc(meta["participants"])}</a>' if plink else esc(meta["participants"])
    meta_row.append(f"<span>👪 Participants: {who}</span>")
    if has_notes:
        meta_row.append('<span>📝 <a href="notes.html">Planning notes</a></span>')

    lede = md_to_html(trip["preamble"]) if trip["preamble"].strip() else ""
    lede = lede.replace("<p>", '<p class="lede">', 1)
    lede = lede.replace("<blockquote>", '<blockquote class="note">')

    toc = ['<li><a href="#overview">Overview</a></li>']
    body = [f'<section id="overview">\n<h1>{esc(meta["flag"])} {esc(meta["title"])}</h1>\n'
            f'<div class="meta">\n  ' + "\n  ".join(meta_row) + f"\n</div>\n{lede}\n</section>"]
    for sid, heading, content in trip["sections"]:
        # The contents list drops the heading's leading emoji ("🗓️ Day-by-day" → "Day-by-day")
        first, _, rest = heading.partition(" ")
        label = rest if rest and not re.search(r"[A-Za-z0-9]", first) else heading
        toc.append(f'<li><a href="#{sid}">{esc(label)}</a></li>')
        if sid == "days":
            inner = render_days(content)
        elif sid == "map":
            inner = (md_to_html(content) if content.strip() else "")
            inner += ('\n<div data-trip-map></div>\n<noscript><p>The map needs JavaScript. '
                      'Use the Google Maps links in the day-by-day plan.</p></noscript>'
                      if has_map else '\n<p class="empty">No map yet — add a pois.js to this trip.</p>')
        else:
            inner = md_to_html(content)
        body.append(f'<section id="{sid}">\n<h2>{esc(heading)}</h2>\n{inner}\n</section>')
    body.insert(1, '<nav class="toc" aria-label="Contents">\n<ul>\n' + "\n".join(toc) + "\n</ul>\n</nav>")

    head_extra = scripts = ""
    if has_map:
        head_extra = f'  <link rel="stylesheet" href="{LEAFLET}leaflet.min.css">\n'
        scripts = (f'  <script src="{LEAFLET}leaflet.min.js"></script>\n'
                   '  <script src="pois.js"></script>\n'
                   '  <script src="../../assets/js/map.js"></script>\n')

    return render(
        out_rel,
        title=esc(meta["short"]),
        description=esc(f'Itinerary for {meta["title"]} — {meta["dates"]}'),
        head_extra=head_extra,
        crumb=f'<a href="../../index.html">Trips</a> › {esc(meta["short"])}',
        body="\n\n".join(body),
        footer=f'<a href="../../index.html">← Back to all trips</a> · Last updated: {esc(meta["updated"])}',
        scripts=scripts,
        source=trip["src"].relative_to(ROOT).as_posix(),
    )


# ---------- Home page cards ----------

def render_cards(trips) -> None:
    home = OUT / "index.html"
    page = home.read_text(encoding="utf-8")

    def card(t):
        m = t["meta"]
        href = (t["dir"].relative_to(ROOT) / "index.html").as_posix()
        tagline = f'\n  <p>{esc(m["tagline"])}</p>' if m.get("tagline") else ""
        return (f'<a class="card trip-card" href="{href}">\n'
                f'  <div class="flag" aria-hidden="true">{esc(m["flag"])}</div>\n'
                f'  <h3>{esc(m["title"])}</h3>\n'
                f'  <p>{esc(m["card"])}</p>{tagline}\n'
                f'  <span class="status status-{m["status"]}">{esc(m["status"].capitalize())}</span>\n'
                f'</a>')

    upcoming = sorted((t for t in trips if t["meta"]["status"] != "completed"),
                      key=lambda t: t["meta"]["start"])
    past = sorted((t for t in trips if t["meta"]["status"] == "completed"),
                  key=lambda t: t["meta"]["start"], reverse=True)

    def block(items, empty):
        if not items:
            return f'<p class="empty">{empty}</p>'
        return '<div class="trip-grid">\n' + "\n".join(card(t) for t in items) + "\n</div>"

    for marker, items, empty in [("<!-- @trips:upcoming -->", upcoming, "No upcoming trips yet."),
                                 ("<!-- @trips:past -->", past, "No past trips yet.")]:
        if marker not in page:
            raise BuildError(f"index.html: marker {marker} not found")
        page = page.replace(marker, block(items, empty))
    home.write_text(page, encoding="utf-8")


# ---------- Other markdown pages ----------

def doc_pages():
    """Yield (source .md, output .html relative to ROOT, kind)."""
    yield ROOT / "docs/packing-list.md", Path("docs/packing-list.html"), "doc"
    for md in sorted((ROOT / "docs/participants").glob("*.md")):
        if md.name.lower() != "readme.md":
            yield md, md.relative_to(ROOT).with_suffix(".html"), "doc"
    for md in sorted((ROOT / "destinations").glob("*/notes.md")):
        if md.parent.name != "_template":
            yield md, md.relative_to(ROOT).with_suffix(".html"), "notes"


def render_doc(src: Path, out_rel: Path, kind: str, trips_by_dir) -> str:
    text = src.read_text(encoding="utf-8")
    # "Participants: default-family" → link to that profile page
    def link_profile(m):
        target = profile_link(m.group(1), out_rel)
        return f"Participants: [{m.group(1)}]({target})" if target else m.group(0)
    text = re.sub(r"^Participants:\s*([\w-]+)\s*$", link_profile, text, flags=re.M)
    text = re.sub(r"^(Participants:.*|Status:.*)$", r"\1  ", text, flags=re.M)  # keep on own lines

    h1 = re.search(r"^#\s+(.+)$", text, re.M)
    title = h1.group(1).strip() if h1 else src.stem
    home = "../" * (len(out_rel.parts) - 1) + "index.html"

    if kind == "notes":
        trip = trips_by_dir.get(src.parent)
        name = trip["meta"]["short"] if trip else src.parent.name
        crumb = f'<a href="{home}">Trips</a> › <a href="index.html">{esc(name)}</a> › Planning notes'
        page_title = f"{name} planning notes"
        footer = f'<a href="index.html">← Back to {esc(name)}</a> · <a href="{home}">All trips</a>'
    else:
        crumb = f'<a href="{home}">Trips</a> › {esc(title)}'
        page_title = title
        footer = f'<a href="{home}">← Back to all trips</a>'

    src_rel = src.relative_to(ROOT).as_posix()
    return render(out_rel, title=esc(page_title), description=esc(page_title), crumb=crumb,
                  main_class="prose", body=md_to_html(text),
                  footer=f"{footer} · Generated from <code>{esc(src_rel)}</code>", source=src_rel)


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
            resolved = page.parent / path
            if resolved.is_dir():
                resolved = resolved / "index.html"
            if not resolved.exists():
                broken.append(f"{page.relative_to(OUT)}: {target}")
    return broken


def write(out_rel: Path, content: str, src: Path):
    dest = OUT / out_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding="utf-8")
    print(f"generated {out_rel.as_posix()}  <- {src.relative_to(ROOT).as_posix()}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="fail on broken local links")
    args = ap.parse_args()

    try:
        copy_static()
        # The template is validated (so copies start valid) but not published
        template = ROOT / "destinations/_template/trip.md"
        if template.exists():
            load_trip(template)
        trips = [load_trip(p) for p in sorted((ROOT / "destinations").glob("*/trip.md"))
                 if p.parent.name != "_template"]
        for t in trips:
            write(t["dir"].relative_to(ROOT) / "index.html", render_trip(t), t["src"])
        render_cards(trips)
        print(f"home page: {len(trips)} trip card(s)")
        trips_by_dir = {t["dir"]: t for t in trips}
        for src, out_rel, kind in doc_pages():
            if src.exists():
                write(out_rel, render_doc(src, out_rel, kind, trips_by_dir), src)
    except BuildError as e:
        print(f"BUILD FAILED: {e}", file=sys.stderr)
        sys.exit(2)
    print("built _site/")

    if args.check:
        broken = check_links()
        if broken:
            print("\nBroken links:", *broken, sep="\n  ")
            sys.exit(1)
        print("link check passed")


if __name__ == "__main__":
    main()

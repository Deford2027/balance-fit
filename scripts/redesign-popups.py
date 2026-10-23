"""Попапы Тильды для нового дизайна: src/data/popups.json.

   python3 scripts/redesign-popups.py   (нужен beautifulsoup4 + lxml)

Из страниц порта (src/data/pages/*.json) берёт содержимое попапов по их хукам
(#popup:..., #submenu:...): формы T702 – заголовок, текст, поля и кнопку;
инфо-попапы T390 – заголовок, текст, картинку и кнопки; подменю T794 – пункты.
Если на какой-то странице под тем же хуком другой текст, он кладётся в pages[путь]."""
import json, glob, re, collections
from bs4 import BeautifulSoup, Comment

ROOT = __file__.rsplit('/scripts/', 1)[0]
ALLOWED = {'strong', 'em', 'a', 'br', 'ul', 'ol', 'li', 'p'}


def clean(el):
    el = BeautifulSoup(str(el), 'lxml').body or el
    for t in el.find_all(['style', 'script', 'noscript']):
        t.decompose()
    for c in el.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for t in el.find_all(True):
        if t.name == 'b':
            t.name = 'strong'
        if t.name == 'i':
            t.name = 'em'
        if t.name not in ALLOWED:
            t.unwrap()
            continue
        href = t.get('href') if t.name == 'a' else None
        t.attrs = {}
        if href:
            t['href'] = href
            if href.startswith('http'):
                t['target'] = '_blank'
                t['rel'] = 'noopener'
    h = re.sub(r'\s+', ' ', el.decode_contents()).replace('<br/>', '<br>')
    h = re.sub(r'<strong>\s*</strong>', '', h).replace('‌', '')
    return h.strip()


def text(el):
    return re.sub(r'\s+', ' ', el.get_text(' ')).strip() if el else ''


def img_of(el):
    if el is None:
        return ''
    i = el if el.has_attr('data-original') else el.select_one('[data-original]')
    return i['data-original'] if i else ''


def parse(rec, hook_el):
    typ = rec.get('data-record-type')
    if typ == '702':
        form = rec.find('form')
        fields = []
        for g in rec.select('.t-input-group'):
            ft = g.get('data-field-type')
            inp = g.select_one('input, textarea, select')
            if ft == 'cb':
                continue
            if ft in ('nm', 'ph', 'em', 'ta', 'in') and inp is not None:
                fields.append({'name': g.get('data-field-name'), 'type': {'nm': 'text', 'ph': 'tel', 'em': 'email', 'ta': 'textarea', 'in': 'text'}[ft],
                               'placeholder': inp.get('placeholder', '')})
            elif ft == 'uw' or g.select_one('[data-tilda-upwidget], .t-upwidget'):
                fields.append({'name': g.get('data-field-name') or 'file', 'type': 'file', 'placeholder': text(g.select_one('.t-input-title')) or 'Резюме'})
        cb = rec.select_one('.t-checkbox__control span')
        btn = rec.select_one('.t-submit')
        return 'forms', {
            'title': text(rec.select_one('.t702__title')),
            'descr': clean(rec.select_one('.t702__descr')) if rec.select_one('.t702__descr') else '',
            'fields': fields,
            'consent': clean(cb) if cb else '',
            'button': text(btn) or 'Отправить',
        }
    if typ == '390':
        btns = [{'text': text(a), 'href': a.get('href', '')} for a in rec.select('.t390__btn-wrapper a, a.t-btn, a.t-btnflex') if text(a)]
        return 'info', {
            'title': text(rec.select_one('.t390__title')),
            'html': clean(rec.select_one('.t390__descr')) if rec.select_one('.t390__descr') else '',
            'img': img_of(rec.select_one('.t-popup__container')),
            'buttons': btns,
        }
    if typ == '794':
        return 'submenus', [{'text': text(a), 'href': a.get('href', '')} for a in rec.select('.t794__list a')]
    return None, None


found = collections.defaultdict(lambda: collections.defaultdict(list))  # kind/hook -> json -> pages
for f in sorted(glob.glob(f'{ROOT}/src/data/pages/*.json')):
    d = json.load(open(f))
    if 'body' not in d:
        continue
    s = BeautifulSoup(d['body'], 'lxml')
    seen = set()
    for el in s.select('[data-tooltip-hook]'):
        hook = el['data-tooltip-hook']
        rec = el.find_parent(class_='t-rec')
        if hook in seen or rec is None:
            continue
        seen.add(hook)
        kind, data = parse(rec, el)
        if kind:
            found[(kind, hook)][json.dumps(data, ensure_ascii=False, sort_keys=True)].append(d['path'] or 'index')

out = {'forms': {}, 'info': {}, 'submenus': {}, 'pages': {}}
for (kind, hook), variants in sorted(found.items()):
    best = max(variants, key=lambda k: len(variants[k]))
    out[kind][hook] = json.loads(best)
    for k, pages in variants.items():
        if k != best:
            for p in pages:
                out['pages'].setdefault(p, {}).setdefault(kind, {})[hook] = json.loads(k)

json.dump(out, open(f'{ROOT}/src/data/popups.json', 'w'), ensure_ascii=False, indent=1)
print({k: len(v) for k, v in out.items()})

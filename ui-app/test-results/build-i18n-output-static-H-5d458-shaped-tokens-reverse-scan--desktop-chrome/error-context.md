# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: build-i18n-output.spec.ts >> static HTML visible text contains no key-shaped tokens (reverse scan)
- Location: tests\build-i18n-output.spec.ts:99:5

# Error details

```
Error: Key-shaped tokens found in visible text (add real content to the allowlist in this file if legitimate):
out\ar\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\ar\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ar\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ar\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ar\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ar\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\cs\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\cs\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\cs\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\cs\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\cs\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\cs\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\da\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\da\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\da\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\da\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\da\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\da\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\de\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\de\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\de\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\de\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\de\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\de\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\el\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\el\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\el\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\el\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\el\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\el\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\en\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\en\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\en\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\en\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\en\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\en\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\es\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\es\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\es\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\es\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\es\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\es\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\fi\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\fi\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\fi\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\fi\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\fi\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\fi\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\fr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\fr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parcs.canada.ca
out\fr\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\fr\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parcs.canada.ca
out\fr\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — parcs.canada.ca
out\fr\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\hr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\hr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\hr\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\hr\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\hr\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\hr\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\hu\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\hu\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\hu\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\hu\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\hu\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\hu\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\id\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\id\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\id\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\id\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\id\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\id\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\it\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\it\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\it\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\it\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\it\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\it\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\ja\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\ja\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ja\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ja\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ja\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ja\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\ko\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\ko\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ko\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ko\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ko\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ko\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\lt\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\lt\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\lt\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\lt\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\lt\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\lt\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\lv\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\lv\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\lv\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\lv\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\lv\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\lv\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\nl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\nl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\nl\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\nl\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\nl\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\nl\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\no\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\no\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\no\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\no\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\no\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\no\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\pl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\pl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pl\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pl\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pl\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pl\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\pt\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\pt\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pt\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pt\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pt\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pt\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\pt-BR\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\pt-BR\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pt-BR\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pt-BR\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\pt-BR\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\pt-BR\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\ro\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\ro\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ro\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ro\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ro\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ro\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\ru\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\ru\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ru\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ru\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\ru\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\ru\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\sk\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\sk\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sk\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sk\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sk\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sk\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\sl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\sl\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sl\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sl\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sl\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sl\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\sv\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\sv\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sv\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sv\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\sv\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\sv\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\th\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\th\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\th\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\th\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\th\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\th\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\tr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\tr\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\tr\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\tr\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\tr\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\tr\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\uk\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\uk\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\uk\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\uk\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\uk\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\uk\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca
out\vi\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — isde.canada.ca
out\vi\canada\canada-canoe-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\vi\canada\canada-maple-leaf-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\vi\canada\canada-moose-dot-to-dot-puzzle\index.html:1 — parks.canada.ca
out\vi\canada\canada-polar-bear-dot-to-dot-puzzle\index.html:1 — www.canada.ca
out\vi\canada\canada-raccoon-dot-to-dot-puzzle\index.html:1 — www.thecanadianencyclopedia.ca

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 932

- Array []
+ Array [
+   Object {
+     "filePath": "out\\ar\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ar\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ar\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ar\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ar\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ar\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\cs\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\da\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\de\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\el\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\en\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\es\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fi\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parcs.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parcs.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parcs.canada.ca",
+   },
+   Object {
+     "filePath": "out\\fr\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hr\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\hu\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\id\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\it\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ja\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ko\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lt\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\lv\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\nl\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\no\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pl\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\pt-BR\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ro\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\ru\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sk\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sl\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\sv\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\th\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\tr\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\uk\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "isde.canada.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-canoe-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-maple-leaf-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-moose-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "parks.canada.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-polar-bear-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.canada.ca",
+   },
+   Object {
+     "filePath": "out\\vi\\canada\\canada-raccoon-dot-to-dot-puzzle\\index.html",
+     "line": 1,
+     "token": "www.thecanadianencyclopedia.ca",
+   },
+ ]
```

# Test source

```ts
  30  | );
  31  | const i18nNamespaces = new Set([...allTranslationKeys].map((key) => key.split('.')[0]));
  32  | 
  33  | function getHtmlFiles(directory: string): string[] {
  34  |   return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  35  |     const entryPath = path.join(directory, entry.name);
  36  | 
  37  |     if (entry.isDirectory()) return getHtmlFiles(entryPath);
  38  |     return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  39  |   });
  40  | }
  41  | 
  42  | function lineNumber(content: string, characterIndex: number): number {
  43  |   return content.slice(0, characterIndex).split('\n').length;
  44  | }
  45  | 
  46  | function replaceWithWhitespace(value: string): string {
  47  |   return value.replace(/[^\n]/g, ' ');
  48  | }
  49  | 
  50  | test('static HTML contains no untranslated i18n keys', () => {
  51  |   expect(fs.existsSync(buildDirectory), 'Run npm run build before this test.').toBe(true);
  52  | 
  53  |   // Matches dotted key paths. The full locale key catalog below also catches
  54  |   // every known key, while namespaces catch typoed/missing leaf keys.
  55  |   const i18nKeyPattern = /\b[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+\b/g;
  56  |   const occurrences: Array<{ filePath: string; line: number; key: string }> = [];
  57  | 
  58  |   for (const filePath of getHtmlFiles(buildDirectory)) {
  59  |     const content = fs.readFileSync(filePath, 'utf8');
  60  |     // Scan only rendered text nodes. This excludes URLs, asset names, and the
  61  |     // Next.js payload in attributes/scripts while retaining original offsets.
  62  |     const visibleText = content
  63  |       .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, replaceWithWhitespace)
  64  |       .replace(/<!--(?:[\s\S]*?)-->/g, replaceWithWhitespace)
  65  |       .replace(/<[^>]*>/g, replaceWithWhitespace);
  66  | 
  67  |     for (const match of visibleText.matchAll(i18nKeyPattern)) {
  68  |       const key = match[0];
  69  |       if (!allTranslationKeys.has(key) && !i18nNamespaces.has(key.split('.')[0])) continue;
  70  | 
  71  |       occurrences.push({
  72  |         filePath: path.relative(process.cwd(), filePath),
  73  |         line: lineNumber(content, match.index ?? 0),
  74  |         key,
  75  |       });
  76  |     }
  77  |   }
  78  | 
  79  |   const report = occurrences
  80  |     .map(({ filePath, line, key }) => `${filePath}:${line} — ${key}`)
  81  |     .join('\n');
  82  | 
  83  |   expect(occurrences, `Untranslated i18n keys found:\n${report}`).toEqual([]);
  84  | });
  85  | 
  86  | // Reverse scan: instead of matching against the known key catalog, flag ANY
  87  | // dotted key-shaped token in visible text that is not an allowlisted piece of
  88  | // real content. This catches keys from namespaces that don't exist in
  89  | // content/ at all (e.g. a typoed namespace or a missing JSON file).
  90  | const allowedTokens = new Set([
  91  |   'U.S', // "U.S. 250th anniversary" copy
  92  |   'f.eks', // Danish "for eksempel"
  93  |   'H.C', // H.C. Andersen
  94  |   'q.b', // Portuguese "quanto baste"
  95  | ]);
  96  | // Domains, file names, and other URL-ish tokens rendered as text.
  97  | const urlLikePattern = /\.(?:com|org|net|gov|edu|io|co|uk|html)$/i;
  98  | 
  99  | test('static HTML visible text contains no key-shaped tokens (reverse scan)', () => {
  100 |   expect(fs.existsSync(buildDirectory), 'Run npm run build before this test.').toBe(true);
  101 | 
  102 |   const dottedTokenPattern = /\b[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+\b/g;
  103 |   const occurrences: Array<{ filePath: string; line: number; token: string }> = [];
  104 | 
  105 |   for (const filePath of getHtmlFiles(buildDirectory)) {
  106 |     const content = fs.readFileSync(filePath, 'utf8');
  107 |     const visibleText = content
  108 |       .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, replaceWithWhitespace)
  109 |       .replace(/<!--(?:[\s\S]*?)-->/g, replaceWithWhitespace)
  110 |       .replace(/<[^>]*>/g, replaceWithWhitespace);
  111 | 
  112 |     for (const match of visibleText.matchAll(dottedTokenPattern)) {
  113 |       const token = match[0];
  114 |       if (allowedTokens.has(token) || urlLikePattern.test(token)) continue;
  115 |       occurrences.push({
  116 |         filePath: path.relative(process.cwd(), filePath),
  117 |         line: lineNumber(content, match.index ?? 0),
  118 |         token,
  119 |       });
  120 |     }
  121 |   }
  122 | 
  123 |   const report = occurrences
  124 |     .map(({ filePath, line, token }) => `${filePath}:${line} — ${token}`)
  125 |     .join('\n');
  126 | 
  127 |   expect(
  128 |     occurrences,
  129 |     `Key-shaped tokens found in visible text (add real content to the allowlist in this file if legitimate):\n${report}`,
> 130 |   ).toEqual([]);
      |     ^ Error: Key-shaped tokens found in visible text (add real content to the allowlist in this file if legitimate):
  131 | });
  132 | 
```
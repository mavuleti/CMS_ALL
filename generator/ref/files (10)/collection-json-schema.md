# Collection JSON Schema

Each category file is a root object with two siblings: `collection` contains the
landing-page metadata, and `puzzles` contains the existing puzzle entries
unchanged. `collection.header` and `collection.body` preserve the puzzle
namespacing convention without colliding with the same keys on puzzle entries.
There is deliberately no `canonical` field.

## JSON Schema (Draft 2020-12)

Replace the puzzle `$ref` with the project path or `$id` for the existing,
unchanged puzzle-entry schema.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "category-collection.schema.json",
  "type": "object",
  "additionalProperties": false,
  "required": ["collection", "puzzles"],
  "properties": {
    "collection": {
      "type": "object",
      "additionalProperties": false,
      "required": ["header", "body"],
      "properties": {
        "header": {
          "type": "object",
          "additionalProperties": false,
          "required": ["title", "meta_description", "og", "json_ld", "breadcrumb_json_ld"],
          "properties": {
            "title": { "type": "string", "minLength": 30, "maxLength": 60 },
            "meta_description": { "type": "string", "minLength": 70, "maxLength": 158 },
            "og": {
              "type": "object",
              "additionalProperties": false,
              "required": ["title", "description", "image"],
              "properties": {
                "title": { "type": "string", "minLength": 1, "maxLength": 60 },
                "description": { "type": "string", "minLength": 1, "maxLength": 200 },
                "image": { "$ref": "#/$defs/imagePath" }
              }
            },
            "json_ld": {
              "type": "object",
              "additionalProperties": false,
              "required": ["type", "name", "description", "image", "main_entity"],
              "properties": {
                "type": { "const": "CollectionPage" },
                "name": { "type": "string", "minLength": 1, "maxLength": 60 },
                "description": { "type": "string", "minLength": 1, "maxLength": 200 },
                "image": { "$ref": "#/$defs/imagePath" },
                "main_entity": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": ["type", "item_source"],
                  "properties": {
                    "type": { "const": "ItemList" },
                    "item_source": { "const": "puzzles" }
                  }
                }
              }
            },
            "breadcrumb_json_ld": {
              "type": "object",
              "additionalProperties": false,
              "required": ["type", "items"],
              "properties": {
                "type": { "const": "BreadcrumbList" },
                "items": {
                  "type": "array",
                  "minItems": 2,
                  "maxItems": 2,
                  "prefixItems": [
                    { "$ref": "#/$defs/homeCrumb" },
                    { "$ref": "#/$defs/collectionCrumb" }
                  ],
                  "items": false
                }
              }
            }
          }
        },
        "body": {
          "type": "object",
          "additionalProperties": false,
          "required": ["h1", "name", "tagline", "description", "hero_image", "slug"],
          "properties": {
            "h1": { "type": "string", "minLength": 20, "maxLength": 70 },
            "name": { "type": "string", "minLength": 1, "maxLength": 60 },
            "tagline": { "type": "string", "minLength": 1, "maxLength": 80 },
            "description": { "type": "string", "minLength": 50, "maxLength": 300 },
            "hero_image": { "$ref": "#/$defs/imagePath" },
            "slug": { "$ref": "#/$defs/slug" }
          }
        }
      }
    },
    "puzzles": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "puzzle-entry.schema.json" }
    }
  },
  "$defs": {
    "slug": {
      "type": "string",
      "minLength": 1,
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "routePath": {
      "type": "string",
      "pattern": "^/(?:[a-z0-9]+(?:-[a-z0-9]+)*/)*$"
    },
    "imagePath": {
      "type": "string",
      "pattern": "^/(?:[A-Za-z0-9._~-]+/)*[A-Za-z0-9._~-]+\\.(?:jpg|jpeg|png|webp|gif|svg)$"
    },
    "homeCrumb": {
      "type": "object",
      "additionalProperties": false,
      "required": ["position", "name", "path"],
      "properties": {
        "position": { "const": 1 },
        "name": { "const": "Home" },
        "path": { "const": "/" }
      }
    },
    "collectionCrumb": {
      "type": "object",
      "additionalProperties": false,
      "required": ["position", "name", "path"],
      "properties": {
        "position": { "const": 2 },
        "name": { "type": "string", "minLength": 1, "maxLength": 60 },
        "path": { "$ref": "#/$defs/routePath" }
      }
    }
  }
}
```

## Structured-data design

`CollectionPage` describes the landing page. Its `mainEntity` is an `ItemList`
generated from `puzzles` in display order. This is more precise than describing
the page itself as only an `ItemList`, and it remains distinct from each puzzle's
`CreativeWork` data.

`item_source` is a build instruction, not schema.org output. The renderer:

1. Converts stored `type` keys to `@type` and adds `@context`.
2. Replaces `main_entity` with `mainEntity: { "@type": "ItemList", ... }`.
3. Generates `itemListElement` from the sibling `puzzles` array and omits
   `item_source` from emitted JSON-LD.
4. Resolves stored asset and route paths against the configured public base.

The stored breadcrumb has only stable Home and Collection items. The collection
page emits both. A puzzle build clones those items and appends position 3 using
that puzzle's `body.name` and route derived from its `slug`, then emits standard
`itemListElement`/`ListItem` JSON-LD. Thus individual puzzle data does not repeat
collection labels or paths.

## Worked `flowers` example

The representative puzzle entry below retains the existing entry shape. The
real file keeps all other existing flower entries after it in the same array.

```json
{
  "collection": {
    "header": {
      "title": "Free Flower Dot to Dot Puzzles to Print",
      "meta_description": "Explore free flower dot to dot puzzles for kids, from simple blooms to detailed petals, with printable activities for several skill levels.",
      "og": {
        "title": "Free Flower Dot to Dot Puzzles to Print",
        "description": "Connect the dots across a garden of free printable flower puzzles for children.",
        "image": "/images/flowers/flowers-dot-to-dot-collection.webp"
      },
      "json_ld": {
        "type": "CollectionPage",
        "name": "Flower Dot to Dot Puzzles",
        "description": "A collection of free printable flower dot to dot puzzles for children at several skill levels.",
        "image": "/images/flowers/flowers-dot-to-dot-collection.webp",
        "main_entity": { "type": "ItemList", "item_source": "puzzles" }
      },
      "breadcrumb_json_ld": {
        "type": "BreadcrumbList",
        "items": [
          { "position": 1, "name": "Home", "path": "/" },
          { "position": 2, "name": "Flowers", "path": "/flowers/" }
        ]
      }
    },
    "body": {
      "h1": "Free Printable Flower Dot to Dot Puzzles",
      "name": "Flowers",
      "tagline": "Connect the dots and watch a garden bloom.",
      "description": "Choose a free flower dot to dot puzzle and trace each numbered path to reveal a bloom. The collection includes approachable outlines and detailed challenges for growing confidence, pencil control, and number sequencing.",
      "hero_image": "/images/flowers/flowers-dot-to-dot-collection.webp",
      "slug": "flowers"
    }
  },
  "puzzles": [
    {
      "slug": "flax-flower-dot-to-dot-puzzle",
      "header": {
        "title": "Flax Flower Dot to Dot: Print a 90-Dot Blue Bloom PDF",
        "meta_description": "Flax has supplied linen fibre for thousands of years. Build its delicate flower across 90 dots with a free printable PDF for kids ages 6-10.",
        "og": {
          "title": "Flax Flower Dot to Dot: Print a 90-Dot Blue Bloom PDF",
          "description": "Flax has supplied linen fibre for thousands of years. Build its delicate flower across 90 dots with a free printable PDF for kids ages 6-10.",
          "image_alt": "Blue flax flower revealed by 90 numbered dots in this free dot to dot printable"
        },
        "json_ld": {
          "type": "CreativeWork",
          "name": "Flax Flower",
          "description": "Flax has supplied linen fibre for thousands of years. Build its delicate flower across 90 dots with a free printable PDF for kids ages 6-10.",
          "image": "/images/flowers/flax-flower-dot-to-dot.png",
          "educational_use": "Fine motor skills, number sequencing",
          "age_range": "6-10"
        }
      },
      "body": {
        "h1": "Flax Flower Dot to Dot: Print a 90-Dot Blue Bloom PDF",
        "name": "Flax Flower",
        "tagline": "Reveal a Delicate Blue Flax Flower!",
        "description": "Connect 90 dots to reveal a graceful flax flower. This medium-level printable helps children practise number sequencing, pencil control, visual tracking, patience, and concentration.",
        "fun_fact": "Flax stems contain strong fibres that people have used for thousands of years to make linen fabric.",
        "dot_guide": {
          "intro": "This 90-dot flax plant grows from a delicate five-petalled flower into a slender stem and narrow leaves.",
          "sections": [
            {
              "range": "1-18",
              "title": "The Flower Centre",
              "learn": "Connect dots 1 through 18 carefully around the small centre of the flax flower.",
              "fact": "A flax flower usually has five petals arranged around a neat central cluster."
            }
          ],
          "outro": "Your flax flower is complete! Colour the petals sky blue, violet, pink, or white.",
          "color_schemes": [
            {
              "name": "Classic Sky Blue Flax",
              "note": "Wild blue flax has delicate blue petals crossed by fine radiating lines.",
              "mapping": [
                {
                  "range": "1-18",
                  "part": "Flower centre",
                  "color": "Crayola Yellow",
                  "hex": "#FCE883",
                  "why": "The warm centre gives the pale blue bloom a bright focal point."
                }
              ]
            }
          ]
        }
      }
    }
  ]
}
```

## Validation rules to add to `puzzle-json-schema.md`

| Field | Required | Min | Max / format |
|---|:---:|:---:|---|
| `collection` | yes | - | object; no unknown fields |
| `collection.header.title` | yes | 30 | 60 characters |
| `collection.header.meta_description` | yes | 70 | 158 characters |
| `collection.header.og.title` | yes | 1 | 60 characters |
| `collection.header.og.description` | yes | 1 | 200 characters |
| `collection.header.og.image` | yes | - | relative supported image path |
| `collection.header.json_ld.type` | yes | - | exactly `CollectionPage` |
| `collection.header.json_ld.name` | yes | 1 | 60 characters |
| `collection.header.json_ld.description` | yes | 1 | 200; matches visible copy |
| `collection.header.json_ld.image` | yes | - | relative supported image path |
| `collection.header.json_ld.main_entity.type` | yes | - | exactly `ItemList` |
| `collection.header.json_ld.main_entity.item_source` | yes | - | exactly `puzzles`; build-only |
| `collection.header.breadcrumb_json_ld.items` | yes | 2 items | Home then Collection |
| `collection.body.h1` | yes | 20 | 70 characters |
| `collection.body.name` | yes | 1 | 60 characters |
| `collection.body.tagline` | yes | 1 | 80 characters |
| `collection.body.description` | yes | 50 | 300 characters |
| `collection.body.hero_image` | yes | - | relative supported image path |
| `collection.body.slug` | yes | 1 | lowercase kebab case; unique |
| `puzzles` | yes | 1 item | existing puzzle rules unchanged |

Asset paths start with exactly one `/`, contain no scheme, host, query, fragment,
backslash, or `..` segment, and are relative to the configured assets root.
Images end in `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.svg`; PDF paths end
in `.pdf`. Apply the rule at collection and puzzle levels. Breadcrumb route paths
are likewise root-relative; the renderer makes them absolute in emitted JSON-LD.

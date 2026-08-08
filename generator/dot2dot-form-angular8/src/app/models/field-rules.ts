// Central place for validation limits so the form and the UI hints
// (e.g. "20-70 characters") never drift apart.

export const FIELD_RULES = {
  slug: { required: true },
  header: {
    title: { required: true, minLength: 30, maxLength: 60 },
    meta_description: { required: true, minLength: 70, maxLength: 160 },
    og: {
      title: { required: true, maxLength: 60 },
      description: { required: true, maxLength: 200 },
      image_alt: { required: true, maxLength: 125 }
    },
    json_ld: {
      type: { required: true },
      name: { required: true },
      description: { required: true, maxLength: 200 },
      image: { required: true },
      educational_use: { required: true },
      age_range: { required: true }
    }
  },
  body: {
    h1: { required: true, minLength: 20, maxLength: 70 },
    name: { required: true, maxLength: 60 },
    tagline: { required: true, maxLength: 80 },
    description: { required: true, minLength: 50, maxLength: 300 },
    fun_fact: { required: true, minLength: 20, maxLength: 400 },
    dot_guide: {
      intro: { required: true, minLength: 50 },
      outro: { required: true, minLength: 20 },
      section: {
        range: { required: true },
        title: { required: true, maxLength: 60 },
        learn: { required: true, minLength: 20 },
        fact: { required: true, minLength: 20 }
      },
      colorScheme: {
        name: { required: true },
        note: { required: true },
        mapping: {
          range: { required: true },
          part: { required: true },
          color: { required: true },
          hex: { required: true },
          why: { required: true }
        }
      }
    }
  }
};

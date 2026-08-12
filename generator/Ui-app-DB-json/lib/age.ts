type Translator = (key: string, values?: Record<string, string | number>) => string;

export function getAgeRange(age: string) {
  const match = age.match(/(\d+)[-–](\d+)/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
}

// Localizes a hardcoded English age string like "Ages 6-9" via the
// common.ageRange message template; falls back to the raw string.
export function localizeAge(tc: Translator, age: string) {
  const range = getAgeRange(age);
  return range ? tc('ageRange', range) : age;
}

// Bare numeric range ("6-9") for use after an explicit label like
// puzzleDetail.agesLabel, avoiding "Ages: Ages 6-9" duplication.
export function bareAgeRange(age: string) {
  const range = getAgeRange(age);
  return range ? `${range.min}-${range.max}` : age;
}

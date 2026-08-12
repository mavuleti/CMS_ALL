type MessageValue = string | { [key: string]: MessageValue };
type MessageTree = { [key: string]: MessageValue };

function isPlainObject(value: unknown): value is MessageTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mergeMessages(base: MessageTree, override: MessageTree): MessageTree {
  const result: MessageTree = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = base[key];
    const overrideValue = override[key];

    result[key] =
      isPlainObject(baseValue) && isPlainObject(overrideValue)
        ? mergeMessages(baseValue, overrideValue)
        : overrideValue;
  }

  return result;
}

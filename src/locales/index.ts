/**
 * Purpose: Simple localization helper for English strings.
 * Author: EventCompanion Team
 * Responsibility: Provide typed string lookup with interpolation support.
 */

import en from './en.json';

type LocaleObject = typeof en;

const getNested = (obj: any, path: string[]) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const interpolate = (value: string, params?: Record<string, string | number>) => {
  if (!params) return value;
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(new RegExp(`{{${key}}}`, 'g'), String(params[key])),
    value,
  );
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const value = getNested(en, key.split('.'));
  if (typeof value === 'string') {
    return interpolate(value, params);
  }
  return key;
};

export type { LocaleObject };
export default en;

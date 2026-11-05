/** Правило проверки поля: возвращает текст ошибки или null, если значение подходит. */
export type Validator = (value: string) => string | null;

export type FormRules<T> = { [K in keyof T]?: Validator[] };
export type FormErrors<T> = { [K in keyof T]?: string };

export const required =
  (message: string): Validator =>
  (value) =>
    value.trim() === '' ? message : null;

export const minLength =
  (min: number, message: string): Validator =>
  (value) =>
    value.trim().length < min ? message : null;

export const maxLength =
  (max: number, message: string): Validator =>
  (value) =>
    value.trim().length > max ? message : null;

export const matches =
  (pattern: RegExp, message: string): Validator =>
  (value) =>
    pattern.test(value.trim()) ? null : message;

export function validate<T>(values: T, rules: FormRules<T>): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const key of Object.keys(rules) as (keyof T)[]) {
    for (const rule of rules[key] ?? []) {
      const message = rule(String(values[key]));
      if (message) {
        errors[key] = message;
        break;
      }
    }
  }
  return errors;
}

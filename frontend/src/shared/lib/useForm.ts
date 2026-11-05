import { ChangeEvent, FormEvent, useState } from 'react';
import { FormRules, validate } from './validation';

type StringFields<T> = { [K in keyof T]: string };

interface UseFormOptions<T> {
  initialValues: T;
  rules: FormRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * Состояние формы. Ошибка поля появляется после ухода с него или попытки отправки,
 * чтобы не ругать пользователя, пока он ещё печатает.
 */
export function useForm<T extends StringFields<T>>({ initialValues, rules, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = validate(values, rules);
  const errorOf = <K extends keyof T>(name: K) => (touched[name] ? errors[name] : undefined);

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /** Свойства для TextField: значение, обработчики и текст ошибки. */
  const field = <K extends keyof T>(name: K) => ({
    name: String(name),
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(name, e.target.value as T[K]),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    error: Boolean(errorOf(name)),
    helperText: errorOf(name),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalid = Object.keys(errors) as (keyof T & string)[];
    if (invalid.length > 0) {
      setTouched(Object.fromEntries(invalid.map((name) => [name, true])) as { [K in keyof T]?: boolean });
      const first = e.currentTarget.elements.namedItem(invalid[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить форму');
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
  };

  return { values, field, setValue, errorOf, handleSubmit, submitting, submitError };
}

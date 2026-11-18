import { ChangeEvent, FormEvent, useState } from 'react';
import { ApiError } from '@/shared/api/http';
import { FormErrors, FormRules, validate } from './validation';

type StringFields<T> = { [K in keyof T]: string };

interface UseFormOptions<T> {
  initialValues: T;
  rules: FormRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
  /** Если поле в API называется иначе, чем в форме: { customer_name: 'name' }. */
  serverFields?: Record<string, keyof T>;
}

/**
 * Состояние формы. Ошибка поля появляется после ухода с него или попытки отправки,
 * чтобы не ругать пользователя, пока он ещё печатает.
 * Ошибки полей из ответа сервера (422) показываются под теми же полями.
 */
export function useForm<T extends StringFields<T>>({ initialValues, rules, onSubmit, serverFields }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [serverErrors, setServerErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = validate(values, rules);
  const errorOf = <K extends keyof T>(name: K) => (touched[name] ? errors[name] ?? serverErrors[name] : undefined);

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // После исправления поля ошибка сервера к нему уже не относится
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const showServerErrors = (error: ApiError) => {
    const found: FormErrors<T> = {};
    for (const [apiName, message] of Object.entries(error.fields)) {
      const name = serverFields?.[apiName] ?? (apiName as keyof T);
      if (name in values) found[name] = message;
    }
    setServerErrors(found);
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(found).map((name) => [name, true])) }));
  };

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
    setServerErrors({});
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ApiError) showServerErrors(error);
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить форму');
    } finally {
      setSubmitting(false);
    }
  };

  return { values, field, setValue, errorOf, handleSubmit, submitting, submitError };
}

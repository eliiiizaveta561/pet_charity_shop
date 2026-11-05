import { DependencyList, useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { getDemoMode, subscribeDemoMode } from '@/shared/api/demo';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

/** Загружает данные при появлении компонента и при изменении deps. */
export function useAsyncData<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const demoMode = useSyncExternalStore(subscribeDemoMode, getDemoMode);

  useEffect(() => {
    // Ответ устаревшего запроса не должен перезаписать данные нового.
    let cancelled = false;
    setState({ status: 'loading' });
    load()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', message: error instanceof Error ? error.message : 'Не удалось загрузить данные' });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt, demoMode]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return { state, reload };
}

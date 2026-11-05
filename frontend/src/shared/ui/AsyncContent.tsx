import { ReactNode } from 'react';
import { AsyncState } from '@/shared/lib/useAsyncData';
import ErrorState from './ErrorState';

interface AsyncContentProps<T> {
  state: AsyncState<T>;
  onRetry: () => void;
  loading: ReactNode;
  isEmpty: (data: T) => boolean;
  empty: ReactNode;
  children: (data: T) => ReactNode;
}

/** Показывает одно из четырёх состояний экрана: загрузка, ошибка, нет данных, данные. */
export default function AsyncContent<T>({ state, onRetry, loading, isEmpty, empty, children }: AsyncContentProps<T>) {
  if (state.status === 'loading') return <>{loading}</>;
  if (state.status === 'error') return <ErrorState message={state.message} onRetry={onRetry} />;
  if (isEmpty(state.data)) return <>{empty}</>;
  return <>{children(state.data)}</>;
}

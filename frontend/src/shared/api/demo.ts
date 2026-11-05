/**
 * Имитация запросов к серверу на демонстрационных данных.
 * Слой api сущностей работает с промисами, поэтому при подключении backend
 * заменится только тело их функций, а страницы останутся без изменений.
 */
export type DemoMode = 'normal' | 'slow' | 'error' | 'empty';

const DELAY: Record<DemoMode, number> = { normal: 500, slow: 3000, error: 500, empty: 500 };

let mode: DemoMode = 'normal';
const listeners = new Set<() => void>();

export const getDemoMode = (): DemoMode => mode;

export function setDemoMode(next: DemoMode): void {
  mode = next;
  listeners.forEach((listener) => listener());
}

export function subscribeDemoMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** @param emptyData что вернуть в режиме «нет данных»; у запросов записи его нет. */
export function demoRequest<T>(getData: () => T, emptyData?: T): Promise<T> {
  const current = mode;
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (current === 'error') {
        reject(new Error('Сервер недоступен. Проверьте соединение и попробуйте ещё раз.'));
      } else {
        resolve(current === 'empty' && emptyData !== undefined ? emptyData : getData());
      }
    }, DELAY[current]);
  });
}

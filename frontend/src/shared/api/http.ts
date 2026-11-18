/**
 * Клиент API. Все запросы к backend идут через функцию request.
 *
 * Access token хранится только в памяти (в переменной модуля), поэтому его нельзя
 * украсть из localStorage. Refresh token лежит в httpOnly cookie: JavaScript его
 * не видит, браузер сам отправляет cookie на /api/auth/refresh.
 */
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Ошибки отдельных полей из ответа 422: имя поля -> текст ошибки. */
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

interface ErrorBody {
  detail?: unknown;
  errors?: { field: string; message: string }[];
}

let accessToken: string | null = null;
let refreshing: Promise<unknown> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/** Вызывается, когда обновить токен не удалось и пользователя нужно разлогинить. */
export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body: ErrorBody | null = await response.json().catch(() => null);

  const fields: Record<string, string> = {};
  for (const error of body?.errors ?? []) {
    fields[error.field] = error.message;
  }

  if (response.status === 422 && body?.errors?.length) {
    const details = body.errors.map((error) => error.message).join('; ');
    return new ApiError(`Проверьте введённые данные: ${details}`, 422, fields);
  }
  if (typeof body?.detail === 'string') {
    return new ApiError(body.detail, response.status, fields);
  }
  if (response.status >= 500) {
    return new ApiError('Сервер недоступен или произошла ошибка. Попробуйте позже.', response.status);
  }
  return new ApiError(`Ошибка запроса (${response.status})`, response.status);
}

async function send(path: string, method: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'include',
    });
  } catch {
    throw new ApiError('Сервер недоступен. Проверьте соединение и попробуйте ещё раз.', 0);
  }
}

async function doRefresh(): Promise<unknown> {
  const response = await send('/auth/refresh', 'POST');
  if (!response.ok) {
    accessToken = null;
    throw await toApiError(response);
  }
  const data = (await response.json()) as { access_token: string };
  accessToken = data.access_token;
  return data;
}

/**
 * Обновляет access token по refresh token из cookie.
 * Если несколько запросов одновременно получили 401, обновление выполняется один раз:
 * старый refresh token после использования отзывается, второй такой же запрос получил бы отказ.
 */
export function refreshSession<T>(): Promise<T> {
  refreshing ??= doRefresh().finally(() => {
    refreshing = null;
  });
  return refreshing as Promise<T>;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const hadToken = accessToken !== null;
  let response = await send(path, method, body);

  // Access token истёк: получаем новый по refresh token и повторяем запрос один раз
  if (response.status === 401 && hadToken && !path.startsWith('/auth/')) {
    try {
      await refreshSession();
    } catch {
      onSessionExpired?.();
      throw new ApiError('Сессия истекла. Войдите снова.', 401);
    }
    response = await send(path, method, body);
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

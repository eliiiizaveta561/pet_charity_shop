import MessageScreen from '@/shared/ui/MessageScreen';

export default function NotFoundPage() {
  return (
    <MessageScreen
      title="Страница не найдена"
      text="Проверьте адрес или вернитесь на главную."
      actionLabel="На главную"
      actionTo="/"
    />
  );
}

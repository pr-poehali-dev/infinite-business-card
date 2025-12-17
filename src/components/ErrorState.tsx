import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: string;
}

const ErrorState = ({ 
  title = "Что-то пошло не так",
  message = "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте ещё раз.",
  onRetry,
  icon = "AlertCircle"
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-destructive/10 rounded-full p-4 mb-4">
        <Icon name={icon} size={48} className="text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          <Icon name="RefreshCw" className="mr-2" size={16} />
          Попробовать снова
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

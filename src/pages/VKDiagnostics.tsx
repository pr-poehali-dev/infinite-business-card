import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface DiagnosticStep {
  name: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
  details?: string;
}

const VKDiagnostics = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<DiagnosticStep[]>([
    { name: 'Проверка redirect_uri', status: 'pending' },
    { name: 'Проверка backend функции', status: 'pending' },
    { name: 'Проверка VK_APP_ID', status: 'pending' },
    { name: 'Проверка VK_SECRET_KEY', status: 'pending' },
    { name: 'Получение auth_url от VK', status: 'pending' },
  ]);

  const updateStep = (index: number, updates: Partial<DiagnosticStep>) => {
    setSteps(prev => prev.map((step, i) => i === index ? { ...step, ...updates } : step));
  };

  const runDiagnostics = async () => {
    updateStep(0, { status: 'loading' });
    const redirectUri = window.location.origin + '/auth/vk';
    updateStep(0, { 
      status: 'success', 
      message: redirectUri,
      details: 'Этот URL должен быть добавлен в настройках VK приложения'
    });

    updateStep(1, { status: 'loading' });
    try {
      const testResponse = await fetch('https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55', {
        method: 'OPTIONS'
      });
      
      if (testResponse.ok) {
        updateStep(1, { 
          status: 'success', 
          message: 'Backend функция доступна',
          details: 'CORS настроен правильно'
        });
      } else {
        updateStep(1, { 
          status: 'error', 
          message: `Статус: ${testResponse.status}`,
          details: 'Backend функция недоступна'
        });
        return;
      }
    } catch (error: any) {
      updateStep(1, { 
        status: 'error', 
        message: error.message,
        details: 'Не удалось подключиться к backend'
      });
      return;
    }

    updateStep(2, { status: 'loading' });
    updateStep(3, { status: 'loading' });
    updateStep(4, { status: 'loading' });

    try {
      const response = await fetch(
        'https://functions.poehali.dev/74d0ac96-7cc9-4254-86f4-508ca9a70f55?redirect_uri=' + 
        encodeURIComponent(redirectUri)
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes('VK credentials not configured')) {
          updateStep(2, { 
            status: 'error', 
            message: 'Секрет не настроен',
            details: 'Добавьте VK_APP_ID в секреты проекта'
          });
          updateStep(3, { 
            status: 'error', 
            message: 'Секрет не настроен',
            details: 'Добавьте VK_SECRET_KEY в секреты проекта'
          });
          updateStep(4, { 
            status: 'error', 
            message: 'Невозможно без секретов',
            details: 'Сначала настройте VK_APP_ID и VK_SECRET_KEY'
          });
        } else {
          updateStep(2, { status: 'error', message: data.error });
          updateStep(3, { status: 'error', message: data.error });
          updateStep(4, { status: 'error', message: data.error });
        }
        return;
      }

      if (data.auth_url) {
        updateStep(2, { 
          status: 'success', 
          message: 'Секрет настроен',
          details: 'VK_APP_ID найден'
        });
        updateStep(3, { 
          status: 'success', 
          message: 'Секрет настроен',
          details: 'VK_SECRET_KEY найден'
        });
        updateStep(4, { 
          status: 'success', 
          message: 'URL получен',
          details: data.auth_url.substring(0, 60) + '...'
        });
      } else {
        updateStep(4, { 
          status: 'error', 
          message: 'auth_url не получен',
          details: 'Backend не вернул URL авторизации'
        });
      }
    } catch (error: any) {
      updateStep(2, { status: 'error', message: error.message });
      updateStep(3, { status: 'error', message: error.message });
      updateStep(4, { status: 'error', message: error.message });
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Icon name="Loader2" size={20} className="animate-spin text-blue-500" />;
      case 'success':
        return <Icon name="CheckCircle2" size={20} className="text-green-500" />;
      case 'error':
        return <Icon name="XCircle" size={20} className="text-red-500" />;
      default:
        return <Icon name="Circle" size={20} className="text-gray-400" />;
    }
  };

  const allSuccess = steps.every(s => s.status === 'success');
  const hasErrors = steps.some(s => s.status === 'error');

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Диагностика VK авторизации</h1>
            <p className="text-muted-foreground">
              Проверка настроек и конфигурации VK OAuth
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">{step.name}</div>
                    {step.message && (
                      <div className={`text-sm ${
                        step.status === 'error' ? 'text-red-600' : 
                        step.status === 'success' ? 'text-green-600' : 
                        'text-muted-foreground'
                      }`}>
                        {step.message}
                      </div>
                    )}
                    {step.details && (
                      <div className="text-xs text-muted-foreground mt-1 font-mono bg-muted p-2 rounded">
                        {step.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {allSuccess && (
          <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle2" size={24} className="text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">
                  Все проверки пройдены!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  VK авторизация настроена правильно. Убедитесь, что в настройках VK приложения:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mb-4 list-disc list-inside">
                  <li>Приложение переведено в статус "Работает"</li>
                  <li>Redirect URI добавлен: {window.location.origin}/auth/vk</li>
                  <li>Включён доступ к email пользователя</li>
                </ul>
                <Button 
                  onClick={() => navigate('/')} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Попробовать войти
                </Button>
              </div>
            </div>
          </Card>
        )}

        {hasErrors && (
          <Card className="p-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={24} className="text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">
                  Обнаружены проблемы
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Для решения проблем:
                </p>
                <div className="space-y-3">
                  {steps.filter(s => s.status === 'error').map((step, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-3 rounded border border-red-200 dark:border-red-800">
                      <div className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
                        {step.name}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">
                        {step.details || step.message}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100">
                    Как получить VK_APP_ID и VK_SECRET_KEY:
                  </h4>
                  <ol className="text-sm text-red-700 dark:text-red-300 space-y-2 list-decimal list-inside">
                    <li>Перейдите на <a href="https://dev.vk.com/" target="_blank" rel="noopener noreferrer" className="underline">dev.vk.com</a></li>
                    <li>Создайте новое приложение (тип: Веб-сайт)</li>
                    <li>В настройках приложения найдите ID приложения (VK_APP_ID)</li>
                    <li>Там же найдите Защищённый ключ (VK_SECRET_KEY)</li>
                    <li>Добавьте Redirect URI: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{window.location.origin}/auth/vk</code></li>
                    <li>Переведите приложение в статус "Работает"</li>
                  </ol>
                </div>

                <Button 
                  onClick={runDiagnostics} 
                  variant="outline"
                  className="mt-4 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Проверить снова
                </Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Полезные ссылки:</p>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="https://dev.vk.com/ru/apps/create" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    Создать приложение VK
                  </a>
                </li>
                <li>
                  <a 
                    href="https://dev.vk.com/ru/reference/access-token/getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    Документация VK OAuth
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VKDiagnostics;

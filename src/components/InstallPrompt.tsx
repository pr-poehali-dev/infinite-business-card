import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Показываем промпт через 3 секунды после загрузки
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA установлено');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Сохраняем в localStorage, чтобы не показывать снова
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Не показываем если уже отклонили
  if (localStorage.getItem('installPromptDismissed') === 'true') {
    return null;
  }

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-fade-in">
      <div className="bg-card border border-gold/30 rounded-lg shadow-2xl p-4 glass-effect">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Download" className="text-black" size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">
              Установить приложение
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Добавьте ∞7 на главный экран для быстрого доступа
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-gold text-black hover:bg-gold/90"
                onClick={handleInstall}
              >
                Установить
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={handleDismiss}
              >
                Позже
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

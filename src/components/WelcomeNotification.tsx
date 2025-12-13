import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface WelcomeNotificationProps {
  userName?: string;
  onStartTour: () => void;
}

const WelcomeNotification = ({ userName = 'друг', onStartTour }: WelcomeNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('welcome_notification_seen');
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    if (!hasSeenWelcome && onboardingCompleted === 'true') {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('welcome_notification_seen', 'true');
  };

  const handleStartTour = () => {
    handleDismiss();
    onStartTour();
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="bg-gradient-to-br from-green to-blue rounded-2xl shadow-2xl p-6 text-white">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            >
              <Icon name="X" size={14} />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">
                  С возвращением, {userName}! 🎉
                </h3>
                <p className="text-sm text-white/80">
                  Ваш аккаунт успешно создан
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle2" size={16} />
                  <span className="text-sm font-semibold">Что дальше?</span>
                </div>
                <ul className="text-xs space-y-1 text-white/80">
                  <li>• Заполните информацию о себе</li>
                  <li>• Выберите дизайн визитки</li>
                  <li>• Поделитесь ссылкой с клиентами</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleStartTour}
                className="flex-1 bg-white text-green hover:bg-white/90 font-semibold"
                size="sm"
              >
                <Icon name="Route" className="mr-2" size={16} />
                Начать тур
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                Позже
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeNotification;

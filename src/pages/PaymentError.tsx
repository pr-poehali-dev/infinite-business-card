import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const PaymentError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Произошла ошибка при обработке платежа';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="XCircle" size={48} className="text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">Ошибка оплаты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            {errorMessage}
          </p>

          <div className="bg-muted/30 p-4 rounded-lg text-left">
            <p className="text-sm font-semibold mb-2">Возможные причины:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="CircleDot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Недостаточно средств на карте</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CircleDot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Карта заблокирована или просрочена</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CircleDot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Превышен лимит операций</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CircleDot" size={16} className="mt-0.5 flex-shrink-0" />
                <span>Технические неполадки банка</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              className="w-full bg-gold text-black hover:bg-gold/90"
              onClick={() => navigate('/')}
            >
              <Icon name="RotateCcw" className="mr-2" size={18} />
              Попробовать снова
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <Icon name="Home" className="mr-2" size={18} />
              Вернуться на главную
            </Button>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Нужна помощь?
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="mailto:support@visitka.site" className="text-gold hover:underline">
                support@visitka.site
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="https://t.me/visitka_support" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                Telegram
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentError;

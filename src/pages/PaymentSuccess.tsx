import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gold/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gold/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="CheckCircle" size={48} className="text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Оплата успешна!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Спасибо за покупку! Ваша подписка успешно активирована.
          </p>
          
          {paymentId && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">ID платежа</p>
              <p className="font-mono text-sm">{paymentId}</p>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Button 
              className="w-full bg-gold text-black hover:bg-gold/90"
              onClick={() => navigate('/')}
            >
              <Icon name="Home" className="mr-2" size={18} />
              Перейти в личный кабинет
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Автоматический переход через 5 секунд...
            </p>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Чек отправлен на вашу почту
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="mailto:support@visitka.site" className="text-gold hover:underline">
                Поддержка
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/faq" className="text-gold hover:underline">
                FAQ
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;

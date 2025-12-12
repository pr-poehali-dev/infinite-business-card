import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const ReferralTab = () => {
  const referralCode = 'IVAN2024';
  const referralLink = `https://visitka.site/ref/${referralCode}`;
  const referralStats = {
    invited: 7,
    registered: 4,
    premiumEarned: 28
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Реферальная ссылка скопирована!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Реферальный код скопирован!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Users" className="text-gold" size={18} />
              Приглашено друзей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{referralStats.invited}</div>
            <p className="text-xs text-muted-foreground mt-1">перешли по ссылке</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="UserCheck" className="text-gold" size={18} />
              Зарегистрировалось
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{referralStats.registered}</div>
            <p className="text-xs text-muted-foreground mt-1">создали визитку</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Gift" className="text-gold" size={18} />
              Заработано дней Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{referralStats.premiumEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">дополнительных дней</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Link" className="text-gold" size={24} />
            Ваша реферальная ссылка
          </CardTitle>
          <CardDescription>
            Получайте +7 дней Premium за каждого приглашённого друга
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Реферальная ссылка</p>
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold/10"
                onClick={handleCopyLink}
              >
                <Icon name="Copy" size={18} />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Реферальный код</p>
            <div className="flex gap-2">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold/10"
                onClick={handleCopyCode}
              >
                <Icon name="Copy" size={18} />
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3">Как работает реферальная программа?</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Поделитесь ссылкой</p>
                  <p className="text-xs text-muted-foreground">Отправьте реферальную ссылку друзьям</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Друг регистрируется</p>
                  <p className="text-xs text-muted-foreground">Ваш друг создаёт визитку по вашей ссылке</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Получайте бонусы</p>
                  <p className="text-xs text-muted-foreground">Вы получаете +7 дней Premium тарифа</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralTab;

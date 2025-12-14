import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const YooKassaSetup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue/5">
      <div className="container max-w-4xl py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Icon name="CreditCard" size={40} className="text-blue" />
            <h1 className="text-4xl font-bold">Настройка ЮKassa</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Подключите платежную систему для приёма оплаты на сайте
          </p>
        </div>

        {/* Step 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Badge className="gradient-bg text-white text-lg px-3 py-1">1</Badge>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Регистрация в ЮKassa</CardTitle>
                <CardDescription className="text-base">
                  Создайте аккаунт на платформе ЮKassa
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>Перейдите на сайт <a href="https://yookassa.ru" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline font-medium">yookassa.ru</a></li>
              <li>Нажмите «Подключить ЮKassa» или «Войти»</li>
              <li>Зарегистрируйтесь как юридическое лицо или ИП</li>
              <li>Заполните данные компании и пройдите верификацию</li>
            </ol>
            
            <div className="bg-yellow/10 border border-yellow/20 rounded-lg p-4 flex gap-3">
              <Icon name="AlertCircle" size={20} className="text-yellow flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Важно:</p>
                <p className="text-muted-foreground">
                  Для работы с ЮKassa требуется статус ИП или ООО. Физические лица не могут подключить платежи.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <a href="https://yookassa.ru" target="_blank" rel="noopener noreferrer">
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть сайт ЮKassa
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Badge className="gradient-bg text-white text-lg px-3 py-1">2</Badge>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Получение ключей API</CardTitle>
                <CardDescription className="text-base">
                  Найдите shopId и secretKey в личном кабинете
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>Войдите в личный кабинет ЮKassa</li>
              <li>Перейдите в раздел <strong>«Интеграция»</strong> → <strong>«API»</strong></li>
              <li>Скопируйте <strong>shopId</strong> (идентификатор магазина)</li>
              <li>Создайте или скопируйте <strong>Секретный ключ</strong></li>
            </ol>

            <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="Key" size={18} className="text-blue" />
                <span className="font-medium">Пример ключей:</span>
              </div>
              
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-background p-3 rounded border">
                  <div className="text-muted-foreground mb-1">shopId:</div>
                  <div className="text-foreground">123456</div>
                </div>
                <div className="bg-background p-3 rounded border">
                  <div className="text-muted-foreground mb-1">secretKey:</div>
                  <div className="text-foreground break-all">live_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6</div>
                </div>
              </div>
            </div>

            <div className="bg-red/10 border border-red/20 rounded-lg p-4 flex gap-3">
              <Icon name="ShieldAlert" size={20} className="text-red flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Безопасность:</p>
                <p className="text-muted-foreground">
                  Никогда не публикуйте секретный ключ в открытом виде. Храните его только в секретах проекта.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Badge className="gradient-bg text-white text-lg px-3 py-1">3</Badge>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Добавление ключей в проект</CardTitle>
                <CardDescription className="text-base">
                  Сохраните ключи как секреты в poehali.dev
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>В редакторе poehali.dev откройте меню <strong>«Настройки»</strong></li>
              <li>Перейдите в раздел <strong>«Секреты»</strong></li>
              <li>Добавьте секрет <code className="bg-muted px-2 py-1 rounded text-xs">YOOKASSA_SHOP_ID</code> со значением вашего shopId</li>
              <li>Добавьте секрет <code className="bg-muted px-2 py-1 rounded text-xs">YOOKASSA_SECRET_KEY</code> со значением секретного ключа</li>
            </ol>

            <div className="bg-green/10 border border-green/20 rounded-lg p-4 flex gap-3">
              <Icon name="CheckCircle2" size={20} className="text-green flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Готово!</p>
                <p className="text-muted-foreground">
                  После добавления секретов платежная система заработает автоматически.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Testing */}
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="Beaker" size={24} className="text-blue" />
              <CardTitle className="text-xl">Тестирование платежей</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              ЮKassa предоставляет тестовую среду для проверки платежей без реальных денег:
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="font-medium">Тестовая банковская карта:</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Номер:</span>
                  <div className="font-mono">5555 5555 5555 4477</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Срок:</span>
                  <div className="font-mono">12/24</div>
                </div>
                <div>
                  <span className="text-muted-foreground">CVC:</span>
                  <div className="font-mono">123</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Имя:</span>
                  <div>CARD HOLDER</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Используйте тестовые ключи из раздела «Тестовые платежи» в личном кабинете ЮKassa для безопасного тестирования.
            </p>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-blue/20 bg-blue/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Icon name="HelpCircle" size={32} className="text-blue flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Нужна помощь?</h3>
                <p className="text-muted-foreground">
                  Если возникли проблемы с настройкой, обратитесь в поддержку ЮKassa или в сообщество poehali.dev
                </p>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://yookassa.ru/docs" target="_blank" rel="noopener noreferrer">
                      <Icon name="BookOpen" size={14} className="mr-1" />
                      Документация
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer">
                      <Icon name="MessageCircle" size={14} className="mr-1" />
                      Сообщество
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YooKassaSetup;

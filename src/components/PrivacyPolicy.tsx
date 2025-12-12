import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicy = ({ open, onOpenChange }: PrivacyPolicyProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Политика обработки персональных данных</DialogTitle>
          <DialogDescription>
            В соответствии с Федеральным законом №152-ФЗ «О персональных данных»
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-lg mb-2">1. Общие положения</h3>
              <p className="text-muted-foreground">
                Настоящая Политика обработки персональных данных (далее — Политика) разработана в соответствии 
                с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных» и определяет порядок обработки 
                персональных данных и меры по обеспечению безопасности персональных данных visitka.site.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. Оператор персональных данных</h3>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Оператор:</strong> visitka.site</p>
                <p><strong>Email:</strong> support@visitka.site</p>
                <p><strong>Адрес:</strong> Российская Федерация</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. Какие данные мы собираем</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>ФИО, должность, название организации</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Данные из социальных сетей (при авторизации через VK, Telegram)</li>
                <li>IP-адрес и технические данные устройства</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. Цели обработки персональных данных</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Регистрация и авторизация пользователей</li>
                <li>Создание и управление цифровыми визитками</li>
                <li>Обработка платежей и управление подписками</li>
                <li>Предоставление технической поддержки</li>
                <li>Улучшение качества сервиса</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. Правовые основания обработки</h3>
              <p className="text-muted-foreground">
                Обработка персональных данных осуществляется на основании:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Согласия субъекта персональных данных (ст. 6 ч.1 152-ФЗ)</li>
                <li>Исполнения договора оказания услуг (ст. 6 ч.1 п.5 152-ФЗ)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. Безопасность данных</h3>
              <p className="text-muted-foreground">
                Мы применяем организационные и технические меры для защиты персональных данных:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Шифрование данных с использованием SSL/TLS протокола</li>
                <li>Контроль доступа к персональным данным</li>
                <li>Регулярное резервное копирование данных</li>
                <li>Хранение данных на серверах в России</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. Передача данных третьим лицам</h3>
              <p className="text-muted-foreground">
                Персональные данные могут передаваться следующим третьим лицам:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>ЮКасса — для обработки платежей</li>
                <li>Хостинг-провайдер — для хранения данных</li>
                <li>Государственные органы — при наличии законных требований</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Все партнёры обязаны соблюдать конфиденциальность и обеспечивать безопасность персональных данных.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. Права субъекта персональных данных</h3>
              <p className="text-muted-foreground">Вы имеете право:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Получать информацию о обработке ваших персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Обжаловать действия оператора в Роскомнадзор или суд</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Для реализации ваших прав напишите на support@visitka.site
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">9. Срок хранения данных</h3>
              <p className="text-muted-foreground">
                Персональные данные хранятся в течение срока действия учётной записи и 3 лет после её удаления 
                для исполнения обязательств перед государственными органами.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">10. Изменение политики</h3>
              <p className="text-muted-foreground">
                Мы вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента 
                публикации на сайте. Рекомендуем регулярно проверять актуальность Политики.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">11. Контактная информация</h3>
              <div className="text-muted-foreground space-y-1">
                <p>По вопросам обработки персональных данных обращайтесь:</p>
                <p><strong>Email:</strong> support@visitka.site</p>
                <p><strong>Telegram:</strong> @visitka_support</p>
              </div>
            </section>

            <section className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Последнее обновление: 12 декабря 2024 года
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;

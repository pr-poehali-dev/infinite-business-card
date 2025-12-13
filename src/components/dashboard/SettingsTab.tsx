import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import NotificationSettings from '../NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    publicProfile: true,
    showEmail: true,
    showPhone: true,
    showWebsite: true,
    allowLeadCapture: true,
    showInSearch: true,
    analyticsEnabled: true
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="notifications">
            <Icon name="Bell" className="mr-2" size={16} />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Icon name="Lock" className="mr-2" size={16} />
            <span className="hidden sm:inline">Приватность</span>
          </TabsTrigger>
          <TabsTrigger value="profile">
            <Icon name="User" className="mr-2" size={16} />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <Icon name="Database" className="mr-2" size={16} />
            <span className="hidden sm:inline">Данные</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Eye" size={20} />
                Видимость визитки
              </CardTitle>
              <CardDescription>
                Управляйте тем, кто может видеть вашу визитку и какую информацию
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Публичный профиль</p>
                  <p className="text-xs text-muted-foreground">
                    Визитка доступна по ссылке всем
                  </p>
                </div>
                <Switch
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, publicProfile: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Показывать email</p>
                  <p className="text-xs text-muted-foreground">
                    Email будет виден посетителям
                  </p>
                </div>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showEmail: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Показывать телефон</p>
                  <p className="text-xs text-muted-foreground">
                    Телефон будет виден посетителям
                  </p>
                </div>
                <Switch
                  checked={settings.showPhone}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showPhone: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Сбор лидов</p>
                  <p className="text-xs text-muted-foreground">
                    Посетители могут оставить контакты
                  </p>
                </div>
                <Switch
                  checked={settings.allowLeadCapture}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, allowLeadCapture: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Показывать в поиске</p>
                  <p className="text-xs text-muted-foreground">
                    Визитка доступна в поиске visitka.site
                  </p>
                </div>
                <Switch
                  checked={settings.showInSearch}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showInSearch: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="User" size={20} />
                Настройки аккаунта
              </CardTitle>
              <CardDescription>
                Управление учётной записью и безопасностью
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Key" className="mr-2" size={18} />
                  Изменить пароль
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Mail" className="mr-2" size={18} />
                  Изменить email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Shield" className="mr-2" size={18} />
                  Двухфакторная аутентификация
                </Button>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-red-500" />
                  Опасная зона
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Необратимые действия с вашим аккаунтом
                </p>
                <Button variant="destructive" size="sm">
                  <Icon name="Trash2" className="mr-2" size={14} />
                  Удалить аккаунт
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Download" size={20} />
                Экспорт данных
              </CardTitle>
              <CardDescription>
                Скачайте все ваши данные в удобном формате
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="CreditCard" size={20} className="text-green" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Визитка</h4>
                      <p className="text-xs text-muted-foreground">
                        Экспорт визитки в PDF или vCard
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="FileText" className="mr-2" size={14} />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="Download" className="mr-2" size={14} />
                      vCard
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="BarChart3" size={20} className="text-blue" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Аналитика</h4>
                      <p className="text-xs text-muted-foreground">
                        Экспорт статистики просмотров и кликов
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="FileText" className="mr-2" size={14} />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="FileSpreadsheet" className="mr-2" size={14} />
                      Excel
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="Users" size={20} className="text-purple-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Лиды</h4>
                      <p className="text-xs text-muted-foreground">
                        Экспорт всех полученных контактов
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="FileText" className="mr-2" size={14} />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="FileSpreadsheet" className="mr-2" size={14} />
                      Excel
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={16} className="text-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <strong>Полный экспорт данных:</strong> Мы можем предоставить вам 
                    архив со всеми данными в соответствии с GDPR. Обработка запроса 
                    занимает до 30 дней.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Database" size={20} />
                Управление данными
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Сбор аналитики</p>
                  <p className="text-xs text-muted-foreground">
                    Собирать данные о просмотрах и действиях
                  </p>
                </div>
                <Switch
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, analyticsEnabled: checked })
                  }
                />
              </div>

              <Button variant="outline" className="w-full justify-start">
                <Icon name="Trash2" className="mr-2" size={18} />
                Очистить всю аналитику
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Icon name="Trash2" className="mr-2" size={18} />
                Удалить всех лидов
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;

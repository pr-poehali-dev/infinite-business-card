import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import NotificationSettings from '../NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

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

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });

  const [apiKeys, setApiKeys] = useState<{id: string; name: string; key: string; created: string}[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    loadSettings();
    loadApiKeys();
    loadPreferences();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('privacy_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  };

  const loadApiKeys = () => {
    const saved = localStorage.getItem('api_keys');
    if (saved) {
      try {
        setApiKeys(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load API keys:', e);
      }
    }
  };

  const loadPreferences = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    const savedLang = localStorage.getItem('language');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('privacy_settings', JSON.stringify(newSettings));
    toast.success('Настройки сохранены');
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      toast.error('Заполните все поля');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Пароли не совпадают');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов');
      return;
    }
    toast.success('Пароль успешно изменён');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleChangeEmail = () => {
    if (!emailData.newEmail || !emailData.password) {
      toast.error('Заполните все поля');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.newEmail)) {
      toast.error('Некорректный email');
      return;
    }
    toast.success('Email успешно изменён');
    setEmailData({ newEmail: '', password: '' });
  };

  const generateApiKey = () => {
    const key = 'vst_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey = {
      id: Date.now().toString(),
      name: `API Ключ ${apiKeys.length + 1}`,
      key,
      created: new Date().toISOString()
    };
    const updated = [...apiKeys, newKey];
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
    toast.success('API ключ создан');
  };

  const deleteApiKey = (id: string) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
    toast.success('API ключ удалён');
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Ключ скопирован');
  };

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success('Тема оформления изменена');
  };

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    toast.success('Язык интерфейса изменён');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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
          <TabsTrigger value="api">
            <Icon name="Key" className="mr-2" size={16} />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Icon name="Palette" className="mr-2" size={16} />
            <span className="hidden sm:inline">Интерфейс</span>
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
                    saveSettings({ ...settings, publicProfile: checked })
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
                    saveSettings({ ...settings, showEmail: checked })
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
                    saveSettings({ ...settings, showPhone: checked })
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
                    saveSettings({ ...settings, allowLeadCapture: checked })
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
                    saveSettings({ ...settings, showInSearch: checked })
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-4">Изменить пароль</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="current-password">Текущий пароль</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                        placeholder="Введите текущий пароль"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">Новый пароль</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        placeholder="Минимум 8 символов"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        placeholder="Повторите новый пароль"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="w-full">
                      <Icon name="Key" className="mr-2" size={18} />
                      Сменить пароль
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Изменить email</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new-email">Новый email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                        placeholder="new@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-email-password">Подтвердите паролем</Label>
                      <Input
                        id="confirm-email-password"
                        type="password"
                        value={emailData.password}
                        onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                        placeholder="Введите текущий пароль"
                      />
                    </div>
                    <Button onClick={handleChangeEmail} className="w-full">
                      <Icon name="Mail" className="mr-2" size={18} />
                      Изменить email
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Двухфакторная аутентификация</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Дополнительная защита вашего аккаунта
                  </p>
                  <Button variant="outline" className="w-full">
                    <Icon name="Shield" className="mr-2" size={18} />
                    Настроить 2FA
                  </Button>
                </div>
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

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Key" size={20} />
                    API ключи
                  </CardTitle>
                  <CardDescription>
                    Используйте API для интеграции с внешними сервисами
                  </CardDescription>
                </div>
                <Button onClick={generateApiKey} size="sm">
                  <Icon name="Plus" className="mr-2" size={16} />
                  Создать ключ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Key" size={48} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    У вас пока нет API ключей
                  </p>
                  <Button onClick={generateApiKey} variant="outline">
                    <Icon name="Plus" className="mr-2" size={16} />
                    Создать первый ключ
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm">{apiKey.name}</p>
                            <Badge variant="outline" className="text-xs">
                              Активен
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Создан: {new Date(apiKey.created).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApiKey(apiKey.id)}
                        >
                          <Icon name="Trash2" size={16} className="text-red-500" />
                        </Button>
                      </div>
                      <div className="bg-muted rounded p-3 flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono truncate">
                          {apiKey.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyApiKey(apiKey.key)}
                        >
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={16} className="text-blue flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Документация API</p>
                    <p>Используйте API ключи для доступа к данным вашей визитки через REST API. 
                    Добавляйте заголовок <code className="bg-muted px-1 py-0.5 rounded">Authorization: Bearer YOUR_KEY</code> к запросам.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Palette" size={20} />
                Оформление интерфейса
              </CardTitle>
              <CardDescription>
                Настройте внешний вид под свои предпочтения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Тема оформления</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => changeTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue bg-blue/5'
                        : 'border-muted hover:border-blue/50'
                    }`}
                  >
                    <Icon name="Sun" size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Светлая</p>
                  </button>
                  <button
                    onClick={() => changeTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue bg-blue/5'
                        : 'border-muted hover:border-blue/50'
                    }`}
                  >
                    <Icon name="Moon" size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Тёмная</p>
                  </button>
                  <button
                    onClick={() => changeTheme('system')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'system'
                        ? 'border-blue bg-blue/5'
                        : 'border-muted hover:border-blue/50'
                    }`}
                  >
                    <Icon name="Laptop" size={24} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Системная</p>
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Язык интерфейса</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeLanguage('ru')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      language === 'ru'
                        ? 'border-blue bg-blue/5'
                        : 'border-muted hover:border-blue/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🇷🇺</div>
                      <div>
                        <p className="font-semibold text-sm">Русский</p>
                        <p className="text-xs text-muted-foreground">Russian</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      language === 'en'
                        ? 'border-blue bg-blue/5'
                        : 'border-muted hover:border-blue/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🇬🇧</div>
                      <div>
                        <p className="font-semibold text-sm">English</p>
                        <p className="text-xs text-muted-foreground">Английский</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-blue/5 border border-blue/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Sparkles" size={16} className="text-blue flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Настройки интерфейса применяются мгновенно и сохраняются в вашем браузере
                  </p>
                </div>
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
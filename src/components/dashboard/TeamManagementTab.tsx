import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  views: number;
}

const TeamManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Иван Петров',
      email: 'ivan@company.ru',
      position: 'Генеральный директор',
      department: 'Руководство',
      status: 'active',
      lastActive: '5 мин назад',
      views: 127
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      email: 'maria@company.ru',
      position: 'Менеджер по продажам',
      department: 'Продажи',
      status: 'active',
      lastActive: '1 час назад',
      views: 89
    },
    {
      id: '3',
      name: 'Алексей Смирнов',
      email: 'alexey@company.ru',
      position: 'Старший разработчик',
      department: 'IT',
      status: 'active',
      lastActive: '2 часа назад',
      views: 45
    },
    {
      id: '4',
      name: 'Елена Васильева',
      email: 'elena@company.ru',
      position: 'HR-менеджер',
      department: 'HR',
      status: 'pending',
      lastActive: 'Не активирована',
      views: 0
    },
    {
      id: '5',
      name: 'Дмитрий Козлов',
      email: 'dmitry@company.ru',
      position: 'Маркетолог',
      department: 'Маркетинг',
      status: 'active',
      lastActive: '3 дня назад',
      views: 62
    }
  ];

  const stats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    totalViews: teamMembers.reduce((sum, m) => sum + m.views, 0),
    availableSlots: 15
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="border-green-500 text-green-500">Активна</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Ожидает</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Неактивна</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Users" className="text-gold" size={18} />
              Всего визиток
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">из 20 доступных</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="UserCheck" className="text-gold" size={18} />
              Активные
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">используют визитки</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Eye" className="text-gold" size={18} />
              Всего просмотров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">за всё время</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Plus" className="text-gold" size={18} />
              Доступно мест
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground mt-1">можно добавить</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" className="text-gold" size={24} />
                Управление командой
              </CardTitle>
              <CardDescription className="mt-1">
                Добавляйте сотрудников и управляйте их визитками
              </CardDescription>
            </div>
            <Button className="bg-gold text-black hover:bg-gold/90">
              <Icon name="UserPlus" className="mr-2" size={18} />
              Пригласить сотрудника
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск по имени, email или отделу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-gold/30">
              <Icon name="Filter" className="mr-2" size={18} />
              Фильтры
            </Button>
          </div>

          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <Icon name="User" className="text-gold" size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.position} • {member.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gold">{member.views}</p>
                          <p className="text-xs text-muted-foreground">просмотров</p>
                        </div>
                        <div className="text-center min-w-[100px]">
                          <p className="text-xs text-muted-foreground">{member.lastActive}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="icon" title="Просмотреть визитку">
                        <Icon name="Eye" size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Редактировать">
                        <Icon name="Edit" size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Настройки">
                        <Icon name="Settings" size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gold/20 bg-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="Zap" className="text-gold" size={20} />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Upload" size={18} className="text-gold" />
                  <span className="font-semibold">Импорт из CSV</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Массовое добавление сотрудников
                </p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Download" size={18} className="text-gold" />
                  <span className="font-semibold">Экспорт отчёта</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Статистика в Excel/CSV
                </p>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 border-gold/30">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Mail" size={18} className="text-gold" />
                  <span className="font-semibold">Массовая рассылка</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Отправить инструкции команде
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagementTab;

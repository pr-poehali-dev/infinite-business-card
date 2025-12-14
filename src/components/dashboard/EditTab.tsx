import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface UserInfo {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface EditTabProps {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
}

const EditTab = ({ userInfo, setUserInfo }: EditTabProps) => {
  const handleSave = () => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      toast.success('Изменения успешно сохранены!');
    } catch (error) {
      toast.error('Ошибка при сохранении данных');
      console.error('Save error:', error);
    }
  };

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Edit" className="text-gold" size={24} />
          Редактировать данные
        </CardTitle>
        <CardDescription>
          Обновите информацию вашей визитки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Должность</Label>
            <Input
              id="position"
              value={userInfo.position}
              onChange={(e) => setUserInfo({ ...userInfo, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Компания</Label>
            <Input
              id="company"
              value={userInfo.company}
              onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Веб-сайт</Label>
            <Input
              id="website"
              value={userInfo.website}
              onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            rows={4}
            value={userInfo.description}
            onChange={(e) => setUserInfo({ ...userInfo, description: e.target.value })}
          />
        </div>

        <Button className="w-full md:w-auto bg-gold text-black hover:bg-gold/90" onClick={handleSave}>
          <Icon name="Save" className="mr-2" size={18} />
          Сохранить изменения
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditTab;
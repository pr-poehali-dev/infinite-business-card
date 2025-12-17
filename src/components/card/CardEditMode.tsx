import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';

interface CardData {
  id: number;
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  view_count: number;
}

interface CardEditModeProps {
  editForm: CardData;
  saving: boolean;
  onEditFormChange: (field: keyof CardData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CardEditMode = ({ editForm, saving, onEditFormChange, onSave, onCancel }: CardEditModeProps) => {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Logo size="md" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="destructive"
            size="sm"
            onClick={onCancel}
          >
            <Icon name="X" size={14} className="mr-1" />
            Отменить
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={saving}
            className="bg-gold text-black hover:bg-gold/90"
          >
            {saving ? (
              <>
                <Icon name="Loader2" size={14} className="mr-1 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={14} className="mr-1" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Edit Card */}
      <Card className="overflow-hidden border-2 border-gold/20 shadow-xl">
        <div className="relative">
          {/* Gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold via-yellow-400 to-gold"></div>
          
          <div className="p-8 pt-10">
            {/* Logo / Avatar */}
            {editForm.logo_url ? (
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold/20 shadow-lg">
                  <img src={editForm.logo_url} alt={editForm.name} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border-4 border-gold/20 shadow-lg">
                  <Icon name="User" size={48} className="text-gold/60" />
                </div>
              </div>
            )}

            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя *</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => onEditFormChange('name', e.target.value)}
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Должность</label>
                <Input
                  value={editForm.position || ''}
                  onChange={(e) => onEditFormChange('position', e.target.value)}
                  placeholder="Менеджер по продажам"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Компания</label>
                <Input
                  value={editForm.company || ''}
                  onChange={(e) => onEditFormChange('company', e.target.value)}
                  placeholder="ООО «Компания»"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <Input
                  type="tel"
                  value={editForm.phone || ''}
                  onChange={(e) => onEditFormChange('phone', e.target.value)}
                  placeholder="+7 (900) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => onEditFormChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Сайт</label>
                <Input
                  value={editForm.website || ''}
                  onChange={(e) => onEditFormChange('website', e.target.value)}
                  placeholder="example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">О себе</label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => onEditFormChange('description', e.target.value)}
                  placeholder="Расскажите о себе..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CardEditMode;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const DesignTab = () => {
  const [selectedTheme, setSelectedTheme] = useState('classic');

  const themes = [
    { id: 'classic', name: 'Классическая', colors: ['bg-black', 'bg-gold', 'bg-white'], icon: 'Crown' },
    { id: 'modern', name: 'Современная', colors: ['bg-blue-600', 'bg-cyan-400', 'bg-slate-900'], icon: 'Sparkles' },
    { id: 'minimal', name: 'Минималистичная', colors: ['bg-gray-900', 'bg-gray-400', 'bg-white'], icon: 'Minus' },
    { id: 'gradient', name: 'Градиентная', colors: ['bg-purple-600', 'bg-pink-500', 'bg-orange-400'], icon: 'Palette' },
    { id: 'dark', name: 'Тёмная', colors: ['bg-zinc-950', 'bg-zinc-700', 'bg-zinc-500'], icon: 'Moon' },
    { id: 'elegant', name: 'Элегантная', colors: ['bg-rose-900', 'bg-amber-600', 'bg-stone-200'], icon: 'Star' }
  ];

  const handleApplyTheme = () => {
    alert(`Тема "${themes.find(t => t.id === selectedTheme)?.name}" применена!`);
  };

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Palette" className="text-gold" size={24} />
          Выбор дизайна
        </CardTitle>
        <CardDescription>
          Выберите цветовую схему для вашей визитки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`
                relative p-6 rounded-lg border-2 cursor-pointer transition-all hover-scale
                ${selectedTheme === theme.id 
                  ? 'border-gold bg-gold/5' 
                  : 'border-border bg-card hover:border-gold/50'
                }
              `}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <Icon name="Check" className="text-black" size={14} />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <Icon name={theme.icon as any} className="text-gold" size={24} />
                <h3 className="font-semibold">{theme.name}</h3>
              </div>

              <div className="flex gap-2">
                {theme.colors.map((color, idx) => (
                  <div key={idx} className={`w-full h-12 rounded ${color} border border-border`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t">
          <Button 
            className="w-full md:w-auto bg-gold text-black hover:bg-gold/90"
            onClick={handleApplyTheme}
          >
            <Icon name="Check" className="mr-2" size={18} />
            Применить тему
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignTab;

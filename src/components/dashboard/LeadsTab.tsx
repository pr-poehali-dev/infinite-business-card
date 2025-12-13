import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source: string;
  is_read: boolean;
  created_at: string;
}

const LeadsTab = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const cardId = 1; // TODO: Get from API

  useEffect(() => {
    fetchLeads();
     
  }, []);

  const fetchLeads = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(
        `https://functions.poehali.dev/fab78694-2899-42fa-b327-8aad2ebfa9bb?card_id=${cardId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId || ''
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Не удалось загрузить лиды');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (leadId: number) => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(
        `https://functions.poehali.dev/fab78694-2899-42fa-b327-8aad2ebfa9bb/${leadId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId || ''
          }
        }
      );

      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, is_read: true } : lead
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
        toast.success('Отмечено как прочитанное');
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Ошибка обновления');
    }
  };

  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'qr': return 'QrCode';
      case 'social': return 'Share2';
      default: return 'Globe';
    }
  };

  const getSourceLabel = (source: string) => {
    switch(source) {
      case 'qr': return 'QR-код';
      case 'social': return 'Соцсети';
      default: return 'Прямая ссылка';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours} ч. назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Users" className="text-gold" size={18} />
              Всего лидов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{leads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">за всё время</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="Mail" className="text-gold" size={18} />
              Непрочитанные
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-1">требуют внимания</p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Icon name="TrendingUp" className="text-gold" size={18} />
              За сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold">
              {leads.filter(l => {
                const date = new Date(l.created_at);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">новых заявок</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Inbox" className="text-gold" size={24} />
            Входящие заявки
          </CardTitle>
          <CardDescription>
            Список посетителей, оставивших свои контакты
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">Пока нет заявок</p>
              <p className="text-muted-foreground">
                Когда посетители оставят свои контакты, они появятся здесь
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-4 rounded-lg border transition-all ${
                    lead.is_read
                      ? 'border-border bg-card'
                      : 'border-gold/30 bg-gold/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        lead.is_read ? 'bg-muted' : 'bg-gold/20'
                      }`}>
                        <Icon name="User" className={lead.is_read ? 'text-muted-foreground' : 'text-gold'} size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{lead.name}</h4>
                          {!lead.is_read && (
                            <Badge variant="default" className="bg-gold text-black">
                              Новый
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Icon name={getSourceIcon(lead.source) as any} size={12} className="mr-1" />
                            {getSourceLabel(lead.source)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon name="Mail" size={14} />
                              <a href={`mailto:${lead.email}`} className="hover:text-gold transition-colors">
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Icon name="Phone" size={14} />
                              <a href={`tel:${lead.phone}`} className="hover:text-gold transition-colors">
                                {lead.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {lead.message && (
                          <p className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                            {lead.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(lead.created_at)}
                      </p>
                      {!lead.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(lead.id)}
                        >
                          <Icon name="Check" size={14} className="mr-1" />
                          Прочитано
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsTab;

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface UserInfo {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface BusinessCardTabProps {
  userInfo: UserInfo;
}

const BusinessCardTab = ({ userInfo }: BusinessCardTabProps) => {
  const messengers = [
    { name: 'Telegram', icon: 'Send', color: 'text-blue-500', url: `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`Моя визитка: ${userInfo.name}`)}` },
    { name: 'WhatsApp', icon: 'MessageCircle', color: 'text-green-500', url: `https://wa.me/?text=${encodeURIComponent(`Моя визитка: ${userInfo.name} ${window.location.origin}`)}` },
    { name: 'VK', icon: 'Share2', color: 'text-blue-600', url: `https://vk.com/share.php?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'Одноклассники', icon: 'Users', color: 'text-orange-500', url: `https://connect.ok.ru/offer?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(userInfo.name)}` },
    { name: 'VK Мессенджер', icon: 'MessageSquare', color: 'text-blue-500', url: `https://vk.me/share?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(`Моя визитка: ${userInfo.name}`)}` },
    { name: 'Скопировать ссылку', icon: 'Link', color: 'text-gray-500', url: '' }
  ];

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BEGIN:VCARD%0AVERSION:3.0%0AFN:${encodeURIComponent(userInfo.name)}%0ATEL:${encodeURIComponent(userInfo.phone)}%0AEMAIL:${encodeURIComponent(userInfo.email)}%0AEND:VCARD`;

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${userInfo.name}
ORG:${userInfo.company}
TITLE:${userInfo.position}
TEL:${userInfo.phone}
EMAIL:${userInfo.email}
URL:${userInfo.website}
NOTE:${userInfo.description}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userInfo.name}.vcf`;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-gold/20 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-black to-secondary text-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{userInfo.name}</CardTitle>
                <CardDescription className="text-gray-300 text-base">
                  {userInfo.position}
                </CardDescription>
                <p className="text-gold font-semibold mt-1">{userInfo.company}</p>
              </div>
              <div className="text-4xl">∞7</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Phone" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-semibold">{userInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{userInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Icon name="Globe" className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Веб-сайт</p>
                  <p className="font-semibold">{userInfo.website}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">О компании</p>
                <p className="text-sm">{userInfo.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Поделиться визиткой</p>
              <div className="flex gap-3">
                {messengers.map((messenger) => (
                  <Button
                    key={messenger.name}
                    variant="outline"
                    size="icon"
                    className="hover-scale"
                    title={messenger.name}
                    onClick={() => {
                      if (messenger.name === 'Скопировать ссылку') {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Ссылка скопирована!');
                      } else {
                        window.open(messenger.url, '_blank');
                      }
                    }}
                  >
                    <Icon name={messenger.icon as any} className={messenger.color} size={20} />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="QrCode" className="text-gold" size={24} />
              QR-код визитки
            </CardTitle>
            <CardDescription>
              Отсканируйте для добавления в контакты
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-full h-auto"
              />
            </div>
            <Button
              className="w-full bg-gold text-black hover:bg-gold/90"
              onClick={handleDownloadVCard}
            >
              <Icon name="Download" className="mr-2" size={18} />
              Скачать vCard
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gold/20 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Link" className="text-gold" size={24} />
              Короткая ссылка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/20 p-3 rounded-lg border border-gold/20">
              <p className="text-center font-mono text-sm">
                visitka.site/ivan-petrov
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCardTab;

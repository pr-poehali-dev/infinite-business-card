export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private registration: ServiceWorkerRegistration | null = null;

  async init() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    this.permission = Notification.permission;

    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready;
      } catch (error) {
        console.error('Service Worker not ready:', error);
      }
    }

    return this.permission === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        localStorage.setItem('notifications_enabled', 'true');
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }

    return false;
  }

  isEnabled(): boolean {
    return this.permission === 'granted' && 
           localStorage.getItem('notifications_enabled') === 'true';
  }

  disable() {
    localStorage.setItem('notifications_enabled', 'false');
  }

  async show(payload: NotificationPayload) {
    if (!this.isEnabled()) {
      return;
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/icon-192.png',
      data: payload.data,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction || false,
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    };

    try {
      if (this.registration && this.registration.showNotification) {
        await this.registration.showNotification(payload.title, options);
      } else {
        new Notification(payload.title, options);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showNewLead(leadName: string, cardName: string) {
    await this.show({
      title: '🎉 Новый лид!',
      body: `${leadName} интересуется визиткой "${cardName}"`,
      tag: 'new-lead',
      requireInteraction: true,
      data: { type: 'lead' }
    });
  }

  async showNewView(cardName: string, viewCount: number) {
    await this.show({
      title: '👀 Новый просмотр',
      body: `Визитка "${cardName}" просмотрена ${viewCount} раз`,
      tag: 'new-view',
      data: { type: 'view' }
    });
  }

  async showPaymentSuccess(planName: string) {
    await this.show({
      title: '✅ Оплата успешна',
      body: `Подписка "${planName}" активирована`,
      tag: 'payment-success',
      requireInteraction: true,
      data: { type: 'payment' }
    });
  }

  async showReferralBonus(days: number) {
    await this.show({
      title: '🎁 Бонус от реферала',
      body: `Вы получили +${days} дней Premium тарифа`,
      tag: 'referral-bonus',
      data: { type: 'referral' }
    });
  }

  async showSubscriptionExpiring(daysLeft: number) {
    await this.show({
      title: '⏰ Подписка заканчивается',
      body: `Осталось ${daysLeft} дней до окончания подписки`,
      tag: 'subscription-expiring',
      requireInteraction: true,
      data: { type: 'subscription' }
    });
  }

  async showWeeklyReport(stats: { views: number; leads: number }) {
    await this.show({
      title: '📊 Еженедельный отчёт',
      body: `За неделю: ${stats.views} просмотров, ${stats.leads} лидов`,
      tag: 'weekly-report',
      data: { type: 'report', stats }
    });
  }

  async showLimitWarning(resource: string, percentage: number) {
    await this.show({
      title: '⚠️ Приближается лимит',
      body: `Использовано ${percentage}% лимита ${resource}`,
      tag: `limit-warning-${resource}`,
      requireInteraction: true,
      data: { type: 'limit-warning', resource }
    });
  }

  async showLimitReached(resource: string) {
    await this.show({
      title: '🚫 Лимит исчерпан',
      body: `Достигнут лимит ${resource}. Улучшите тариф.`,
      tag: `limit-reached-${resource}`,
      requireInteraction: true,
      data: { type: 'limit-reached', resource }
    });
  }
}

export const notificationService = new NotificationService();
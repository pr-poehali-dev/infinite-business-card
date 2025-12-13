import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface BusinessCardData {
  name: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  qr_code_url?: string;
}

export interface AnalyticsData {
  views: number;
  clicks: number;
  leads: number;
  period: string;
}

export interface LeadData {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  created_at: string;
}

class ExportService {
  exportBusinessCardToPDF(data: BusinessCardData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Фон
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Заголовок
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Цифровая визитка', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('visitka.site', pageWidth / 2, 30, { align: 'center' });
    
    // Контент
    doc.setTextColor(0, 0, 0);
    let y = 60;
    
    // Имя
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name, 20, y);
    y += 10;
    
    // Должность и компания
    if (data.position || data.company) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const subtitle = [data.position, data.company].filter(Boolean).join(' • ');
      doc.text(subtitle, 20, y);
      y += 15;
    }
    
    doc.setTextColor(0, 0, 0);
    
    // Контакты
    const contacts = [
      { icon: '📱', label: 'Телефон:', value: data.phone },
      { icon: '✉️', label: 'Email:', value: data.email },
      { icon: '🌐', label: 'Сайт:', value: data.website }
    ].filter(c => c.value);
    
    contacts.forEach(contact => {
      doc.setFontSize(11);
      doc.text(`${contact.icon} ${contact.label}`, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.text(contact.value!, 60, y);
      doc.setFont('helvetica', 'normal');
      y += 10;
    });
    
    // Описание
    if (data.description) {
      y += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('О себе:', 20, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      const splitDescription = doc.splitTextToSize(data.description, pageWidth - 40);
      doc.text(splitDescription, 20, y);
      y += splitDescription.length * 7;
    }
    
    // QR-код (если есть)
    if (data.qr_code_url) {
      y += 10;
      try {
        doc.addImage(data.qr_code_url, 'PNG', 20, y, 50, 50);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Отсканируйте для', 20, y + 60);
        doc.text('быстрого сохранения', 20, y + 67);
      } catch (e) {
        console.warn('Failed to add QR code to PDF:', e);
      }
    }
    
    // Футер
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Создано на visitka.site', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    const fileName = `${data.name.replace(/\s+/g, '_')}_визитка.pdf`;
    doc.save(fileName);
  }

  exportAnalyticsToExcel(data: AnalyticsData[], leads: LeadData[]) {
    const wb = XLSX.utils.book_new();
    
    // Лист с аналитикой
    const analyticsSheet = XLSX.utils.json_to_sheet(
      data.map(item => ({
        'Период': item.period,
        'Просмотры': item.views,
        'Клики': item.clicks,
        'Лиды': item.leads,
        'Конверсия %': ((item.leads / item.views) * 100).toFixed(1)
      }))
    );
    
    XLSX.utils.book_append_sheet(wb, analyticsSheet, 'Аналитика');
    
    // Лист с лидами
    if (leads.length > 0) {
      const leadsSheet = XLSX.utils.json_to_sheet(
        leads.map(lead => ({
          'Имя': lead.name,
          'Email': lead.email || '-',
          'Телефон': lead.phone || '-',
          'Сообщение': lead.message || '-',
          'Дата': new Date(lead.created_at).toLocaleString('ru-RU')
        }))
      );
      
      XLSX.utils.book_append_sheet(wb, leadsSheet, 'Лиды');
    }
    
    // Сохранение
    const fileName = `аналитика_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  exportLeadsToExcel(leads: LeadData[]) {
    const wb = XLSX.utils.book_new();
    
    const leadsSheet = XLSX.utils.json_to_sheet(
      leads.map(lead => ({
        'Имя': lead.name,
        'Email': lead.email || '-',
        'Телефон': lead.phone || '-',
        'Сообщение': lead.message || '-',
        'Дата получения': new Date(lead.created_at).toLocaleString('ru-RU')
      }))
    );
    
    XLSX.utils.book_append_sheet(wb, leadsSheet, 'Лиды');
    
    const fileName = `лиды_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  exportAnalyticsToPDF(data: AnalyticsData[], title: string = 'Аналитика визитки') {
    const doc = new jsPDF();
    
    // Заголовок
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 25);
    
    // Таблица
    autoTable(doc, {
      startY: 50,
      head: [['Период', 'Просмотры', 'Клики', 'Лиды', 'Конверсия']],
      body: data.map(item => [
        item.period,
        item.views.toString(),
        item.clicks.toString(),
        item.leads.toString(),
        `${((item.leads / item.views) * 100).toFixed(1)}%`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    
    // Итоги
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const totalLeads = data.reduce((sum, item) => sum + item.leads, 0);
    const avgConversion = ((totalLeads / totalViews) * 100).toFixed(1);
    
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Итого:', 20, finalY + 20);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Просмотры: ${totalViews}`, 20, finalY + 30);
    doc.text(`Клики: ${totalClicks}`, 20, finalY + 40);
    doc.text(`Лиды: ${totalLeads}`, 20, finalY + 50);
    doc.text(`Средняя конверсия: ${avgConversion}%`, 20, finalY + 60);
    
    // Футер
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Создано на visitka.site • ${new Date().toLocaleDateString('ru-RU')}`,
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    const fileName = `аналитика_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  exportLeadsToPDF(leads: LeadData[]) {
    const doc = new jsPDF();
    
    // Заголовок
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Лиды из визитки', 20, 25);
    
    // Таблица
    autoTable(doc, {
      startY: 50,
      head: [['Имя', 'Контакты', 'Дата']],
      body: leads.map(lead => [
        lead.name,
        [lead.email, lead.phone].filter(Boolean).join('\n'),
        new Date(lead.created_at).toLocaleDateString('ru-RU')
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    
    // Футер
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Всего лидов: ${leads.length} • Создано на visitka.site`,
      doc.internal.pageSize.getWidth() / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    const fileName = `лиды_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
}

export const exportService = new ExportService();

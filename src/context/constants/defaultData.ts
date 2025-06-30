import { Campaign, PricingPlan, User } from '../../types';

// Enhanced default campaigns with flexible billing options
export const defaultCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Yıllık Plan İndirimi',
    description: '2 Ay Ücretsiz - Yıllık planlarda %17 indirim',
    discountType: 'percentage',
    discountValue: 17,
    applicableDuration: 'yearly',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    applicablePlans: ['basic', 'premium', 'enterprise'],
    createdAt: new Date().toISOString(),
    yearlyDiscount: {
      type: 'percentage',
      value: 17
    }
  },
  {
    id: '2',
    name: '3 Aylık Ücretsiz Deneme',
    description: '3 ay ücretsiz kullanım, sonrasında otomatik ücretlendirme',
    discountType: 'free_trial',
    discountValue: 100,
    applicableDuration: 'both',
    freeTrialMonths: 3,
    autoChargeAfterTrial: true,
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    applicablePlans: ['basic', 'premium'],
    createdAt: new Date().toISOString(),
    conditions: {
      newUsersOnly: true,
      maxUsagePerUser: 1
    }
  },
  {
    id: '3',
    name: 'Aylık Plan Kampanyası',
    description: 'İlk ay %50 indirim - Aylık planlar için',
    discountType: 'percentage',
    discountValue: 50,
    applicableDuration: 'monthly',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    applicablePlans: ['basic', 'premium'],
    createdAt: new Date().toISOString(),
    monthlyDiscount: {
      type: 'percentage',
      value: 50
    }
  },
  {
    id: '4',
    name: 'Esnek İndirim Kampanyası',
    description: 'Aylık %25, Yıllık %35 indirim - Tüm planlar',
    discountType: 'percentage',
    discountValue: 25, // Default for monthly
    applicableDuration: 'both',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    applicablePlans: ['basic', 'premium', 'enterprise'],
    createdAt: new Date().toISOString(),
    monthlyDiscount: {
      type: 'percentage',
      value: 25
    },
    yearlyDiscount: {
      type: 'percentage',
      value: 35
    }
  }
];

// Enhanced default pricing plans with yearly options
export const defaultPricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Ücretsiz',
    price: 0,
    currency: 'TL',
    duration: 'monthly',
    maxProjects: 2,
    maxTables: 5,
    features: ['2 Proje', '5 Tablo', 'Temel Destek', 'API Erişimi'],
    isActive: true,
    planType: 'general',
    trialDays: 0,
  },
  {
    id: '2',
    name: 'Temel',
    price: 99,
    yearlyPrice: 990, // 10 months price for yearly (2 months free)
    currency: 'TL',
    duration: 'monthly',
    maxProjects: 10,
    maxTables: 50,
    features: ['10 Proje', '50 Tablo', 'E-posta Desteği', 'Veri Dışa Aktarma', 'Gelişmiş Alan Tipleri', 'API Rate Limit: 10K/gün'],
    isActive: true,
    planType: 'general',
    trialDays: 7,
  },
  {
    id: '3',
    name: 'Premium',
    price: 299,
    yearlyPrice: 2990, // 10 months price for yearly
    currency: 'TL',
    duration: 'monthly',
    maxProjects: 50,
    maxTables: 200,
    features: ['50 Proje', '200 Tablo', 'Öncelikli Destek', 'API Erişimi', 'Gelişmiş Raporlar', 'Validation Kuralları', 'İlişkisel Tablolar', 'API Rate Limit: 100K/gün'],
    isActive: true,
    planType: 'general',
    trialDays: 14,
  },
  {
    id: '4',
    name: 'Kurumsal',
    price: 999,
    yearlyPrice: 9990, // 10 months price for yearly
    currency: 'TL',
    duration: 'monthly',
    maxProjects: -1, // Unlimited
    maxTables: -1, // Unlimited
    features: ['Sınırsız Proje', 'Sınırsız Tablo', '7/24 Destek', 'Özel Entegrasyon', 'Beyaz Etiket', 'Tüm Gelişmiş Özellikler', 'Sınırsız API Kullanımı', 'Webhook Desteği'],
    isActive: true,
    planType: 'general',
    trialDays: 30,
  },
];

// Default admin user
export const defaultAdminUser: User = {
  id: 'admin-1',
  email: 'ozgurhzm@gmail.com',
  name: 'Özgür Admin',
  createdAt: new Date().toISOString(),
  isActive: true,
  isAdmin: true,
  subscriptionType: 'enterprise',
  maxProjects: -1,
  maxTables: -1,
}; 

import { Transaction, TransactionStatus, Currency, PaymentMethod, RoutingRule, Notification, VirtualCard, CardStatus, CardType, VirtualAccount, VaStatus, LinkedAccount, FxRate } from '../types';

const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const ACQUIRERS = ['Chase Paymentech', 'Worldpay', 'Adyen', 'Stripe', 'Checkout.com', 'BCA (SNAP)', 'Mandiri (SNAP)', 'Xendit', 'DBS (MAX)', 'UOB'];
const MERCHANTS = ['MERCH_AMAZON_US', 'MERCH_SPOTIFY_EU', 'MERCH_UBER_GL', 'MERCH_NETFLIX_APAC', 'MERCH_TOKOPEDIA_ID', 'MERCH_GOJEK_ID', 'MERCH_GRAB_SG', 'MERCH_SHOPEE_SG', 'MERCH_LAZADA_SG'];

export const generateMockTransaction = (): Transaction => {
  const statusRoll = Math.random();
  let status = TransactionStatus.AUTHORIZED;
  if (statusRoll < 0.1) status = TransactionStatus.FAILED;
  else if (statusRoll < 0.15) status = TransactionStatus.DECLINED;
  else if (statusRoll < 0.2) status = TransactionStatus.PENDING;
  else if (statusRoll < 0.25) status = TransactionStatus.REFUNDED;

  // Regional Bias Logic
  const regionRoll = Math.random();
  let currency = Currency.USD;
  let method = PaymentMethod.CREDIT_CARD;
  let acquirer = 'Stripe';
  let ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

  if (regionRoll > 0.85) {
      // Indonesia Profile
      currency = Currency.IDR;
      ip = `103.147.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`; // Typical ID IP range
      const methodRoll = Math.random();
      if (methodRoll > 0.6) {
          method = PaymentMethod.QRIS;
          acquirer = 'BCA (SNAP)';
      } else if (methodRoll > 0.3) {
          method = PaymentMethod.VIRTUAL_ACCOUNT;
          acquirer = 'Mandiri (SNAP)';
      } else {
          method = PaymentMethod.BI_FAST;
          acquirer = 'Xendit';
      }
  } else if (regionRoll > 0.75) {
      // Singapore Profile
      currency = Currency.SGD;
      ip = `118.200.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`; // SG IP
      const methodRoll = Math.random();
      if (methodRoll > 0.5) {
          method = PaymentMethod.PAYNOW;
          acquirer = 'DBS (MAX)';
      } else {
          method = PaymentMethod.CREDIT_CARD;
          acquirer = 'Adyen'; // Adyen is strong in SG
      }
  } else if (regionRoll > 0.6) {
      // Malaysia Profile
      currency = Currency.MYR;
      method = PaymentMethod.DUITNOW;
      acquirer = 'PayNet';
  } else if (regionRoll > 0.5) {
      currency = Currency.EUR;
      acquirer = 'Adyen';
      method = PaymentMethod.DIGITAL_WALLET;
  }

  const riskScore = status === TransactionStatus.DECLINED || status === TransactionStatus.FAILED 
    ? Math.floor(Math.random() * 40) + 60 
    : Math.floor(Math.random() * 20);

  // Amount adjustment
  let amount = parseFloat((Math.random() * 1000).toFixed(2));
  if (currency === Currency.IDR) {
      amount = Math.floor(Math.random() * 5000000) + 10000;
  } else if (currency === Currency.SGD) {
      amount = parseFloat((Math.random() * 500).toFixed(2));
  } else if (currency === Currency.MYR) {
      amount = parseFloat((Math.random() * 1200).toFixed(2));
  }

  return {
    id: generateId('TXN'),
    timestamp: new Date().toISOString(),
    amount: amount,
    currency: currency,
    merchantId: MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)],
    paymentMethod: method,
    status,
    customerEmail: `user_${Math.floor(Math.random() * 10000)}@example.com`,
    cardLast4: (method === PaymentMethod.CREDIT_CARD || method === PaymentMethod.DIGITAL_WALLET) ? Math.floor(Math.random() * 9000 + 1000).toString() : undefined,
    acquirer: acquirer,
    riskScore,
    processingTimeMs: Math.floor(Math.random() * 400) + 50,
    ipAddress: ip,
    metadata: {
      "subscription_id": generateId('SUB'),
      "device_fingerprint": generateId('DEV'),
      ...(currency === Currency.IDR && { "snap_ref_id": generateId('SNAP') }),
      ...(currency === Currency.SGD && { "uen": "201823912W" })
    }
  };
};

export const MOCK_RULES: RoutingRule[] = [
  { id: 'RULE_01', name: 'High Value USD -> Chase', priority: 1, condition: 'Currency == USD && Amount > 5000', destination: 'Chase Paymentech', active: true },
  { id: 'RULE_02', name: 'EU Traffic -> Adyen', priority: 2, condition: 'Region == EU', destination: 'Adyen', active: true },
  { id: 'RULE_03', name: 'Indonesia QRIS -> BCA', priority: 3, condition: 'Method == QRIS && Currency == IDR', destination: 'BCA (SNAP)', active: true },
  { id: 'RULE_04', name: 'Singapore PayNow -> DBS', priority: 4, condition: 'Method == PayNow && Currency == SGD', destination: 'DBS (MAX)', active: true },
  { id: 'RULE_05', name: 'Low Risk -> Stripe', priority: 10, condition: 'RiskScore < 10', destination: 'Stripe', active: true },
];

export const generateHistoricalData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: Math.floor(Math.random() * 500000) + 200000,
      successRate: 92 + Math.random() * 6
    });
  }
  return data;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    title: 'High Risk Alert',
    message: 'Multiple high-value transactions from IP 192.168.1.1 flagged by Gemini.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: 'notif_2',
    title: 'API Key Rotated',
    message: 'The production signing key was automatically rotated by the Vault.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Latency Spike (Jakarta)',
    message: 'SNAP API Gateway (BCA) experiencing 400ms latency.',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
  },
  {
    id: 'notif_4',
    title: 'Settlement Complete',
    message: 'Daily settlement batch #9923 processed successfully.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  }
];

// --- VIRTUAL CARDS DATA ---

export const generateMockCards = (): VirtualCard[] => {
    return [
        {
            id: 'vc_1',
            holderName: 'Engineering Ops',
            last4: '4242',
            brand: 'Visa',
            expiryMonth: '12',
            expiryYear: '28',
            cvv: '123',
            pan: '4242 4242 4242 4242',
            status: CardStatus.ACTIVE,
            type: CardType.VIRTUAL,
            currency: Currency.USD,
            balance: 2450.00,
            spendLimit: 5000.00,
            colorTheme: 'black',
            createdAt: new Date().toISOString()
        },
        {
            id: 'vc_2',
            holderName: 'Marketing Ads',
            last4: '8832',
            brand: 'Mastercard',
            expiryMonth: '05',
            expiryYear: '26',
            cvv: '992',
            pan: '5500 1234 5678 8832',
            status: CardStatus.ACTIVE,
            type: CardType.RECURRING, // e.g., Recurring
            currency: Currency.USD,
            balance: 12400.00,
            spendLimit: 20000.00,
            colorTheme: 'blue',
            createdAt: new Date().toISOString()
        },
        {
            id: 'vc_3',
            holderName: 'Travel Expenses',
            last4: '1121',
            brand: 'Visa',
            expiryMonth: '09',
            expiryYear: '25',
            cvv: '441',
            pan: '4111 1111 1111 1121',
            status: CardStatus.FROZEN,
            type: CardType.PHYSICAL,
            currency: Currency.EUR,
            balance: 450.00,
            spendLimit: 2000.00,
            colorTheme: 'gold',
            createdAt: new Date().toISOString()
        }
    ] as any[]; // Type assertion for CardType enum compatibility logic
};

export const generateMockVAs = (): VirtualAccount[] => {
    return [
        {
            id: 'va_1',
            bankCode: 'MANDIRI',
            accountName: 'TOPUP USER 1',
            accountNo: '880123928123',
            currency: Currency.IDR,
            status: VaStatus.OPEN,
            createdAt: new Date().toISOString(),
            expectedAmount: 150000
        },
        {
            id: 'va_2',
            bankCode: 'BCA',
            accountName: 'INVOICE #9292',
            accountNo: '1239021239',
            currency: Currency.IDR,
            status: VaStatus.OPEN,
            createdAt: new Date().toISOString()
        },
        {
            id: 'va_3',
            bankCode: 'BRI',
            accountName: 'ORDER #112233',
            accountNo: '9928123123123',
            currency: Currency.IDR,
            status: VaStatus.CLOSED,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            expectedAmount: 500000
        }
    ]
}

// --- LINKED ACCOUNTS DATA ---

export const generateMockLinkedAccounts = (): LinkedAccount[] => {
    return [
        {
            id: 'acc_chase_01',
            institutionName: 'Chase Bank',
            accountName: 'Business Checking',
            mask: '8829',
            currency: Currency.USD,
            balance: 245000.50,
            status: 'active',
            lastSynced: new Date().toISOString()
        },
        {
            id: 'acc_bca_01',
            institutionName: 'BCA',
            accountName: 'Tahapan Gold',
            mask: '1233',
            currency: Currency.IDR,
            balance: 1500000000,
            status: 'active',
            lastSynced: new Date().toISOString()
        },
        {
            id: 'acc_dbs_01',
            institutionName: 'DBS Bank',
            accountName: 'Corporate Multi-Currency',
            mask: '9921',
            currency: Currency.SGD,
            balance: 85000.00,
            status: 'active',
            lastSynced: new Date(Date.now() - 3600000).toISOString()
        }
    ]
}

// --- MCP FX RATES ---

export const generateMockFxRates = (): FxRate[] => {
    return [
        {
            id: 'fx_idr',
            baseCurrency: Currency.USD,
            quoteCurrency: Currency.IDR,
            rate: 15750.50,
            markup: 2.5,
            inverseRate: 0.000063,
            lastUpdated: new Date().toISOString(),
            status: 'active',
            volatility: 'medium'
        },
        {
            id: 'fx_sgd',
            baseCurrency: Currency.USD,
            quoteCurrency: Currency.SGD,
            rate: 1.3450,
            markup: 1.5,
            inverseRate: 0.7434,
            lastUpdated: new Date().toISOString(),
            status: 'active',
            volatility: 'low'
        },
        {
            id: 'fx_myr',
            baseCurrency: Currency.USD,
            quoteCurrency: Currency.MYR,
            rate: 4.7520,
            markup: 2.0,
            inverseRate: 0.2104,
            lastUpdated: new Date().toISOString(),
            status: 'active',
            volatility: 'medium'
        },
        {
            id: 'fx_eur',
            baseCurrency: Currency.USD,
            quoteCurrency: Currency.EUR,
            rate: 0.9250,
            markup: 1.0,
            inverseRate: 1.0810,
            lastUpdated: new Date().toISOString(),
            status: 'active',
            volatility: 'low'
        },
        {
            id: 'fx_thb',
            baseCurrency: Currency.USD,
            quoteCurrency: Currency.THB,
            rate: 36.50,
            markup: 2.2,
            inverseRate: 0.0273,
            lastUpdated: new Date().toISOString(),
            status: 'active',
            volatility: 'medium'
        }
    ];
};

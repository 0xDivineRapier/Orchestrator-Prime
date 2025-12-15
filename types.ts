
export enum TransactionStatus {
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  DECLINED = 'DECLINED',
  REFUNDED = 'REFUNDED',
  PENDING = 'PENDING_3DS',
  PENDING_PAYMENT = 'PENDING_PAYMENT' // Common for VA/QRIS
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  SGD = 'SGD',
  IDR = 'IDR',
  MYR = 'MYR',
  THB = 'THB',
  VND = 'VND',
  PHP = 'PHP'
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DIGITAL_WALLET = 'Digital Wallet',
  BANK_TRANSFER = 'Bank Transfer',
  CRYPTO = 'Crypto',
  QRIS = 'QRIS',
  VIRTUAL_ACCOUNT = 'Virtual Account',
  BI_FAST = 'BI-FAST',
  PAYNOW = 'PayNow',
  FAST = 'FAST Transfer',
  DUITNOW = 'DuitNow',
  PROMPTPAY = 'PromptPay',
  VIETQR = 'VietQR',
  PHQR = 'PhQR',
  GCASH = 'GCash',
  INSTAPAY = 'InstaPay'
}

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: Currency;
  merchantId: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  customerEmail: string;
  cardLast4?: string;
  acquirer?: string;
  riskScore: number;
  processingTimeMs: number;
  ipAddress: string;
  metadata?: Record<string, string>;
}

export interface SystemMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  latency?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  condition: string;
  destination: string;
  active: boolean;
}

export enum KybStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface KybApplication {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  address: string;
  directors: string[];
  documentsUploaded: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'merchant';
  avatarUrl?: string;
  company?: string;
  walletAddress?: string; // Added for Web3 users
  kybStatus?: KybStatus;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string, password: string, company: string) => Promise<void>;
  loginWeb3: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

// --- ISSUING / VIRTUAL CARDS ---

export enum CardStatus {
  ACTIVE = 'Active',
  FROZEN = 'Frozen',
  CANCELLED = 'Cancelled'
}

export enum CardType {
  VIRTUAL = 'Virtual',
  PHYSICAL = 'Physical',
  DISPOSABLE = 'Disposable (One-Time)',
  RECURRING = 'Recurring'
}

export interface VirtualCard {
  id: string;
  holderName: string;
  last4: string;
  brand: 'Visa' | 'Mastercard';
  expiryMonth: string;
  expiryYear: string;
  cvv: string; // Mocked for display
  pan: string; // Full PAN for display (usually tokenized)
  status: CardStatus;
  type: CardType;
  currency: Currency;
  balance: number;
  spendLimit: number;
  colorTheme: 'blue' | 'black' | 'purple' | 'gold';
  createdAt: string;
}

// --- RECEIVABLES / VIRTUAL ACCOUNTS ---

export enum VaStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    EXPIRED = 'EXPIRED'
}

export interface VirtualAccount {
    id: string;
    bankCode: 'MANDIRI' | 'BCA' | 'BRI' | 'BNI';
    accountName: string;
    accountNo: string;
    currency: Currency;
    status: VaStatus;
    expectedAmount?: number;
    createdAt: string;
    expiresAt?: string;
}

// --- BANKING / CONNECTED ACCOUNTS ---

export interface LinkedAccount {
  id: string;
  institutionName: string; // e.g. Chase, BCA
  accountName: string;     // e.g. Business Checking
  mask: string;            // e.g. 8832
  currency: Currency;
  balance: number;         // Available balance
  status: 'active' | 'disconnected' | 'verification_pending';
  logoUrl?: string;        // URL for bank logo
  lastSynced: string;
}

// --- WHITE LABEL & ACQUIRING ---

export interface WhiteLabelConfig {
  portalName: string;
  brandColor: string;
  logoUrl?: string;
  supportEmail: string;
  customDomain?: string;
}

export interface AcquiringConnection {
  id: string;
  provider: 'CHASE' | 'WELLS_FARGO' | 'BCA' | 'MANDIRI' | 'STRIPE_CONNECT' | 'ADYEN_PLATFORM';
  name: string;
  status: 'ACTIVE' | 'PENDING' | 'ERROR';
  mid: string; // Merchant ID
  region: string;
  supportedCurrencies: Currency[];
}

// --- MCP / FX RATES ---

export interface FxRate {
  id: string;
  baseCurrency: Currency;
  quoteCurrency: Currency;
  rate: number;
  markup: number; // Percentage (e.g. 2.5)
  inverseRate: number;
  lastUpdated: string;
  status: 'active' | 'suspended';
  volatility: 'low' | 'medium' | 'high';
}

import React, { useState } from 'react';
import { CreditCard, Shield, Building2, Users, Terminal, Smartphone, FileText, BarChart3, Globe, Zap, Lock, Database, Cloud, Code, CheckCircle, AlertCircle, ChevronRight, BookOpen, Layers, Server, X } from 'lucide-react';

const StripeGuideApp = () => {
  const [activeProduct, setActiveProduct] = useState('payments');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Comprehensive glossary of terms
  const glossary = {
    'API': {
      term: 'API',
      title: 'Application Programming Interface',
      definition: 'A set of rules and protocols for building software applications.',
      context: 'APIs allow different software components to communicate with each other. Stripe provides APIs for payments, subscriptions, and more.',
      importance: 'APIs are the backbone of modern software development. They enable developers to build complex applications by combining different services and data sources.'
    },
    'PCI-DSS': {
      term: 'PCI-DSS',
      title: 'Payment Card Industry Data Security Standard',
      definition: 'A set of security standards designed to ensure all companies that accept, process, store or transmit credit card information maintain a secure environment.',
      context: 'Level 1 certification (the highest level) means Stripe handles all the complex security requirements for you. Without this, you\'d need to implement extensive security measures, undergo regular audits, and maintain compliance yourself - a massive undertaking.',
      importance: 'Critical for handling card data. Non-compliance can result in fines up to $500,000 per incident and loss of ability to process payments.'
    },
    'Payment Intents': {
      term: 'Payment Intents',
      title: 'Payment Intents API',
      definition: 'A Stripe API object that tracks the lifecycle of a payment from creation through completion, handling complex flows like authentication and async payment methods.',
      context: 'Unlike the older Charges API, Payment Intents can handle SCA (Strong Customer Authentication), multiple payment method types, and complex payment flows. It\'s the foundation of modern Stripe integrations.',
      importance: 'Required for European payments (PSD2 compliance) and recommended for all new integrations. Provides better handling of edge cases and payment failures.'
    },
    'Idempotency': {
      term: 'Idempotency',
      title: 'Idempotency Keys',
      definition: 'A unique key sent with API requests that ensures the same operation isn\'t performed twice, even if the request is sent multiple times.',
      context: 'Networks fail, timeouts happen. Without idempotency, a timeout during payment creation could lead to charging a customer twice. The key ensures Stripe returns the same response for duplicate requests.',
      importance: 'Prevents duplicate charges and makes your payment system reliable. Essential for production systems where network issues are inevitable.'
    },
    'Webhooks': {
      term: 'Webhooks',
      title: 'Webhook Events',
      definition: 'HTTP callbacks that Stripe sends to your server when events happen in your account (like successful payments or failed charges).',
      context: 'Instead of constantly polling Stripe\'s API to check payment status, webhooks push updates to you in real-time. They\'re the nervous system of your payment infrastructure.',
      importance: 'Critical for reliable payment processing. Without webhooks, you might miss important events like successful payments, disputes, or subscription cancellations.'
    },
    '3D Secure': {
      term: '3D Secure',
      title: '3D Secure Authentication',
      definition: 'An authentication protocol (like Verified by Visa or Mastercard SecureCode) that adds an extra layer of security by requiring cardholders to verify their identity.',
      context: 'Often appears as a popup or redirect during checkout where customers enter a code sent to their phone. In Europe, it\'s legally required for most online payments (SCA/PSD2).',
      importance: 'Reduces fraud by up to 80% and shifts liability from merchants to card issuers. Required in Europe, recommended globally for high-risk transactions.'
    },
    'SCA': {
      term: 'SCA',
      title: 'Strong Customer Authentication',
      definition: 'A European regulatory requirement (part of PSD2) that requires customers to authenticate payments using two of three factors: something they know, have, or are.',
      context: 'Implemented through 3D Secure for cards. Stripe\'s Payment Intents API handles SCA automatically, requesting authentication only when required.',
      importance: 'Mandatory for European customers. Non-compliance results in declined payments. Stripe handles the complexity, but you need to build flows that support it.'
    },
    'ACH': {
      term: 'ACH',
      title: 'Automated Clearing House',
      definition: 'A US banking network for electronic money transfers, commonly used for direct deposits, bill payments, and B2B transactions.',
      context: 'Lower fees than cards (often under 1%) but slower (1-3 business days) and US-only. Great for recurring payments and B2B transactions where speed isn\'t critical.',
      importance: 'Essential for US B2B payments and subscriptions. Can reduce payment processing costs by 60-80% compared to cards.'
    },
    'KYC': {
      term: 'KYC',
      title: 'Know Your Customer',
      definition: 'The process of verifying the identity of customers to prevent fraud, money laundering, and compliance violations.',
      context: 'For platforms (Connect) and financial services (Treasury, Issuing), you must verify user identities. Stripe handles much of this automatically but you design the user experience.',
      importance: 'Legally required for financial services. Failure to properly KYC can result in massive fines and shutdown of payment processing capabilities.'
    },
    'Chargeback': {
      term: 'Chargeback',
      title: 'Payment Chargebacks',
      definition: 'A reversal of a credit card payment initiated by the cardholder\'s bank, often due to disputes, fraud claims, or merchant errors.',
      context: 'Costs include the disputed amount plus fees ($15-25). Too many chargebacks (>1%) can result in account termination. Proper evidence submission can win 20-40% of disputes.',
      importance: 'Can significantly impact profitability. Preventing chargebacks through good customer service and clear billing descriptors is cheaper than fighting them.'
    },
    'Tokenization': {
      term: 'Tokenization',
      title: 'Payment Tokenization',
      definition: 'The process of replacing sensitive payment data (like card numbers) with unique tokens that can be safely stored and transmitted.',
      context: 'Stripe.js tokenizes cards in the browser, sending only tokens to your server. This means you never touch raw card data, dramatically reducing security requirements.',
      importance: 'Eliminates 90% of PCI compliance burden. Without tokenization, you\'d need extensive security infrastructure to handle card data.'
    },
    'Proration': {
      term: 'Proration',
      title: 'Subscription Proration',
      definition: 'Calculating partial charges or credits when subscription changes happen mid-billing cycle (upgrades, downgrades, cancellations).',
      context: 'If a customer upgrades from a $10/mo to $50/mo plan halfway through the month, proration ensures they\'re charged fairly for the time on each plan.',
      importance: 'Critical for SaaS billing. Poor proration logic leads to customer complaints and revenue leakage. Stripe handles the complex calculations automatically.'
    },
    'Dunning': {
      term: 'Dunning',
      title: 'Dunning Management',
      definition: 'The process of communicating with customers to collect failed subscription payments through retries, emails, and payment method updates.',
      context: 'When subscription renewals fail (expired cards, insufficient funds), dunning automation retries payments and emails customers. Can recover 30-40% of failed payments.',
      importance: 'Directly impacts MRR retention. Good dunning can reduce involuntary churn by 50%. Stripe provides Smart Retries and email templates.'
    },
    'MRR': {
      term: 'MRR',
      title: 'Monthly Recurring Revenue',
      definition: 'The predictable revenue a business can expect every month from subscriptions, excluding one-time fees.',
      context: 'The north star metric for SaaS businesses. Calculated as sum of all monthly subscription values. Growth rate, churn, and expansion MRR are key indicators.',
      importance: 'Determines company valuation (often 10-20x MRR). Understanding MRR dynamics is crucial for subscription business strategy.'
    },
    'Express account': {
      term: 'Express account',
      title: 'Stripe Express Connected Account',
      definition: 'A type of Stripe Connect account where Stripe handles onboarding UI, identity verification, and provides a dashboard for connected users.',
      context: 'Best for marketplaces wanting quick seller onboarding. Stripe handles KYC, provides tax forms, and manages compliance, but less customization than Custom accounts.',
      importance: 'Reduces marketplace development time by 80%. Handles complex compliance requirements across 40+ countries automatically.'
    },
    'Destination charge': {
      term: 'Destination charge',
      title: 'Connect Destination Charges',
      definition: 'A payment flow where the platform processes the payment and then transfers funds to a connected account, minus fees.',
      context: 'The platform owns the customer relationship and payment data. Good for marketplaces where the platform brand is primary. Alternative to direct charges.',
      importance: 'Gives platforms maximum control over the payment flow and customer experience. Essential for building trusted marketplace brands.'
    },
    'Circuit breaker': {
      term: 'Circuit breaker',
      title: 'Circuit Breaker Pattern',
      definition: 'A design pattern that prevents cascading failures by stopping requests to a failing service after a threshold of failures.',
      context: 'If Stripe API calls start failing, the circuit breaker "opens" and returns errors immediately instead of waiting for timeouts. After a cooldown, it tests if the service recovered.',
      importance: 'Prevents your entire system from hanging when external services fail. Critical for maintaining uptime during payment provider issues.'
    },
    'Card networks': {
      term: 'Card networks',
      title: 'Payment Card Networks',
      definition: 'Companies like Visa, Mastercard, Amex, and Discover that facilitate transactions between card issuers (customer\'s bank) and acquirers (merchant\'s bank).',
      context: 'Each network has different fees, rules, and global acceptance. Visa/Mastercard are most widely accepted. Amex has higher fees but affluent customers.',
      importance: 'Understanding network differences helps optimize payment acceptance and costs. Some networks offer better dispute protection or lower fees for specific industries.'
    },
    'EMV': {
      term: 'EMV',
      title: 'Europay, Mastercard, and Visa Standard',
      definition: 'The global standard for chip-based payment cards and terminals, providing better security than magnetic stripes.',
      context: 'The chip generates unique codes for each transaction, making card cloning nearly impossible. In the US, liability shifts to merchants if they don\'t support EMV.',
      importance: 'Required for in-person payments to avoid fraud liability. Non-EMV merchants are liable for any chip card fraud that occurs on their systems.'
    },
    'Acquiring bank': {
      term: 'Acquiring bank',
      title: 'Merchant Acquiring Bank',
      definition: 'The financial institution that processes credit card payments on behalf of merchants and deposits funds into their accounts.',
      context: 'Stripe acts as a payment facilitator, aggregating merchants under their acquiring relationships. This lets you accept payments without your own acquiring bank relationship.',
      importance: 'Understanding the payment flow helps troubleshoot issues. Acquiring banks can hold funds or terminate accounts for high-risk merchants.'
    },
    'Platform fees': {
      term: 'Platform fees',
      title: 'Marketplace Platform Fees',
      definition: 'The commission or fees that platforms charge connected accounts for using their marketplace or services.',
      context: 'Can be a percentage (e.g., 10% of each sale) or fixed fee. Implemented through application_fee_amount in Stripe. Key revenue model for marketplaces.',
      importance: 'Primary monetization method for platforms. Must balance competitive rates with sustainable unit economics. Typically 5-30% depending on value provided.'
    },
    'Usage-based billing': {
      term: 'Usage-based billing',
      title: 'Metered/Usage-Based Billing',
      definition: 'Pricing model where customers pay based on consumption (API calls, data usage, seats) rather than fixed subscriptions.',
      context: 'Popular for infrastructure/API companies. Requires tracking usage, setting prices per unit, and handling overages. More complex than flat-rate billing.',
      importance: 'Aligns cost with value, can increase revenue by 30-50% vs flat pricing. Essential for modern SaaS, especially infrastructure services.'
    },
    'FDIC': {
      term: 'FDIC',
      title: 'Federal Deposit Insurance Corporation',
      definition: 'US government agency that insures bank deposits up to $250,000 per depositor, per insured bank.',
      context: 'Stripe Treasury accounts are FDIC-insured through partner banks. This means customer funds are protected even if the bank fails - crucial for building trust.',
      importance: 'Makes Stripe Treasury accounts as safe as traditional bank accounts. Critical selling point for platforms offering financial services to their users.'
    },
    'Revenue recognition': {
      term: 'Revenue recognition',
      title: 'Revenue Recognition Principles',
      definition: 'Accounting rules determining when revenue should be recorded - when earned, not just when payment is received.',
      context: 'For subscriptions, you recognize revenue over the service period, not all upfront. Annual payments create deferred revenue. Critical for accurate financial reporting.',
      importance: 'Incorrect revenue recognition can lead to financial restatements, tax issues, and investor lawsuits. Stripe Billing helps automate compliant revenue reporting.'
    }
  };

  // Function to handle tooltip display
  const showTooltip = (term, event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    });
    setActiveTooltip(term);
  };

  // Component to render text with glossary terms
  const GlossaryText = ({ children }) => {
    if (typeof children !== 'string') return children;
    
    let text = children;
    const elements = [];
    let lastIndex = 0;
    
    // Find all glossary terms in the text
    Object.keys(glossary).forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(children)) !== null) {
        if (match.index > lastIndex) {
          elements.push(children.substring(lastIndex, match.index));
        }
        
        elements.push(
          <span
            key={`${term}-${match.index}`}
            className="border-b-2 border-dotted border-blue-400 cursor-help hover:border-solid hover:border-blue-300 transition-all"
            onClick={(e) => showTooltip(term, e)}
          >
            {match[0]}
          </span>
        );
        
        lastIndex = match.index + match[0].length;
      }
    });
    
    if (lastIndex < children.length) {
      elements.push(children.substring(lastIndex));
    }
    
    return elements.length > 0 ? <>{elements}</> : children;
  };

  // Tooltip component
  const Tooltip = () => {
    if (!activeTooltip || !glossary[activeTooltip]) return null;
    
    const info = glossary[activeTooltip];
    
    return (
      <div
        className="fixed z-50 max-w-md"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }}
      >
        <div className="bg-gray-800 border border-blue-500/50 rounded-lg shadow-2xl shadow-blue-500/20 p-4 relative">
          <button
            onClick={() => setActiveTooltip(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <h4 className="text-blue-400 font-bold text-lg mb-1">{info.title}</h4>
          <p className="text-white mb-3">{info.definition}</p>
          
          <div className="mb-3">
            <h5 className="text-yellow-400 text-sm font-semibold mb-1">Context</h5>
            <p className="text-gray-300 text-sm">{info.context}</p>
          </div>
          
          <div className="bg-blue-900/30 rounded p-2">
            <h5 className="text-green-400 text-sm font-semibold mb-1">Why This Matters</h5>
            <p className="text-gray-300 text-sm">{info.importance}</p>
          </div>
        </div>
      </div>
    );
  };

  const products = {
    payments: {
      icon: CreditCard,
      title: 'Payments',
      description: 'Accept payments globally with multiple payment methods',
      overview: {
        content: `Stripe Payments is the core product that enables businesses to accept payments online and in-person. It supports 135+ currencies and dozens of payment methods including cards, wallets, bank transfers, and buy-now-pay-later options.`,
        keyFeatures: [
          'Global payment processing with 135+ currencies',
          'PCI-DSS Level 1 certified infrastructure',
          'Machine learning fraud prevention',
          'Support for 3D Secure authentication',
          'Instant payouts in select countries'
        ]
      },
      apis: {
        paymentIntents: {
          title: 'Payment Intents API',
          description: 'The recommended way to build dynamic payment flows',
          endpoint: 'POST /v1/payment_intents',
          example: `// Server-side: Create a PaymentIntent
const stripe = require('stripe')('sk_test_...');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // $20.00 in cents
  currency: 'usd',
  payment_method_types: ['card'],
  metadata: {
    order_id: '12345',
    customer_email: 'customer@example.com'
  }
});

// Client-side: Confirm the payment
const { error } = await stripe.confirmCardPayment(
  paymentIntent.client_secret,
  {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: 'Customer Name'
      }
    }
  }
);`,
          bestPractices: [
            'Always create PaymentIntents on the server-side',
            'Use idempotency keys for retry safety',
            'Store the PaymentIntent ID for reconciliation',
            'Handle webhook events for async updates',
            'Implement proper error handling for all decline codes'
          ]
        },
        checkout: {
          title: 'Checkout Session API',
          description: 'Pre-built, hosted payment page optimized for conversion',
          endpoint: 'POST /v1/checkout/sessions',
          example: `const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Premium Subscription',
        description: 'Monthly access to all features'
      },
      unit_amount: 4999, // $49.99
      recurring: {
        interval: 'month'
      }
    },
    quantity: 1
  }],
  mode: 'subscription',
  success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://example.com/cancel',
  customer_email: 'customer@example.com',
  metadata: {
    user_id: 'usr_123'
  }
});`,
          bestPractices: [
            'Use Checkout for quick implementations',
            'Customize with your brand colors and logo',
            'Enable multiple payment methods globally',
            'Use success_url with session_id for fulfillment',
            'Test with Stripe CLI for webhook integration'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Set up your Stripe account',
            details: 'Create account, verify business, configure settings'
          },
          {
            title: '2. Install Stripe SDK',
            details: 'npm install stripe (server) and @stripe/stripe-js (client)'
          },
          {
            title: '3. Create payment flow',
            details: 'Choose between Checkout, Elements, or Payment Links'
          },
          {
            title: '4. Handle webhooks',
            details: 'Listen for payment confirmations and failures'
          },
          {
            title: '5. Test thoroughly',
            details: 'Use test cards and simulate various scenarios'
          }
        ]
      }
    },
    billing: {
      icon: FileText,
      title: 'Billing & Subscriptions',
      description: 'Manage recurring revenue with flexible subscription logic',
      overview: {
        content: `Stripe Billing provides a complete platform for subscription management, from simple recurring charges to complex usage-based billing with multiple pricing tiers.`,
        keyFeatures: [
          'Flexible subscription schedules',
          'Usage-based billing and tiered pricing',
          'Proration handling',
          'Trial periods and discounts',
          'Revenue recovery tools with dunning'
        ]
      },
      apis: {
        subscriptions: {
          title: 'Subscriptions API',
          description: 'Create and manage customer subscriptions',
          endpoint: 'POST /v1/subscriptions',
          example: `// Create a customer first
const customer = await stripe.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  payment_method: 'pm_card_visa',
  invoice_settings: {
    default_payment_method: 'pm_card_visa'
  }
});

// Create subscription with trial
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{
    price: 'price_1ABC123' // Price ID from dashboard
  }],
  trial_period_days: 14,
  metadata: {
    plan_type: 'premium'
  },
  expand: ['latest_invoice.payment_intent']
});

// Update subscription (upgrade/downgrade)
const updated = await stripe.subscriptions.update(
  subscription.id,
  {
    items: [{
      id: subscription.items.data[0].id,
      price: 'price_2DEF456' // New price ID
    }],
    proration_behavior: 'create_prorations'
  }
);`,
          bestPractices: [
            'Use Stripe-hosted invoice pages',
            'Implement dunning for failed payments',
            'Set up revenue recovery emails',
            'Use subscription schedules for complex changes',
            'Monitor MRR and churn metrics'
          ]
        },
        usageRecords: {
          title: 'Usage Records API',
          description: 'Report metered usage for usage-based billing',
          endpoint: 'POST /v1/subscription_items/:id/usage_records',
          example: `// Report usage for a metered subscription
const usageRecord = await stripe.subscriptionItems.createUsageRecord(
  'si_subscription_item_id',
  {
    quantity: 100, // e.g., API calls, GB transferred
    timestamp: Math.floor(Date.now() / 1000),
    action: 'increment' // or 'set' to override
  }
);

// Batch usage reporting (more efficient)
const records = await stripe.subscriptionItems.createUsageRecord(
  'si_subscription_item_id',
  {
    quantity: 500,
    timestamp: 'now',
    action: 'set'
  }
);`,
          bestPractices: [
            'Report usage in real-time or batches',
            'Use idempotency for usage records',
            'Set up usage alerts for customers',
            'Implement usage limits and overages',
            'Provide usage dashboards to customers'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Design your pricing model',
            details: 'Fixed, tiered, volume, or usage-based pricing'
          },
          {
            title: '2. Create products and prices',
            details: 'Use Dashboard or API to set up catalog'
          },
          {
            title: '3. Implement subscription flow',
            details: 'Customer creation, payment collection, subscription start'
          },
          {
            title: '4. Handle subscription events',
            details: 'Webhooks for updates, cancellations, renewals'
          },
          {
            title: '5. Build customer portal',
            details: 'Use Stripe-hosted or build custom management UI'
          }
        ]
      }
    },
    connect: {
      icon: Users,
      title: 'Connect',
      description: 'Build platforms and marketplaces with integrated payments',
      overview: {
        content: `Stripe Connect enables platforms to accept money and pay out to third parties. It handles the complexity of payments compliance, global banking, and regulatory requirements.`,
        keyFeatures: [
          'Three account types: Standard, Express account, Custom',
          'Global payouts in 45+ countries',
          'Instant onboarding flows',
          'Split payments and platform fees',
          'Compliance and KYC handling'
        ]
      },
      apis: {
        accounts: {
          title: 'Accounts API',
          description: 'Create and manage connected accounts',
          endpoint: 'POST /v1/accounts',
          example: `// Create Express account
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: 'seller@example.com',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true }
  },
  business_type: 'individual',
  business_profile: {
    url: 'https://seller.example.com',
    product_description: 'Handmade crafts'
  }
});

// Create account link for onboarding
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding'
});

// Create a transfer to connected account
const transfer = await stripe.transfers.create({
  amount: 7000, // $70.00
  currency: 'usd',
  destination: account.id,
  transfer_group: 'ORDER_95'
});`,
          bestPractices: [
            'Choose the right account type for your use case',
            'Implement progressive onboarding',
            'Handle account verification states',
            'Set up platform fees appropriately',
            'Monitor for suspicious activity'
          ]
        },
        paymentIntentsConnect: {
          title: 'Destination Charges',
          description: 'Process payments on behalf of connected accounts',
          endpoint: 'POST /v1/payment_intents',
          example: `// Destination charge (platform processes payment)
const payment = await stripe.paymentIntents.create({
  amount: 10000, // $100.00
  currency: 'usd',
  application_fee_amount: 1000, // $10.00 platform fee
  transfer_data: {
    destination: 'acct_connected_account_id'
  }
});

// Direct charge (connected account processes)
const directCharge = await stripe.paymentIntents.create({
  amount: 10000,
  currency: 'usd',
  application_fee_amount: 1000,
  on_behalf_of: 'acct_connected_account_id',
  transfer_data: {
    destination: 'acct_platform_account_id'
  }
}, {
  stripeAccount: 'acct_connected_account_id'
});`,
          bestPractices: [
            'Use destination charge for marketplace model',
            'Implement separate charges for SaaS platforms',
            'Handle refunds and disputes properly',
            'Set up Connect webhooks on platform',
            'Test with Connect test accounts'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Choose Connect type',
            details: 'Standard (full Stripe), Express (simple), or Custom (white-label)'
          },
          {
            title: '2. Implement onboarding',
            details: 'Use OAuth or Account Links for seller onboarding'
          },
          {
            title: '3. Set up payment flows',
            details: 'Destination charges, direct charges, or separate charges'
          },
          {
            title: '4. Handle payouts',
            details: 'Automatic or manual transfers to connected accounts'
          },
          {
            title: '5. Manage compliance',
            details: 'Monitor verification status and handle requirements'
          }
        ]
      }
    },
    radar: {
      icon: Shield,
      title: 'Radar',
      description: 'Machine learning fraud prevention built into Stripe',
      overview: {
        content: `Stripe Radar uses machine learning trained on billions of transactions to detect and prevent fraud. It's built directly into Stripe payments with no additional integration required.`,
        keyFeatures: [
          'Machine learning fraud detection',
          'Custom fraud rules engine',
          '3D Secure authentication (SCA compliant)',
          'Fraud risk scoring',
          'Block and allow lists'
        ]
      },
      apis: {
        radarRules: {
          title: 'Radar Rules Engine',
          description: 'Create custom fraud prevention rules',
          endpoint: 'Radar Dashboard / Rules API',
          example: `// Example custom rules (configured in Dashboard)

// Block high-risk countries
::country:: IN ('XX', 'YY') AND :risk_score: > 65
  -> BLOCK

// Request 3DS for large amounts
:amount: > 50000 AND :risk_score: > 40
  -> REQUEST_3D_SECURE

// Allow trusted customers
:customer: IN @trusted_customers_list
  -> ALLOW

// Review suspicious patterns
:card_country: != :ip_country: AND :is_anonymous_ip:
  -> REVIEW

// Using Radar data in API
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'usd',
  payment_method: 'pm_card_visa',
  radar_options: {
    session: 'rse_session_id' // From Radar Session API
  }
});`,
          bestPractices: [
            'Start with Stripe\'s default rules',
            'Create rules based on your risk profile',
            'Use 3D Secure for high-risk transactions',
            'Monitor false positive rates',
            'Regularly review and update rules'
          ]
        },
        reviews: {
          title: 'Reviews API',
          description: 'Manage manual fraud reviews',
          endpoint: 'GET /v1/reviews',
          example: `// List reviews requiring action
const reviews = await stripe.reviews.list({
  limit: 10
});

// Approve a review
const approved = await stripe.reviews.approve(
  'prv_review_id',
  {
    reason: 'customer_verified'
  }
);

// Close a review as fraudulent
const closed = await stripe.reviews.close(
  'prv_review_id',
  {
    reason: 'fraudulent'
  }
);

// Add to allow list after review
await stripe.radar.valueLists.create({
  alias: 'trusted_customers',
  name: 'Trusted Customers',
  item_type: 'customer'
});`,
          bestPractices: [
            'Review high-value transactions manually',
            'Train your team on fraud patterns',
            'Use webhooks for review.opened events',
            'Track review resolution times',
            'Update rules based on review outcomes'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Enable Radar',
            details: 'Automatically included with Stripe payments'
          },
          {
            title: '2. Configure rules',
            details: 'Set up custom rules in Dashboard'
          },
          {
            title: '3. Implement 3D Secure',
            details: 'Add SCA handling to payment flows'
          },
          {
            title: '4. Handle reviews',
            details: 'Set up process for manual review queue'
          },
          {
            title: '5. Monitor performance',
            details: 'Track fraud rates and false positives'
          }
        ]
      }
    },
    terminal: {
      icon: Terminal,
      title: 'Terminal',
      description: 'Accept in-person payments with pre-certified card readers',
      overview: {
        content: `Stripe Terminal enables businesses to extend their online presence to the physical world with pre-certified card readers that integrate seamlessly with your existing Stripe integration.`,
        keyFeatures: [
          'Pre-certified EMV card readers',
          'Unified online and offline payments',
          'Support for contactless and chip cards',
          'Custom checkout flows',
          'Works globally in 40+ countries'
        ]
      },
      apis: {
        readers: {
          title: 'Terminal Readers API',
          description: 'Manage and connect to card readers',
          endpoint: 'POST /v1/terminal/readers',
          example: `// Register a new reader
const reader = await stripe.terminal.readers.create({
  registration_code: 'puppies-plug-could',
  label: 'Front Desk Reader',
  location: 'tml_location_id'
});

// Create connection token for SDK
const connectionToken = await stripe.terminal.connectionTokens.create({
  location: 'tml_location_id'
});

// Client-side: Initialize Terminal SDK
const terminal = StripeTerminal.create({
  onFetchConnectionToken: async () => {
    const response = await fetch('/connection_token');
    const data = await response.json();
    return data.secret;
  }
});

// Discover and connect to readers
const discoverResult = await terminal.discoverReaders({
  simulated: false,
  location: 'tml_location_id'
});

const reader = discoverResult.discoveredReaders[0];
const connectResult = await terminal.connectReader(reader);`,
          bestPractices: [
            'Use locations to organize readers',
            'Implement offline mode for resilience',
            'Handle reader disconnections gracefully',
            'Test with simulated readers first',
            'Keep reader firmware updated'
          ]
        },
        terminalPayments: {
          title: 'Terminal Payment Collection',
          description: 'Collect payments through Terminal readers',
          endpoint: 'Terminal SDK Methods',
          example: `// Server: Create PaymentIntent
const intent = await stripe.paymentIntents.create({
  amount: 2500,
  currency: 'usd',
  payment_method_types: ['card_present'],
  capture_method: 'automatic'
});

// Client: Collect payment method
const result = await terminal.collectPaymentMethod(
  intent.client_secret,
  {
    config_override: {
      skip_tipping: false,
      tipping: {
        amount_eligible: 2500,
        percentages: [15, 20, 25]
      }
    }
  }
);

// Process the payment
const processResult = await terminal.processPayment(
  result.paymentIntent
);

// Server: Capture if manual capture
if (processResult.paymentIntent.capture_method === 'manual') {
  await stripe.paymentIntents.capture(
    processResult.paymentIntent.id
  );
}`,
          bestPractices: [
            'Show clear payment status to customers',
            'Handle network interruptions',
            'Implement receipt options',
            'Support tipping where appropriate',
            'Test all card types and methods'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Order Terminal readers',
            details: 'Choose from BBPOS, Verifone, or mobile readers'
          },
          {
            title: '2. Set up locations',
            details: 'Create locations for reader management'
          },
          {
            title: '3. Integrate Terminal SDK',
            details: 'Add JavaScript, iOS, or Android SDK'
          },
          {
            title: '4. Build checkout flow',
            details: 'Design customer-facing payment experience'
          },
          {
            title: '5. Handle offline mode',
            details: 'Store and forward for network issues'
          }
        ]
      }
    },
    identity: {
      icon: Lock,
      title: 'Identity',
      description: 'Programmatically verify the identity of global users',
      overview: {
        content: `Stripe Identity helps you confirm the identity of global users to prevent fraud, streamline risk operations, and increase trust and safety.`,
        keyFeatures: [
          'Global ID document verification',
          'Biometric verification with selfies',
          'Automated verification flows',
          'Support for 100+ ID types',
          'AML and sanctions screening'
        ]
      },
      apis: {
        verificationSessions: {
          title: 'Verification Sessions API',
          description: 'Create and manage identity verification flows',
          endpoint: 'POST /v1/identity/verification_sessions',
          example: `// Create verification session
const session = await stripe.identity.verificationSessions.create({
  type: 'document',
  metadata: {
    user_id: 'usr_123',
    verification_type: 'kyc'
  },
  options: {
    document: {
      allowed_types: ['driving_license', 'passport'],
      require_id_number: true,
      require_live_capture: true
    }
  }
});

// Client-side redirect
window.location.href = session.url;

// Or use embedded component
const verificationSession = await stripe.verifyIdentity(
  session.client_secret
);

// Check verification status
const updatedSession = await stripe.identity.verificationSessions.retrieve(
  session.id
);

if (updatedSession.status === 'verified') {
  // User successfully verified
  const verifiedData = updatedSession.verified_outputs;
}`,
          bestPractices: [
            'Clearly explain why verification is needed',
            'Support multiple document types',
            'Handle partial matches appropriately',
            'Store verification results securely',
            'Re-verify based on risk signals'
          ]
        },
        verificationReports: {
          title: 'Verification Reports API',
          description: 'Access detailed verification results',
          endpoint: 'GET /v1/identity/verification_reports',
          example: `// Retrieve verification report
const report = await stripe.identity.verificationReports.retrieve(
  'vr_report_id'
);

// Check specific verifications
const { 
  document,
  id_number,
  selfie,
  address
} = report;

// Document verification details
if (document.status === 'verified') {
  console.log('Document type:', document.type);
  console.log('Expiry:', document.expiry_date);
  console.log('Issuing country:', document.issuing_country);
}

// Check for warnings or issues
if (document.error) {
  // Handle specific error codes
  switch(document.error.code) {
    case 'document_expired':
      // Request new document
      break;
    case 'document_type_not_supported':
      // Suggest alternative documents
      break;
  }
}`,
          bestPractices: [
            'Handle edge cases in verification',
            'Provide clear error messages',
            'Allow re-submission for failures',
            'Monitor verification success rates',
            'Implement manual review process'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Define verification requirements',
            details: 'Determine what identity checks you need'
          },
          {
            title: '2. Design verification flow',
            details: 'Embedded or redirect experience'
          },
          {
            title: '3. Create verification sessions',
            details: 'Configure options and requirements'
          },
          {
            title: '4. Handle verification results',
            details: 'Process outcomes and handle failures'
          },
          {
            title: '5. Monitor and optimize',
            details: 'Track conversion and fraud rates'
          }
        ]
      }
    },
    issuing: {
      icon: CreditCard,
      title: 'Issuing',
      description: 'Create and manage physical and virtual payment cards',
      overview: {
        content: `Stripe Issuing allows you to create, manage, and distribute physical and virtual cards. Control spending with real-time authorizations and build card programs tailored to your business needs.`,
        keyFeatures: [
          'Instant virtual card creation',
          'Custom physical card designs',
          'Real-time authorization controls',
          'Spending limits and controls',
          'Global card issuance'
        ]
      },
      apis: {
        cards: {
          title: 'Cards API',
          description: 'Create and manage issued cards',
          endpoint: 'POST /v1/issuing/cards',
          example: `// Create a cardholder
const cardholder = await stripe.issuing.cardholders.create({
  type: 'individual',
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone_number: '+1234567890',
  billing: {
    address: {
      line1: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      postal_code: '94105'
    }
  }
});

// Create a virtual card
const card = await stripe.issuing.cards.create({
  cardholder: cardholder.id,
  currency: 'usd',
  type: 'virtual',
  spending_controls: {
    spending_limits: [{
      amount: 100000, // $1,000.00
      interval: 'daily'
    }],
    allowed_categories: [
      'airlines',
      'lodging',
      'restaurants'
    ]
  }
});

// Create authorization controls
const authorization = await stripe.issuing.authorizations.approve(
  'iauth_authorization_id',
  {
    amount: 5000 // Approve partial amount
  }
);`,
          bestPractices: [
            'Implement real-time authorization webhooks',
            'Set appropriate spending controls',
            'Monitor for fraudulent transactions',
            'Provide cardholder support tools',
            'Handle card lifecycle events'
          ]
        },
        authorizations: {
          title: 'Authorization Controls',
          description: 'Control card spending in real-time',
          endpoint: 'Webhook: issuing_authorization.request',
          example: `// Real-time authorization webhook
app.post('/webhook/issuing', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'issuing_authorization.request') {
    const auth = event.data.object;
    
    // Custom authorization logic
    let approved = true;
    let reason = null;
    
    // Check merchant
    if (auth.merchant_data.category === 'gambling') {
      approved = false;
      reason = 'merchant_category_blocked';
    }
    
    // Check amount
    if (auth.amount > 50000) { // $500.00
      approved = false;
      reason = 'amount_exceeds_limit';
    }
    
    // Check velocity
    const recentAuths = await getRecentAuthorizations(
      auth.card.id
    );
    if (recentAuths.length > 5) {
      approved = false;
      reason = 'velocity_limit_exceeded';
    }
    
    // Respond within 2 seconds
    if (approved) {
      await stripe.issuing.authorizations.approve(auth.id);
    } else {
      await stripe.issuing.authorizations.decline(auth.id, {
        reason: reason
      });
    }
  }
  
  res.json({ received: true });
});`,
          bestPractices: [
            'Respond to auth webhooks within 2 seconds',
            'Implement comprehensive fraud rules',
            'Log all authorization decisions',
            'Build cardholder notifications',
            'Handle edge cases gracefully'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Apply for Issuing access',
            details: 'Submit application and get approved'
          },
          {
            title: '2. Design card program',
            details: 'Define cardholder types and controls'
          },
          {
            title: '3. Implement authorization logic',
            details: 'Build real-time decision engine'
          },
          {
            title: '4. Create cardholder experience',
            details: 'Card management, transactions, statements'
          },
          {
            title: '5. Handle compliance',
            details: 'KYC, AML, and regulatory requirements'
          }
        ]
      }
    },
    treasury: {
      icon: Building2,
      title: 'Treasury',
      description: 'Banking-as-a-service for platforms',
      overview: {
        content: `Stripe Treasury enables platforms to embed financial services and build custom money management solutions. Offer your users financial accounts, pay bills, manage cash flow, and earn yield.`,
        keyFeatures: [
          'FDIC-insured financial accounts',
          'ACH and wire transfers',
          'Yield-earning accounts',
          'Bill pay capabilities',
          'API-first banking infrastructure'
        ]
      },
      apis: {
        financialAccounts: {
          title: 'Financial Accounts API',
          description: 'Create and manage bank accounts',
          endpoint: 'POST /v1/treasury/financial_accounts',
          example: `// Create a financial account
const account = await stripe.treasury.financialAccounts.create({
  supported_currencies: ['usd'],
  features: {
    card_issuing: { requested: true },
    deposit_insurance: { requested: true },
    financial_addresses: { 
      aba: { requested: true } 
    },
    inbound_transfers: { 
      ach: { requested: true } 
    },
    outbound_payments: {
      ach: { requested: true },
      us_domestic_wire: { requested: true }
    },
    outbound_transfers: {
      ach: { requested: true },
      us_domestic_wire: { requested: true }
    }
  }
});

// Get account details
const details = await stripe.treasury.financialAccounts.retrieveFeatures(
  account.id
);

// Create an outbound payment
const payment = await stripe.treasury.outboundPayments.create({
  financial_account: account.id,
  amount: 100000, // $1,000.00
  currency: 'usd',
  destination_payment_method: 'pm_bank_account',
  description: 'Vendor payment'
});`,
          bestPractices: [
            'Enable only needed features',
            'Implement proper KYC flows',
            'Monitor account balances',
            'Handle payment failures gracefully',
            'Provide transaction history'
          ]
        },
        transactions: {
          title: 'Transaction Management',
          description: 'Track money movement and balances',
          endpoint: 'GET /v1/treasury/transactions',
          example: `// List transactions
const transactions = await stripe.treasury.transactions.list({
  financial_account: 'fa_account_id',
  limit: 100,
  created: {
    gte: Math.floor(Date.now() / 1000) - 86400 // Last 24 hours
  }
});

// Get balance history
const balances = await stripe.treasury.transactionEntries.list({
  financial_account: 'fa_account_id',
  limit: 50
});

// Calculate running balance
let runningBalance = 0;
balances.data.forEach(entry => {
  if (entry.type === 'credit') {
    runningBalance += entry.amount;
  } else {
    runningBalance -= entry.amount;
  }
  console.log(\`Balance after \${entry.created}: \${runningBalance}\`);
});

// Export transactions
const export = await stripe.treasury.financialAccountTransactions.export({
  financial_account: 'fa_account_id',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  format: 'csv'
});`,
          bestPractices: [
            'Provide real-time balance updates',
            'Categorize transactions clearly',
            'Enable transaction search and filters',
            'Support statement generation',
            'Implement reconciliation tools'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Apply for Treasury access',
            details: 'Submit platform application'
          },
          {
            title: '2. Design account structure',
            details: 'Plan account types and features'
          },
          {
            title: '3. Build onboarding flow',
            details: 'KYC and account opening process'
          },
          {
            title: '4. Implement money movement',
            details: 'Transfers, payments, and card controls'
          },
          {
            title: '5. Create management UI',
            details: 'Balances, transactions, statements'
          }
        ]
      }
    },
    climate: {
      icon: Globe,
      title: 'Climate',
      description: 'Direct a fraction of revenue to carbon removal',
      overview: {
        content: `Stripe Climate makes it easy to direct a fraction of your revenue to help scale emerging carbon removal technologies. Join thousands of businesses in the fight against climate change.`,
        keyFeatures: [
          'Automatic contribution calculation',
          'Support vetted carbon removal projects',
          'Transparent impact reporting',
          'No overhead or fees',
          'Easy integration with existing payments'
        ]
      },
      apis: {
        contributions: {
          title: 'Climate Contributions',
          description: 'Automatically contribute to carbon removal',
          endpoint: 'Dashboard Configuration',
          example: `// Option 1: Percentage of revenue (via Dashboard)
// Set up in Dashboard > Climate

// Option 2: Per-transaction contribution
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10000, // $100.00
  currency: 'usd',
  metadata: {
    climate_contribution_amount: 100 // $1.00
  }
});

// Option 3: Direct contribution via invoice
const invoice = await stripe.invoices.create({
  customer: 'cus_customer_id',
  collection_method: 'send_invoice',
  days_until_due: 30,
  custom_fields: [{
    name: 'Climate Contribution',
    value: '1% of purchase'
  }]
});

// Add climate contribution line item
await stripe.invoiceItems.create({
  customer: 'cus_customer_id',
  invoice: invoice.id,
  amount: 100, // $1.00
  currency: 'usd',
  description: 'Stripe Climate contribution'
});`,
          bestPractices: [
            'Start with a small percentage (0.5-1%)',
            'Communicate impact to customers',
            'Display Climate badge on checkout',
            'Track and report contributions',
            'Consider customer opt-in options'
          ]
        }
      },
      integration: {
        steps: [
          {
            title: '1. Enable Climate in Dashboard',
            details: 'Choose contribution percentage'
          },
          {
            title: '2. Configure contribution model',
            details: 'Automatic percentage or per-transaction'
          },
          {
            title: '3. Add customer messaging',
            details: 'Explain climate contribution at checkout'
          },
          {
            title: '4. Monitor impact',
            details: 'View contribution reports and impact'
          }
        ]
      }
    }
  };

  const architecturePatterns = {
    microservices: {
      title: 'Microservices Payment Architecture',
      description: 'Distributed payment processing across services',
      diagram: `
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │     │ Mobile App  │     │   Partner   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼─────┐  ┌────────▼─────┐
│Payment Service│  │User Service  │  │Order Service │
└───────┬──────┘  └──────────────┘  └──────────────┘
        │
┌───────▼──────┐
│  Stripe API  │
└──────────────┘`,
      implementation: `// Payment Service
class PaymentService {
  async createPayment(order) {
    // Idempotency key for reliability
    const idempotencyKey = \`payment-\${order.id}-\${Date.now()}\`;
    
    try {
      const intent = await stripe.paymentIntents.create({
        amount: order.total,
        currency: order.currency,
        customer: order.customerId,
        metadata: {
          order_id: order.id,
          service: 'payment-service'
        }
      }, {
        idempotencyKey
      });
      
      // Publish event
      await eventBus.publish('payment.created', {
        orderId: order.id,
        paymentIntentId: intent.id
      });
      
      return intent;
    } catch (error) {
      await this.handlePaymentError(error, order);
    }
  }
}

// Event handler for other services
eventBus.subscribe('payment.succeeded', async (event) => {
  await orderService.fulfillOrder(event.orderId);
  await emailService.sendReceipt(event.customerId);
});`
    },
    eventDriven: {
      title: 'Event-Driven Architecture',
      description: 'Webhook-based asynchronous processing',
      diagram: `
┌────────────┐        ┌──────────────┐
│   Stripe   │───────▶│Webhook Handler│
└────────────┘        └───────┬──────┘
                              │
                    ┌─────────▼─────────┐
                    │   Event Router    │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────┐     ┌────────▼─────┐     ┌────────▼─────┐
│Order Handler │     │Fraud Handler │     │Email Handler │
└──────────────┘     └──────────────┘     └──────────────┘`,
      implementation: `// Webhook handler with reliability
app.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
  
  // Process events asynchronously
  await eventQueue.push({
    type: event.type,
    data: event.data,
    received: Date.now()
  });
  
  // Acknowledge receipt immediately
  res.json({ received: true });
});

// Async event processor
class EventProcessor {
  async process(event) {
    const handlers = {
      'payment_intent.succeeded': this.handlePaymentSuccess,
      'payment_intent.failed': this.handlePaymentFailure,
      'customer.subscription.created': this.handleNewSubscription,
      'invoice.payment_failed': this.handleFailedInvoice
    };
    
    const handler = handlers[event.type];
    if (handler) {
      await handler.call(this, event.data.object);
    }
  }
  
  async handlePaymentSuccess(paymentIntent) {
    // Update order status
    await db.orders.update({
      where: { id: paymentIntent.metadata.order_id },
      data: { 
        status: 'paid',
        paidAt: new Date()
      }
    });
    
    // Trigger fulfillment
    await fulfillmentService.process(paymentIntent.metadata.order_id);
  }
}`
    },
    globalScale: {
      title: 'Global Scale Architecture',
      description: 'Multi-region payment processing with high availability',
      diagram: `
┌─────────────────────────────────────────────────┐
│                 Global Load Balancer             │
└────────────────────────┬────────────────────────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
┌─────▼─────┐     ┌──────▼──────┐    ┌──────▼──────┐
│  US-EAST  │     │  EU-WEST    │    │  AP-SOUTH   │
└─────┬─────┘     └──────┬──────┘    └──────┬──────┘
      │                  │                  │
┌─────▼─────┐     ┌──────▼──────┐    ┌──────▼──────┐
│   Cache   │     │    Cache    │    │    Cache    │
└───────────┘     └─────────────┘    └─────────────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
                 ┌───────▼───────┐
                 │  Stripe API   │
                 └───────────────┘`,
      implementation: `// Multi-region configuration
class PaymentProcessor {
  constructor() {
    this.regions = {
      'us-east': new Stripe(process.env.STRIPE_KEY, {
        apiVersion: '2023-10-16',
        maxNetworkRetries: 3,
        timeout: 30000
      }),
      'eu-west': new Stripe(process.env.STRIPE_KEY, {
        apiVersion: '2023-10-16',
        host: 'api.stripe.com'
      }),
      'ap-south': new Stripe(process.env.STRIPE_KEY, {
        apiVersion: '2023-10-16',
        host: 'api.stripe.com'
      })
    };
  }
  
  async processPayment(paymentData, region) {
    const stripe = this.regions[region] || this.regions['us-east'];
    
    // Implement circuit breaker
    if (await this.circuitBreaker.isOpen(region)) {
      // Failover to another region
      region = this.getFailoverRegion(region);
      stripe = this.regions[region];
    }
    
    try {
      const result = await stripe.paymentIntents.create({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          processed_region: region
        }
      });
      
      // Cache for read operations
      await cache.set(
        \`payment:\${result.id}\`,
        result,
        { region, ttl: 3600 }
      );
      
      return result;
    } catch (error) {
      await this.handleRegionalFailure(error, region);
      throw error;
    }
  }
}`
    }
  };

  // Wrapper component that processes all text
  const ProcessedContent = ({ children }) => {
    if (typeof children === 'string') {
      return <GlossaryText>{children}</GlossaryText>;
    }
    
    if (Array.isArray(children)) {
      return children.map((child, idx) => 
        <ProcessedContent key={idx}>{child}</ProcessedContent>
      );
    }
    
    if (React.isValidElement(children) && children.props.children) {
      return React.cloneElement(children, {
        children: <ProcessedContent>{children.props.children}</ProcessedContent>
      });
    }
    
    return children;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Tooltip />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Stripe Integration Master Guide
          </h1>
          <p className="text-gray-400">
            <ProcessedContent>
              Comprehensive guide to Stripe products, APIs, and architectural patterns for solution architects. Hover over highlighted terms to learn more.
            </ProcessedContent>
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(products).map(([key, product]) => {
            const Icon = product.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveProduct(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeProduct === key 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {product.title}
              </button>
            );
          })}
        </div>

        {/* Product Content */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(products[activeProduct].icon, { className: "w-8 h-8 text-blue-400" })}
            <div>
              <h2 className="text-2xl font-bold">{products[activeProduct].title}</h2>
              <p className="text-gray-400">
                <ProcessedContent>{products[activeProduct].description}</ProcessedContent>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-800">
            {['overview', 'apis', 'integration'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 capitalize transition-all ${
                  activeTab === tab 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <p className="text-gray-300 mb-6">
                <ProcessedContent>{products[activeProduct].overview.content}</ProcessedContent>
              </p>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Key Features</h3>
              <div className="grid gap-2">
                {products[activeProduct].overview.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      <ProcessedContent>{feature}</ProcessedContent>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-8">
              {Object.entries(products[activeProduct].apis).map(([key, api]) => (
                <div key={key} className="bg-gray-800 rounded-lg p-5">
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">{api.title}</h3>
                  <p className="text-gray-400 mb-4">
                    <ProcessedContent>{api.description}</ProcessedContent>
                  </p>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-mono text-green-400">{api.endpoint}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Example Implementation</h4>
                    <pre className="bg-black rounded p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">{api.example}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Best Practices</h4>
                    <ul className="space-y-1">
                      {api.bestPractices.map((practice, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">
                            <ProcessedContent>{practice}</ProcessedContent>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'integration' && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Integration Steps</h3>
              <div className="space-y-4">
                {products[activeProduct].integration.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm">
                        <ProcessedContent>{step.details}</ProcessedContent>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Architecture Patterns */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            Architecture Patterns
          </h2>
          <div className="space-y-8">
            {Object.entries(architecturePatterns).map(([key, pattern]) => (
              <div key={key} className="bg-gray-800 rounded-lg p-5">
                <h3 className="text-xl font-semibold mb-2 text-purple-400">{pattern.title}</h3>
                <p className="text-gray-400 mb-4">
                  <ProcessedContent>{pattern.description}</ProcessedContent>
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Architecture Diagram</h4>
                  <pre className="bg-black rounded p-4 overflow-x-auto text-xs text-gray-400">
                    {pattern.diagram}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Implementation Example</h4>
                  <pre className="bg-black rounded p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300">{pattern.implementation}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Solution Architect Pro Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">
                    <ProcessedContent>Idempotency is Critical</ProcessedContent>
                  </h4>
                  <p className="text-sm text-gray-400">
                    <ProcessedContent>Always use idempotency keys for payment operations to prevent duplicate charges</ProcessedContent>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">
                    <ProcessedContent>Webhook Reliability</ProcessedContent>
                  </h4>
                  <p className="text-sm text-gray-400">
                    <ProcessedContent>Implement retry logic and event deduplication for webhook processing</ProcessedContent>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Test Everything</h4>
                  <p className="text-sm text-gray-400">
                    <ProcessedContent>Use Stripe CLI for local webhook testing and test mode for integration testing</ProcessedContent>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Monitor Performance</h4>
                  <p className="text-sm text-gray-400">
                    <ProcessedContent>Track API latency, success rates, and implement circuit breaker patterns for resilience</ProcessedContent>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeGuideApp;
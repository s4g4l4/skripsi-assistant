import { Request, Response } from 'express';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '5x generate proposal',
      '10x AI rewrite',
      '3x citation export',
      '1x simulasi sidang',
      'Auto format 1 dokumen',
      'Storage 50MB'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99000,
    features: [
      'Unlimited semua fitur',
      'Storage 2GB',
      'Priority support'
    ]
  }
];

const subscriptions: any[] = [];
const invoices: any[] = [];

export const getPlans = (req: Request, res: Response) => {
  res.json({ plans: PLANS });
};

export const subscribe = (req: Request, res: Response) => {
  const { planId } = req.body;
  const plan = PLANS.find(p => p.id === planId);
  
  if (!plan) return res.status(400).json({ error: 'Plan not found' });
  
  const paymentUrl = `https://mock-payment-gateway.com/pay/${Date.now()}`;
  
  res.json({ 
    message: 'Subscription initiated', 
    paymentUrl,
    plan
  });
};

export const webhook = (req: Request, res: Response) => {
  const { transactionId, status, userId, planId } = req.body;
  
  if (status === 'success') {
    subscriptions.push({ userId, planId, status: 'active', date: new Date().toISOString() });
    invoices.push({ id: transactionId, userId, amount: 99000, status: 'paid', date: new Date().toISOString() });
  }
  
  res.json({ message: 'Webhook received' });
};

export const getInvoices = (req: Request, res: Response) => {
  // In a real app, filter by req.user.id
  res.json({ invoices });
};

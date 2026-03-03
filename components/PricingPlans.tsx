'use client';

import { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '5 AI questions per day',
      'Basic study timer',
      'Simple calculator',
      'Progress tracking',
      'Community support'
    ],
    buttonText: 'Get Started',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Pro',
    price: '₹499',
    period: 'month',
    description: 'Best for serious CA students',
    features: [
      'Unlimited AI questions',
      'Advanced study analytics',
      'CA-specific calculators',
      'Study schedule planner',
      'Priority support',
      'Offline access',
      'Custom study goals'
    ],
    buttonText: 'Start Pro Trial',
    popular: true,
    color: 'blue'
  },
  {
    name: 'Premium',
    price: '₹999',
    period: 'month',
    description: 'For CA coaching institutes',
    features: [
      'Everything in Pro',
      'Multiple student accounts',
      'Institute dashboard',
      'Bulk question uploads',
      'Custom branding',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    color: 'purple'
  }
];

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Unlock your CA potential with our AI-powered study tools
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1 text-green-500 text-sm font-medium">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-xl'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {billingCycle === 'yearly' && plan.name !== 'Free' 
                      ? `₹${Math.floor(parseInt(plan.price.replace('₹', '')) * 0.8)}`
                      : plan.price
                    }
                  </span>
                  {plan.name !== 'Free' && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      /{billingCycle === 'yearly' ? 'year' : plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
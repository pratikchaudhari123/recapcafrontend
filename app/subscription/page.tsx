'use client';

import { useState, useEffect } from 'react';
import { Check, Crown, Zap, Star, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import toast from 'react-hot-toast';

interface Plan {
  plan_type: string;
  name: string;
  price: number;
  duration_months: number;
  daily_question_limit: number | null;
  total_question_limit: number | null;
  features: string[];
}

// Fallback plans in case API fails
const FALLBACK_PLANS: Record<string, Plan> = {
  FREE: {
    plan_type: 'FREE',
    name: 'Free Plan',
    price: 0,
    duration_months: 6,
    daily_question_limit: null,
    total_question_limit: 10,
    features: [
      '10 AI questions (one-time)',
      'Basic study timer',
      'Simple calculator',
      'Progress tracking',
      'Valid for 6 months',
      'Perfect for trying the platform'
    ]
  },
  BASIC: {
    plan_type: 'BASIC',
    name: 'Basic Plan',
    price: 199,
    duration_months: 1,
    daily_question_limit: 25,
    total_question_limit: null,
    features: [
      '25 AI questions per day',
      'Unlimited total questions',
      'Advanced study timer',
      'CA-specific calculators',
      'Progress analytics',
      'Email support',
      'Deep study mode access'
    ]
  },
  PRO: {
    plan_type: 'PRO',
    name: 'Pro Plan',
    price: 399,
    duration_months: 1,
    daily_question_limit: 50,
    total_question_limit: null,
    features: [
      '50 AI questions per day',
      'Unlimited total questions',
      'All Basic features',
      'Priority AI responses',
      'Custom study goals',
      'Priority email support',
      'Exam preparation tools',
      'Study schedule planner'
    ]
  },
  PREMIUM: {
    plan_type: 'PREMIUM',
    name: 'Premium Plan',
    price: 799,
    duration_months: 1,
    daily_question_limit: 100,
    total_question_limit: null,
    features: [
      '100 AI questions per day',
      'Unlimited total questions',
      'All Pro features',
      'Dedicated support',
      'Mock test access',
      'Performance reports',
      'Custom study materials',
      'Career guidance'
    ]
  },
  ULTIMATE: {
    plan_type: 'ULTIMATE',
    name: 'Ultimate Plan',
    price: 999,
    duration_months: 1,
    daily_question_limit: null,
    total_question_limit: null,
    features: [
      'Unlimited AI questions',
      'All Premium features',
      'One-on-one mentoring sessions',
      'Personalized study plan',
      'Direct mentor access',
      'Weekly progress reviews',
      'Exam strategy sessions',
      'Lifetime access to materials'
    ]
  }
};

export default function SubscriptionPage() {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState<Record<string, Plan>>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await apiService.getSubscriptionPlans();
      if (response.data?.plans && Object.keys(response.data.plans).length > 0) {
        setPlans(response.data.plans);
      } else {
        // Use fallback plans if API returns empty
        console.log('Using fallback plans');
      }
    } catch (error) {
      console.error('Failed to load plans, using fallback:', error);
      // Keep fallback plans, don't show error to user
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: string, price: number) => {
    if (!currentUser) {
      toast.error('Please login to upgrade');
      return;
    }

    if (planType === 'FREE') {
      toast('You are already on the free plan');
      return;
    }

    setUpgrading(planType);

    try {
      // Force token refresh to ensure it's valid
      const token = await currentUser.getIdToken(true);
      
      // Debug log - payment payload
      console.log('💳 Creating payment order:', {
        plan_type: planType,
        token: token.substring(0, 20) + '...'
      });
      
      // Step 1: Create payment order (backend expects only plan_type)
      const orderResponse = await apiService.createPaymentOrder(planType, token);

      if (!orderResponse.data || orderResponse.error) {
        console.error('❌ Payment order failed:', orderResponse.error);
        toast.error(orderResponse.error || 'Failed to create payment order');
        setUpgrading(null);
        return;
      }

      const orderData = orderResponse.data;
      console.log('✅ Payment order created:', orderData.order_id);

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: 'Recap CA AI',
        description: `${orderData.plan_name} Subscription`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Step 3: Verify payment on backend
          try {
            // 🔄 CRITICAL FIX: Refresh token before verification
            // Token may have expired if user took time to complete payment
            console.log('🔄 Refreshing token before payment verification...');
            const freshToken = await currentUser.getIdToken(true);
            console.log('✅ Fresh token obtained for verification');
            
            const verifyResponse = await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan_type: planType
            }, freshToken);

            if (verifyResponse.data?.success) {
              toast.success(verifyResponse.data.message || 'Payment successful!');
              // Reload page to refresh subscription status
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              toast.error(verifyResponse.data?.message || 'Payment verification failed');
              setUpgrading(null);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            setUpgrading(null);
          }
        },
        prefill: {
          email: currentUser.email || '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            toast('Payment cancelled');
            setUpgrading(null);
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        toast.error('Payment service not loaded. Please refresh the page.');
        setUpgrading(null);
        return;
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error('Failed to initiate payment');
      setUpgrading(null);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return <Zap className="w-6 h-6" />;
      case 'PRO':
        return <Star className="w-6 h-6" />;
      case 'PREMIUM':
        return <Crown className="w-6 h-6" />;
      case 'ULTIMATE':
        return <Crown className="w-6 h-6" />;
      default:
        return <Check className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'PRO':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'PREMIUM':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'ULTIMATE':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-gray-300 dark:border-gray-700';
    }
  };

  const getButtonColor = (planType: string) => {
    switch (planType) {
      case 'BASIC':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'PRO':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'PREMIUM':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'ULTIMATE':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </ProtectedRoute>
    );
  }

  const planOrder = ['FREE', 'BASIC', 'PRO', 'PREMIUM', 'ULTIMATE'];
  const sortedPlans = Object.entries(plans).sort(
    ([a], [b]) => planOrder.indexOf(a) - planOrder.indexOf(b)
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Unlock your CA potential with our AI-powered study assistant
            </p>
          </div>

          {/* Current Subscription Status */}
          <div className="max-w-md mx-auto mb-12">
            <SubscriptionStatus />
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {sortedPlans.map(([planType, plan]) => (
              <div
                key={planType}
                className={`relative rounded-2xl border-2 p-6 bg-white dark:bg-gray-800 transition-all hover:shadow-lg ${
                  planType === 'PRO' ? getPlanColor(planType) : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {planType === 'PRO' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  planType === 'FREE' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' :
                  planType === 'BASIC' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' :
                  planType === 'PRO' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' :
                  planType === 'PREMIUM' ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400' :
                  'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {getPlanIcon(planType)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{plan.price}
                  </span>
                  {plan.duration_months > 0 && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      / {plan.duration_months} {plan.duration_months === 1 ? 'month' : 'months'}
                    </span>
                  )}
                  {planType === 'FREE' && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      / 6 months
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => handleUpgrade(planType, plan.price)}
                  disabled={upgrading !== null || planType === 'FREE'}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    planType === 'FREE'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : `${getButtonColor(planType)} text-white`
                  }`}
                >
                  {upgrading === planType ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : planType === 'FREE' ? (
                    'Current Plan'
                  ) : (
                    'Upgrade Now'
                  )}
                </button>

                {planType !== 'FREE' && upgrading !== planType && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                    Secure payment via Razorpay
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include access to our AI-powered study assistant trained on CA curriculum
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Need help choosing? Contact us at support@recapca.ai
            </p>
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Compare Plans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Basic
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600 dark:text-purple-400">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-orange-600 dark:text-orange-400">
                      Premium
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      Ultimate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      Daily Questions
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">10 total</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">25/day</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">50/day</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">100/day</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      Total Questions
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">10</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      Study Timer
                    </td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      Deep Study Mode
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      Priority Support
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      One-on-One Mentoring
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I upgrade or downgrade my plan anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! You can upgrade your plan at any time. The new plan will be activated immediately after payment.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay secure payment gateway.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How does the AI study assistant work?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Our AI is trained specifically on CA curriculum including accounting, taxation, auditing, and law. It provides instant answers to your questions with relevant examples and explanations.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is my payment secure?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! All payments are processed through Razorpay, India's most trusted payment gateway with bank-level security and encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

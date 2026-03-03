'use client';

import { useEffect, useState } from 'react';
import { Crown, Calendar, MessageCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface SubscriptionData {
  plan_type: string;
  plan_name: string;
  expiry_date: string | null;
  is_active: boolean;
  questions_remaining_today: number;
  total_questions_used: number;
  daily_limit: number | null;
  total_limit: number | null;
}

export default function SubscriptionStatus() {
  const { currentUser, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingRef, setIsLoadingRef] = useState(false); // Prevent multiple calls

  useEffect(() => {
    // HARD AUTH GUARD: Wait for auth to initialize
    console.log('🔐 AUTH STATE:', { authLoading, hasUser: !!currentUser, uid: currentUser?.uid });
    
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }
    
    if (!currentUser) {
      console.log('❌ No user, skipping subscription load');
      setLoading(false);
      return;
    }
    
    console.log('✅ Auth ready, loading subscription');
    loadSubscriptionStatus();
  }, [authLoading, currentUser]);

  const loadSubscriptionStatus = async () => {
    // HARD GUARD: Prevent multiple simultaneous calls
    if (isLoadingRef) {
      console.log('⚠️ Already loading, skipping duplicate call');
      return;
    }
    
    // HARD GUARD: Prevent API call without authenticated user
    if (!currentUser) {
      console.log('❌ loadSubscriptionStatus: No user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setIsLoadingRef(true);
      
      // Force token refresh to ensure it's valid
      const token = await currentUser.getIdToken(true);
      
      // HARD GUARD: Verify token exists
      if (!token || token.trim() === '') {
        console.error('❌ No token generated');
        throw new Error('No auth token');
      }
      
      // Debug log
      console.log('🔑 TOKEN EXISTS:', !!token);
      console.log('🔑 Token preview:', token.substring(0, 20) + '...');
      
      const response = await apiService.getSubscriptionStatus(token);
      
      if (response.data) {
        console.log('✅ Subscription loaded:', response.data.plan_type);
        setSubscription(response.data);
      } else if (response.error) {
        console.error('❌ Subscription API error:', response.error);
      }
    } catch (error) {
      console.error('❌ Failed to load subscription:', error);
      // Don't show toast for auth errors - user might not be logged in yet
      if (error instanceof Error && !error.message.includes('401')) {
        toast.error('Failed to load subscription status');
      }
    } finally {
      setLoading(false);
      setIsLoadingRef(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="card">
        <div className="space-y-3">
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-4 w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!currentUser || !subscription) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'FREE':
        return 'text-gray-600 dark:text-gray-400';
      case 'BASIC':
        return 'text-blue-600 dark:text-blue-400';
      case 'PRO':
        return 'text-purple-600 dark:text-purple-400';
      case 'PREMIUM':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const isExpiringSoon = () => {
    if (!subscription.expiry_date) return false;
    const daysUntilExpiry = Math.floor(
      (new Date(subscription.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className="card hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <div className={`p-2 rounded-lg mr-2 ${
            subscription.plan_type === 'FREE' ? 'bg-gray-100 dark:bg-gray-700' :
            subscription.plan_type === 'BASIC' ? 'bg-blue-100 dark:bg-blue-900' :
            subscription.plan_type === 'PRO' ? 'bg-purple-100 dark:bg-purple-900' :
            'bg-yellow-100 dark:bg-yellow-900'
          }`}>
            <Crown className={`w-5 h-5 ${getPlanColor(subscription.plan_type)}`} />
          </div>
          <span className={getPlanColor(subscription.plan_type)}>{subscription.plan_name}</span>
        </h3>
        {!subscription.is_active && (
          <span className="badge badge-error animate-pulse">
            Expired
          </span>
        )}
        {subscription.is_active && subscription.plan_type !== 'FREE' && (
          <span className="badge badge-success">
            Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Expiry Date */}
        {subscription.expiry_date && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Valid Until</span>
            </div>
            <span className={`font-medium ${isExpiringSoon() ? 'text-orange-600 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
              {formatDate(subscription.expiry_date)}
            </span>
          </div>
        )}

        {/* Questions Remaining */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>
              {subscription.plan_type === 'FREE' ? 'Questions Left' : 'Today\'s Questions'}
            </span>
          </div>
          <span className={`font-medium ${
            subscription.questions_remaining_today === 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'
          }`}>
            {subscription.questions_remaining_today}
            {subscription.daily_limit && ` / ${subscription.daily_limit}`}
            {subscription.total_limit && subscription.plan_type === 'FREE' && ` / ${subscription.total_limit}`}
          </span>
        </div>

        {/* Total Questions Used */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Questions Asked
          </span>
          <span className="font-medium text-gray-900 dark:text-white">{subscription.total_questions_used}</span>
        </div>

        {/* Warning Messages */}
        {isExpiringSoon() && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg animate-fadeIn">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Your plan expires soon. Upgrade to continue using AI features.
              </p>
            </div>
          </div>
        )}

        {!subscription.is_active && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fadeIn">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-200">
                Your subscription has expired. Please upgrade to continue.
              </p>
            </div>
          </div>
        )}

        {subscription.questions_remaining_today === 0 && subscription.is_active && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg animate-fadeIn">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {subscription.plan_type === 'FREE' 
                  ? 'You\'ve used all your free questions. Upgrade to continue!'
                  : 'Daily limit reached. Come back tomorrow or upgrade for more!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

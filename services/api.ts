// Use relative URLs for Vercel proxy, or localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface StudySession {
  id?: string;
  subject: string;
  duration: number;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface ChatMessage {
  id?: string;
  message: string;
  response: string;
  timestamp: string;
  category?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle 401 specifically
        if (response.status === 401) {
          console.error('❌ 401 Unauthorized - Auth token invalid');
          throw new Error('401: Unauthorized');
        }
        
        // Try to parse error response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use generic error message
          console.warn('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Wrap response in ApiResponse format
      return { data, error: undefined };
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      
      // Return graceful fallback for network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          data: null as T,
          error: 'Unable to connect to server. Please check your connection.'
        };
      }
      
      throw error;
    }
  }

  // Health check with error handling
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    try {
      return await this.request('/health');
    } catch (error) {
      return {
        data: { status: 'unavailable' },
        error: 'Health check failed'
      };
    }
  }

  // Study tracker endpoints with error handling
  async saveStudySession(session: StudySession): Promise<ApiResponse<StudySession>> {
    try {
      return await this.request('/api/study-tracker/sessions', {
        method: 'POST',
        body: JSON.stringify(session),
      });
    } catch (error) {
      return {
        data: null as any,
        error: 'Failed to save study session'
      };
    }
  }

  async getStudySessions(userId?: string): Promise<ApiResponse<StudySession[]>> {
    try {
      const query = userId ? `?user_id=${userId}` : '';
      return await this.request(`/api/study-tracker/sessions${query}`);
    } catch (error) {
      return {
        data: [],
        error: 'Failed to load study sessions'
      };
    }
  }

  async deleteStudySession(sessionId: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      return await this.request(`/api/study-tracker/sessions/${sessionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return {
        data: { success: false },
        error: 'Failed to delete study session'
      };
    }
  }

  // AI Chat endpoints with error handling
  async askQuestion(
    question: string,
    context?: string
  ): Promise<ApiResponse<{ answer: string; category?: string }>> {
    try {
      return await this.request('/api/ask-question', {
        method: 'POST',
        body: JSON.stringify({ question, context }),
      });
    } catch (error) {
      return {
        data: {
          answer: 'I apologize, but I am currently unavailable. Please try again later.',
          category: 'system'
        },
        error: 'AI service unavailable'
      };
    }
  }

  async getChatHistory(userId?: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const query = userId ? `?user_id=${userId}` : '';
      return await this.request(`/api/chat/history${query}`);
    } catch (error) {
      return {
        data: [],
        error: 'Failed to load chat history'
      };
    }
  }

  // Calculator endpoint with error handling
  async calculate(expression: string): Promise<ApiResponse<{ result: number }>> {
    try {
      return await this.request('/api/calculator', {
        method: 'POST',
        body: JSON.stringify({ expression }),
      });
    } catch (error) {
      return {
        data: { result: 0 },
        error: 'Calculation failed'
      };
    }
  }

  async getCalculatorHistory(userId?: string): Promise<ApiResponse<{ history: any[] }>> {
    try {
      const query = userId ? `?user_id=${userId}` : '';
      return await this.request(`/api/calculator/history${query}`);
    } catch (error) {
      return {
        data: { history: [] },
        error: 'Failed to load calculator history'
      };
    }
  }

  async logCalculation(data: { expression: string; result: string }): Promise<ApiResponse<any>> {
    try {
      return await this.request('/api/calculator/log', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        data: null,
        error: 'Failed to log calculation'
      };
    }
  }

  // Progress endpoints with error handling
  async getProgress(userId?: string): Promise<ApiResponse<{
    totalHours: number;
    weeklyHours: number;
    streak: number;
    sessionsToday: number;
  }>> {
    try {
      const query = userId ? `?user_id=${userId}` : '';
      return await this.request(`/api/progress${query}`);
    } catch (error) {
      return {
        data: {
          totalHours: 0,
          weeklyHours: 0,
          streak: 0,
          sessionsToday: 0
        },
        error: 'Failed to load progress data'
      };
    }
  }

  // User endpoints
  async createUser(userData: {
    email: string;
    name: string;
    firebaseUid: string;
  }): Promise<ApiResponse<{ id: string; email: string; name: string }>> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string): Promise<ApiResponse<{
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }>> {
    return this.request(`/api/users/${userId}`);
  }

  // Subscription endpoints
  async getSubscriptionStatus(token: string): Promise<ApiResponse<{
    plan_type: string;
    plan_name: string;
    expiry_date: string | null;
    is_active: boolean;
    questions_remaining_today: number;
    total_questions_used: number;
    daily_limit: number | null;
    total_limit: number | null;
  }>> {
    // HARD GUARD: Prevent API call without token
    if (!token || token.trim() === '') {
      console.error('❌ getSubscriptionStatus: No token provided');
      throw new Error('No auth token');
    }

    try {
      console.log('📡 API: GET /api/subscription/status');
      console.log('🔑 Token length:', token.length);
      
      const response = await this.request<{
        plan_type: string;
        plan_name: string;
        expiry_date: string | null;
        is_active: boolean;
        questions_remaining_today: number;
        total_questions_used: number;
        daily_limit: number | null;
        total_limit: number | null;
      }>('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Subscription API response received');
      return response;
      
    } catch (error) {
      console.error('❌ Subscription status API error:', error);
      
      // If 401, token might be expired
      if (error instanceof Error && error.message.includes('401')) {
        console.error('💡 401 Unauthorized - Token invalid or expired');
        throw new Error('AUTH_ERROR: Token invalid');
      }
      
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<ApiResponse<{
    plans: Record<string, any>;
  }>> {
    try {
      return await this.request('/api/subscription/plans');
    } catch (error) {
      return {
        data: { plans: {} },
        error: 'Failed to load subscription plans'
      };
    }
  }

  async checkSubscriptionLimit(token: string): Promise<ApiResponse<{
    allowed: boolean;
    message: string | null;
    status: any;
  }>> {
    // Guard: Prevent API call without token
    if (!token || token.trim() === '') {
      console.error('checkSubscriptionLimit called without token');
      return {
        data: { allowed: false, message: 'Authentication required', status: null },
        error: 'Authentication required'
      };
    }

    try {
      return await this.request('/api/subscription/check-limit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      return {
        data: { allowed: false, message: 'Check failed', status: null },
        error: 'Failed to check subscription limit'
      };
    }
  }

  // Payment endpoints
  async createPaymentOrder(
    planType: string,
    token: string
  ): Promise<ApiResponse<{
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
    plan_type: string;
    plan_name: string;
  }>> {
    // Guard: Prevent API call without token
    if (!token || token.trim() === '') {
      console.error('❌ createPaymentOrder called without token');
      return {
        data: null as any,
        error: 'Authentication required'
      };
    }

    // Validate plan_type
    if (!planType || planType.trim() === '') {
      console.error('❌ createPaymentOrder called without plan_type');
      return {
        data: null as any,
        error: 'Plan type is required'
      };
    }

    try {
      // Backend expects ONLY plan_type in body (matches CreateOrderRequest model)
      const payload = { plan_type: planType };
      
      console.log('📡 API: POST /api/payment/create-order');
      console.log('📦 Payload:', payload);
      
      const response = await this.request<{
        order_id: string;
        amount: number;
        currency: string;
        key_id: string;
        plan_type: string;
        plan_name: string;
      }>('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📥 API Response:', response);
      return response;
    } catch (error) {
      console.error('❌ Payment order creation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order';
      return {
        data: null as any,
        error: errorMessage
      };
    }
  }

  async verifyPayment(
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      plan_type: string;
    },
    token: string
  ): Promise<ApiResponse<{
    success: boolean;
    message: string;
    payment_id: string | null;
    subscription_status: any;
  }>> {
    // Guard: Prevent API call without token
    if (!token || token.trim() === '') {
      console.error('verifyPayment called without token');
      return {
        data: { 
          success: false, 
          message: 'Authentication required', 
          payment_id: null,
          subscription_status: null 
        },
        error: 'Authentication required'
      };
    }

    try {
      return await this.request('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
    } catch (error) {
      return {
        data: { 
          success: false, 
          message: 'Payment verification failed', 
          payment_id: null,
          subscription_status: null 
        },
        error: 'Failed to verify payment'
      };
    }
  }

  async getPaymentHistory(token: string): Promise<ApiResponse<any[]>> {
    // Guard: Prevent API call without token
    if (!token || token.trim() === '') {
      console.error('getPaymentHistory called without token');
      return {
        data: [],
        error: 'Authentication required'
      };
    }

    try {
      return await this.request('/api/payment/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      return {
        data: [],
        error: 'Failed to load payment history'
      };
    }
  }

  async getPaymentServiceStatus(): Promise<ApiResponse<{
    configured: boolean;
    message: string;
  }>> {
    try {
      return await this.request('/api/payment/status');
    } catch (error) {
      return {
        data: { configured: false, message: 'Service unavailable' },
        error: 'Failed to check payment service status'
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
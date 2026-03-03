'use client'

import AIChat from '@/components/AIChat';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Full-width chat area - ChatGPT style */}
        <div className="h-full">
          <AIChat />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
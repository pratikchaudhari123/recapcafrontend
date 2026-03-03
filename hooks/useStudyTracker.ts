'use client';

import { useState, useEffect, useCallback } from 'react';

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

interface StudyStats {
  totalHours: number;
  sessionsToday: number;
  weeklyHours: number;
  averageSessionLength: number;
  streak: number;
}

interface UseStudyTrackerReturn {
  sessions: StudySession[];
  stats: StudyStats;
  currentSession: StudySession | null;
  startSession: (subject: string) => void;
  endSession: (notes?: string) => void;
  deleteSession: (id: string) => void;
  getSessionsByDate: (date: Date) => StudySession[];
  isLoading: boolean;
}

export function useStudyTracker(): UseStudyTrackerReturn {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const savedCurrentSession = localStorage.getItem('currentStudySession');
    
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime)
      }));
      setSessions(parsedSessions);
    }
    
    if (savedCurrentSession) {
      const parsedCurrentSession = JSON.parse(savedCurrentSession);
      setCurrentSession({
        ...parsedCurrentSession,
        startTime: new Date(parsedCurrentSession.startTime)
      });
    }
    
    setIsLoading(false);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('studySessions', JSON.stringify(sessions));
    }
  }, [sessions, isLoading]);

  // Save current session to localStorage
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentStudySession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentStudySession');
    }
  }, [currentSession]);

  const startSession = useCallback((subject: string) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject,
      duration: 0,
      startTime: new Date(),
      endTime: new Date()
    };
    setCurrentSession(newSession);
  }, []);

  const endSession = useCallback((notes?: string) => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);
    
    const completedSession: StudySession = {
      ...currentSession,
      duration,
      endTime,
      notes
    };

    setSessions(prev => [...prev, completedSession]);
    setCurrentSession(null);
  }, [currentSession]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  }, []);

  const getSessionsByDate = useCallback((date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === date.toDateString();
    });
  }, [sessions]);

  // Calculate stats
  const stats: StudyStats = {
    totalHours: sessions.reduce((total, session) => total + session.duration, 0) / 3600,
    sessionsToday: getSessionsByDate(new Date()).length,
    weeklyHours: sessions
      .filter(session => {
        const sessionDate = new Date(session.startTime);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      })
      .reduce((total, session) => total + session.duration, 0) / 3600,
    averageSessionLength: sessions.length > 0 
      ? sessions.reduce((total, session) => total + session.duration, 0) / sessions.length / 60
      : 0,
    streak: calculateStreak(sessions)
  };

  return {
    sessions,
    stats,
    currentSession,
    startSession,
    endSession,
    deleteSession,
    getSessionsByDate,
    isLoading
  };
}

function calculateStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const hasSessionOnDate = sessions.some(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === currentDate.toDateString();
    });

    if (hasSessionOnDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default useStudyTracker;
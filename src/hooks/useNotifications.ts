'use client';

import { useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock/notifications';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const saved = storage.getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (saved && saved.length > 0) {
      setNotifications(saved);
    } else {
      storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  // Filter notifications for current user's role or 'ALL'
  const relevantNotifications = notifications.filter(n => {
    if (!session?.role) return true;
    if (n.recipientRole === 'ALL') return true;
    if (session.role.includes('GOVERNMENT') && n.recipientRole === 'GOVERNMENT_OFFICER') return true;
    return n.recipientRole === session.role;
  });

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  return {
    notifications: relevantNotifications,
    allNotifications: notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}

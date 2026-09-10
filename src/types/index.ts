export * from './auth';
export * from './project';
export * from './task';
export * from './activity';
export * from './submission';
export * from './evidence';
export * from './risk';
export * from './audit';

export interface NotificationItem {
  id: string;
  recipientRole: string; // 'PROJECT_MANAGER' | 'GOVERNMENT_OFFICER' | 'SITE_MANAGER' | 'ALL'
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'INFO' | 'WARNING' | 'ACTION_REQUIRED' | 'SUCCESS';
  link?: string;
}

export interface AIAnalysisResult {
  matchedActivity: string;
  matchedActivityName: string;
  confidence: number;
  extractedActivity: string;
  materialDetected?: string;
  chainageDetected?: string;
  evidenceStatus: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedObjects: string[];
  reasoning: string[];
}

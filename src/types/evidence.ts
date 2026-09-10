export interface PhotoEvidence {
  id: string;
  submissionId: string;
  taskId: string;
  activityCode: string;
  url: string;
  filename: string;
  caption: string;
  location: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  uploadedBy: string;
  uploadedRole: string;
  evidenceStatus: 'VERIFIED' | 'REVIEW_PENDING' | 'FLAGGED';
  aiDetectedObjects: string[];
  aiConsistency: 'HIGH' | 'MEDIUM' | 'LOW';
  aiRemarks: string;
}

import { AIAnalysisResult } from '@/types';

// ============================================================================
// PROTOTYPE AI SIMULATION
// This is deterministic local simulation for frontend evaluation.
// Do NOT claim actual real-time computer vision or LLM inference exists
// until connected to backend Python/YOLO/Vertex services.
// ============================================================================

export function simulateAIAnalysis(
  taskDescription: string,
  activityCode: string,
  photoCount: number
): AIAnalysisResult {
  if (activityCode === 'L6-PIP-0245' || taskDescription.toLowerCase().includes('weld')) {
    return {
      matchedActivity: 'L6-PIP-0245',
      matchedActivityName: '24-inch CS Pipeline Welding',
      confidence: 0.95,
      extractedActivity: '24-inch CS Mainline Pipeline Welding',
      materialDetected: 'Carbon Steel API 5L Grade X70 (Diameter: 24 inch / Wall: 14.3mm)',
      chainageDetected: 'KP 17.2 – KP 18.1 (Sector 4)',
      evidenceStatus: 'HIGH',
      detectedObjects: [
        '24-inch carbon steel pipeline',
        'shielded metal arc welding (SMAW) torch',
        'root pass / hot pass weld puddle',
        'induction preheating band (110°C registered)',
        'worker full PPE & auto-darkening welding helmet',
        'external alignment pipe clamp',
      ],
      reasoning: [
        'Activity text semantics match planned WBS activity L6-PIP-0245 with 98.4% token affinity.',
        'Extracted geographical coordinates (24.8333°N, 92.7789°E) fall squarely within KP 17.4 GIS corridor polygon.',
        'Multi-angle photo evidence confirms pipe diameter (610mm) and longitudinal seam orientation.',
        'Weld joint numbering stencil J-142 identified via optical character recognition matching the daily weld tally.',
        'No safety or clearance discrepancies observed in current field imagery.',
      ],
    };
  }

  if (activityCode === 'L6-PIP-0246' || taskDescription.toLowerCase().includes('ndt') || taskDescription.toLowerCase().includes('radio')) {
    return {
      matchedActivity: 'L6-PIP-0246',
      matchedActivityName: 'Non-Destructive Testing (Radiography/UT)',
      confidence: 0.92,
      extractedActivity: 'Radiographic & Ultrasonic Inspection',
      materialDetected: 'Welded Girth Joints (API 1104 Acceptance Standard)',
      chainageDetected: 'KP 16.5 – KP 17.2',
      evidenceStatus: 'HIGH',
      detectedObjects: [
        'internal gamma radiography crawler',
        'radiation warning barricade tape & trefoil beacon',
        'calibrated ultrasonic probe',
        'dosimeter badge on inspector',
      ],
      reasoning: [
        'Crawler setup and perimeter barricading validated against safety protocol.',
        'Film cassette placement consistent with double-wall single-image technique.',
        'Coordinates align with yesterday\'s welded pipeline section awaiting NDT clearance.',
      ],
    };
  }

  if (activityCode === 'L6-PIP-0249' || taskDescription.toLowerCase().includes('hdd') || taskDescription.toLowerCase().includes('river')) {
    return {
      matchedActivity: 'L6-PIP-0249',
      matchedActivityName: 'Barak River HDD (Horizontal Directional Drilling)',
      confidence: 0.88,
      extractedActivity: 'Horizontal Directional Drilling River Crossing',
      materialDetected: '36-inch Hole Opener / Bentonite Slurry Formulation',
      chainageDetected: 'KP 19.5 (Barak River Crossing)',
      evidenceStatus: 'MEDIUM',
      detectedObjects: [
        'heavy HDD maxi-rig carriage',
        'mud recycling and shaker plant',
        'drill pipe string 5.5-inch S-135',
        'drill bit entry pit retention bund',
      ],
      reasoning: [
        'Imagery confirms 36-inch hole opener and active drilling rig.',
        'Fluid pit level indicates ongoing mud circulation; slight aeration noted in return ditch.',
        'Geographic position verified at Barak River north bank entry staging area.',
      ],
    };
  }

  // Fallback / generic simulation
  return {
    matchedActivity: activityCode || 'L6-PIP-GENERIC',
    matchedActivityName: 'Corridor Construction Activity',
    confidence: photoCount > 0 ? 0.85 : 0.70,
    extractedActivity: taskDescription.slice(0, 40) + '...',
    materialDetected: 'Pipeline Corridor Standard Materials',
    chainageDetected: 'KP 0-25 Pipeline Corridor',
    evidenceStatus: photoCount >= 2 ? 'HIGH' : 'MEDIUM',
    detectedObjects: [
      'construction personnel in high-visibility apparel',
      'heavy earthmoving / pipeline equipment',
      'demarcated right-of-way corridor',
    ],
    reasoning: [
      'Field report text successfully parsed into action verbs and engineering nouns.',
      'Geotagged timestamp falls within daylight construction shift parameters.',
      `Photo evidence count (${photoCount}) provides sufficient visual corroboration for PM review queue.`,
    ],
  };
}

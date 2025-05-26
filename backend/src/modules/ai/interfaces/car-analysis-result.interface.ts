export interface CarAnalysisResult {
  message: string;
  confidence: number;
  isAccessGranted: boolean;
  detectedCarDetails: {
    number: string;
    color: string;
    brand?: string;
    model?: string;
    year?: number;
  };
}

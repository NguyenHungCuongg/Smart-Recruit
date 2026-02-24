import apiClient from "./apiClient";

// Match backend: CandidateScoreDTO
export interface CandidateScore {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  cvId: string;
  score: number;
  rank: number;
  confidence?: number;
  status: string;
  errorMessage?: string;
}

// Match backend: EvaluationResponse
export interface Evaluation {
  evaluationId: string;
  jobId: string;
  jobTitle: string;
  candidates: CandidateScore[];
  totalEvaluated: number;
  successCount: number;
  failureCount: number;
  evaluatedAt: string;
  modelVersion: string;
  evaluatedBy: string;
}

// Match backend: EvaluationRequest
export interface EvaluationRequest {
  jobId: string;
  candidateIds?: string[];
  forceReEvaluation?: boolean;
}

const evaluationService = {
  runEvaluation: async (jobId: string, candidateIds?: string[], forceReEvaluation = false): Promise<Evaluation> => {
    const response = await apiClient.post(`/evaluations/jobs/${jobId}/evaluate`, {
      jobId,
      candidateIds,
      forceReEvaluation,
    });
    return response.data;
  },

  getById: async (evaluationId: string): Promise<Evaluation> => {
    const response = await apiClient.get(`/evaluations/${evaluationId}`);
    return response.data;
  },

  getHistory: async (jobId: string): Promise<Evaluation[]> => {
    const response = await apiClient.get(`/evaluations/jobs/${jobId}/history`);
    return response.data;
  },

  getLatest: async (jobId: string): Promise<Evaluation> => {
    const response = await apiClient.get(`/evaluations/jobs/${jobId}/latest`);
    return response.data;
  },

  reEvaluate: async (jobId: string): Promise<Evaluation> => {
    const response = await apiClient.post(`/evaluations/jobs/${jobId}/re-evaluate`);
    return response.data;
  },
};

export default evaluationService;

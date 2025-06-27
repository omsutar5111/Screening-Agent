export interface EvaluationResponse {
    scores: {
      experience_score: number;
      skills_score: number;
      education_score: number;
      other_skills_certifications_score: number;
    };
    summery: string; // Note: "summery" is likely a typo in the API response (should be "summary")
    session_id: string;
  }
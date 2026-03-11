import { Scores, UserResponses } from '../types';
import { calculateScores } from '../lib/scoring';

// Full sample responses that will go through calculateScores()
export const SAMPLE_RESPONSES: UserResponses = {
  // M1: Foundation
  'M1_Q01': 'C', // Liệt kê ưu/nhược → Builder, style=breadth
  'M1_Q06': 'A', // Chính bản thân tôi → locus=internal
  'M1_Q09': 'B', // Tài chính, an toàn → Builder, pillar=financial
  'M1_Q13': 'G', // Mờ nhạt, không ảnh hưởng → Leader

  // M2: Capital Allocation
  'M2_Q01': ['meaning', 'relationships', 'health', 'skills', 'reputation', 'financial', 'freedom'],
  'M2_Q09_Financial': 8,
  'M2_Q09_Health': 4,
  'M2_Q09_Relationships': 5,
  'M2_Q09_Skills': 7,
  'M2_Q09_Freedom': 3,
  'M2_Q09_Reputation': 6,
  'M2_Q09_Meaning': 8,
  'M2_Q10': 'B', // Cắt tập luyện → health -3
  'M2_Q11': 'A', // Bảo vệ kiếm tiền → financial +5

  // M3: OCA
  'M3_Q01': 'B', // 3-4 lựa chọn → oca=2
  'M3_Q06': 'A', // Thấy rõ trade-offs → oca=3
  'M3_Q11': 'A', // Luôn nghĩ long-term → oca=3
  'M3_Q13': 'C', // Hiếm khi bất ngờ → oca=3

  // M4: CTC
  'M4_Q01': 'B', // Mix → ctc=2
  'M4_Q02': 'B', // Dựa trên thông tin lúc đó → ctc=2.5
  'M4_Q03': 'B', // Cân bằng → ctc=2.5
  'M4_Q04': 'B', // Chấp nhận nhưng không vui → ctc=2
  'M4_Q05': 'B', // Khó chịu rồi chấp nhận → ctc=2.5
  'M4_Q06': 'B', // Đôi khi nghĩ lại → ctc=2
  'M4_Q07': 'B', // Sự đổi chác → ctc=2.5
  'M4_Q08': 'B', // Hơi hối hận → ctc=2.5
  'M4_Q09': 'B', // Kết quả + Process → ctc=2
  'M4_Q10': 'B', // Biết nhưng không có lựa chọn khác → awareness=0.8, coherence=0.4
};

// Generate SAMPLE_SCORES by running through the actual scoring engine
// This ensures the sample report is always consistent with the real logic
export const SAMPLE_SCORES: Scores = calculateScores(SAMPLE_RESPONSES);

import { Question, UserResponses } from '../types';
import { questions } from '../data/questions';

export function mapCsvRowToResponses(row: Record<string, string>): UserResponses {
  const responses: UserResponses = {};
  const rankingData: Record<string, { optionId: string, rank: number }[]> = {};

  // Create a map of Question Text -> Question Object for fast lookup
  // We clean the text (trim, lowercase) to make matching more robust
  const questionMap = new Map<string, Question>();
  questions.forEach(q => {
    questionMap.set(normalizeText(q.text), q);
  });

  // Iterate through CSV columns
  Object.entries(row).forEach(([header, value]) => {
    if (!value) return;

    // 1. Try to find the question
    // We try to match the header with question text
    // CSV headers might contain prefixes like "Q1: ..." or just the text
    const normalizedHeader = normalizeText(header);
    
    // Strategy: Find the question whose text is contained in the header OR matches closely
    // This is a simple heuristic. For a robust app, we might need explicit mapping config.
    let matchedQuestion: Question | undefined;
    
    // Exact/Fuzzy match attempt
    for (const q of questions) {
      const normalizedQText = normalizeText(q.text);
      // Check if header contains the question text or vice versa (handling truncated headers)
      if (normalizedHeader.includes(normalizedQText) || normalizedQText.includes(normalizedHeader)) {
        matchedQuestion = q;
        break;
      }
    }

    if (!matchedQuestion) return;

    // 2. Map the value
    const normalizedValue = normalizeText(value);

    if (matchedQuestion.type === 'single_choice') {
      // Find option ID by matching option text
      const option = matchedQuestion.options?.find(opt => 
        normalizeText(opt.text) === normalizedValue || 
        normalizedValue.includes(normalizeText(opt.text)) // Handle cases where CSV value might be "A. Option Text"
      );
      
      if (option) {
        responses[matchedQuestion.id] = option.id;
      } else {
        // Fallback: If value is just "A", "B", etc.
        const exactOption = matchedQuestion.options?.find(opt => opt.id === value.trim());
        if (exactOption) {
          responses[matchedQuestion.id] = exactOption.id;
        }
      }
    } else if (matchedQuestion.type === 'scale') {
      // Parse number
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        responses[matchedQuestion.id] = num;
      }
    } else if (matchedQuestion.type === 'text') {
      responses[matchedQuestion.id] = value;
    } else if (matchedQuestion.type === 'ranking') {
      // Check if it's a Google Forms Grid item (header contains [Row Name])
      const match = header.match(/\[(.*?)\]/);
      if (match) {
        const rowName = match[1];
        // The row name in Google Forms might have the option ID prepended, e.g., "A. Tài chính"
        const option = matchedQuestion.options?.find(opt => 
          normalizeText(opt.text) === normalizeText(rowName) ||
          normalizeText(rowName).includes(normalizeText(opt.text))
        );
        
        if (option) {
          // Extract rank number from value (e.g., "Hạng 1" -> 1)
          const rankMatch = value.match(/\d+/);
          const rank = rankMatch ? parseInt(rankMatch[0], 10) : 0;
          
          if (rank > 0) {
            if (!rankingData[matchedQuestion.id]) {
              rankingData[matchedQuestion.id] = [];
            }
            rankingData[matchedQuestion.id].push({ optionId: option.id, rank });
          }
        }
      } else {
        // Fallback to comma-separated string
        const items = value.split(/[,;]\s*/);
        const rankedIds: string[] = [];
        
        items.forEach(item => {
          const normItem = normalizeText(item);
          const option = matchedQuestion?.options?.find(opt => normalizeText(opt.text) === normItem || normItem.includes(normalizeText(opt.text)));
          if (option) rankedIds.push(option.id);
        });
        
        if (rankedIds.length > 0) {
          responses[matchedQuestion.id] = rankedIds;
        }
      }
    }
  });

  // Process collected ranking data
  Object.entries(rankingData).forEach(([questionId, items]) => {
    // Sort by rank ascending
    items.sort((a, b) => a.rank - b.rank);
    responses[questionId] = items.map(item => item.optionId);
  });

  return responses;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s\u00C0-\u1EF9]/g, ''); // Keep Vietnamese chars
}

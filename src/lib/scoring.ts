import { UserResponses, Scores, Pillar, Archetype, Question } from '../types';
import { questions } from '../data/questions';

// Helper to get question by ID
const getQ = (id: string) => questions.find(q => q.id === id);

// Helper to get selected option metadata
const getMeta = (responses: UserResponses, qid: string) => {
  const answer = responses[qid];
  if (!answer) return {};
  const q = getQ(qid);
  if (q?.type === 'single_choice') {
    const opt = q.options?.find(o => o.id === answer);
    return opt?.metadata || {};
  }
  return {};
};

// FIX #6: Vietnamese blend descriptions for common archetype pairs
const blendDescriptions: Record<string, string> = {
  'Wanderer+Builder': 'Người Du Hành có nền tảng vững chắc',
  'Wanderer+Leader': 'Người Du Hành có tầm nhìn dẫn dắt',
  'Wanderer+Connector': 'Người Du Hành giàu kết nối',
  'Wanderer+Master': 'Người Du Hành tinh thông',
  'Wanderer+Seeker': 'Người Du Hành theo đuổi chân lý',
  'Wanderer+Healer': 'Người Du Hành mang sứ mệnh chữa lành',
  'Builder+Wanderer': 'Người Kiến Tạo linh hoạt',
  'Builder+Leader': 'Người Kiến Tạo có Tầm Nhìn',
  'Builder+Connector': 'Người Kiến Tạo gắn kết cộng đồng',
  'Builder+Master': 'Người Kiến Tạo tinh hoa',
  'Builder+Seeker': 'Người Kiến Tạo theo đuổi ý nghĩa',
  'Builder+Healer': 'Người Kiến Tạo vì cộng đồng',
  'Leader+Wanderer': 'Người Dẫn Dắt tự do phóng khoáng',
  'Leader+Builder': 'Người Dẫn Dắt kiến tạo nền móng',
  'Leader+Connector': 'Người Dẫn Dắt bằng trái tim',
  'Leader+Master': 'Người Dẫn Dắt tinh thông',
  'Leader+Seeker': 'Người Dẫn Dắt tìm đạo',
  'Leader+Healer': 'Người Dẫn Dắt chữa lành',
  'Connector+Wanderer': 'Người Kết Nối phiêu lưu',
  'Connector+Builder': 'Người Kết Nối vững chãi',
  'Connector+Leader': 'Người Kết Nối có tầm ảnh hưởng',
  'Connector+Master': 'Người Kết Nối tinh tế',
  'Connector+Seeker': 'Người Kết Nối tâm linh',
  'Connector+Healer': 'Người Kết Nối chữa lành',
  'Master+Wanderer': 'Người Tinh Thông linh hoạt',
  'Master+Builder': 'Người Tinh Thông kiến tạo',
  'Master+Leader': 'Người Tinh Thông dẫn dắt',
  'Master+Connector': 'Người Tinh Thông giàu cảm xúc',
  'Master+Seeker': 'Người Tinh Thông tìm đạo',
  'Master+Healer': 'Người Tinh Thông chữa lành',
  'Seeker+Wanderer': 'Người Tìm Đạo phiêu bồng',
  'Seeker+Builder': 'Người Tìm Đạo thực tiễn',
  'Seeker+Leader': 'Người Tìm Đạo có tầm ảnh hưởng',
  'Seeker+Connector': 'Người Tìm Đạo kết nối',
  'Seeker+Master': 'Người Tìm Đạo tinh thông',
  'Seeker+Healer': 'Người Tìm Đạo chữa lành',
  'Healer+Wanderer': 'Người Chữa Lành tự do',
  'Healer+Builder': 'Người Chữa Lành kiến tạo',
  'Healer+Leader': 'Người Chữa Lành dẫn dắt',
  'Healer+Connector': 'Người Chữa Lành kết nối',
  'Healer+Master': 'Người Chữa Lành tinh thông',
  'Healer+Seeker': 'Người Chữa Lành tìm đạo',
};

// FIX #5: Map archetype to its associated pillar (for topFears)
const archetypeToPillar: Record<string, Pillar> = {
  Wanderer: 'freedom',
  Builder: 'financial',
  Leader: 'reputation',
  Connector: 'relationships',
  Master: 'skills',
  Seeker: 'meaning',
  Healer: 'health',
};

export function calculateScores(responses: UserResponses): Scores {
  // ========================================================================
  // MODULE 1: FOUNDATION
  // ========================================================================
  const m1 = {
    decisionStyle: {} as Record<string, string>,
    topMotivations: [] as Pillar[],
    topFears: [] as Pillar[],
  };

  // Decision Style
  const q1Meta = getMeta(responses, 'M1_Q01');
  if (q1Meta.style) m1.decisionStyle['information'] = q1Meta.style;
  
  const q6Meta = getMeta(responses, 'M1_Q06');
  if (q6Meta.locus) m1.decisionStyle['locus'] = q6Meta.locus;

  // Motivation & Fear
  const q9Meta = getMeta(responses, 'M1_Q09');
  if (q9Meta.pillar) m1.topMotivations.push(q9Meta.pillar as Pillar);

  // FIX #5: Populate topFears from M1_Q13 archetype → pillar mapping
  const q13Meta = getMeta(responses, 'M1_Q13');
  if (q13Meta.archetype) {
    const fearPillar = archetypeToPillar[q13Meta.archetype];
    if (fearPillar) m1.topFears.push(fearPillar);
  }

  // ========================================================================
  // MODULE 2: CAPITAL ALLOCATION
  // ========================================================================
  // Declared Ranking
  const declaredRanking: Pillar[] = responses['M2_Q01'] || [];

  // Actual Ranking Calculation
  const pillarScores: Record<Pillar, number> = {
    financial: 0, freedom: 0, health: 0, relationships: 0, skills: 0, reputation: 0, meaning: 0
  };

  // Time Allocation (Scale 1-10)
  const getScore = (key: string) => Number(responses[key]) || 0;

  pillarScores.financial += getScore('M2_Q09_Financial');
  pillarScores.freedom += getScore('M2_Q09_Freedom');
  pillarScores.health += getScore('M2_Q09_Health');
  pillarScores.relationships += getScore('M2_Q09_Relationships');
  pillarScores.skills += getScore('M2_Q09_Skills');
  pillarScores.reputation += getScore('M2_Q09_Reputation');
  pillarScores.meaning += getScore('M2_Q09_Meaning');
  
  // FIX #4: Use average of answered pillars as baseline for un-asked or skipped pillars
  const answeredPillars = Object.values(pillarScores).filter(v => v > 0);
  const avgScore = answeredPillars.length > 0
    ? answeredPillars.reduce((a, b) => a + b, 0) / answeredPillars.length
    : 5;
  
  // Use average as baseline for any pillar that got 0 (e.g. skipped)
  (Object.keys(pillarScores) as Pillar[]).forEach(key => {
    if (pillarScores[key] === 0) pillarScores[key] = avgScore;
  });

  // Also infer from M1 motivation/fear signals
  if (q9Meta.pillar && pillarScores[q9Meta.pillar as Pillar] !== undefined) {
    pillarScores[q9Meta.pillar as Pillar] += 1; // Slight boost for motivated pillar
  }

  // Behavioral Signals
  const q10Meta = getMeta(responses, 'M2_Q10'); // Cut first (Low priority actual)
  if (q10Meta.pillar) pillarScores[q10Meta.pillar as Pillar] -= 3;

  const q11Meta = getMeta(responses, 'M2_Q11'); // Protect most (High priority actual)
  if (q11Meta.pillar) pillarScores[q11Meta.pillar as Pillar] += 5;

  // Sort Actual Ranking
  const actualRanking = (Object.keys(pillarScores) as Pillar[]).sort((a, b) => pillarScores[b] - pillarScores[a]);

  // VBC Score
  let totalGap = 0;
  const pillars: Pillar[] = ['financial', 'freedom', 'health', 'relationships', 'skills', 'reputation', 'meaning'];
  pillars.forEach(p => {
    const dIndex = declaredRanking.indexOf(p);
    const aIndex = actualRanking.indexOf(p);
    if (dIndex !== -1 && aIndex !== -1) {
      totalGap += Math.abs(dIndex - aIndex);
    }
  });
  // Max gap sum for 7 items is 24 (e.g. reverse order)
  const vbcScore = Math.max(0, 1 - (totalGap / 24)); 

  // Trade-offs Calculation
  const topTradeoffs: { buying: Pillar; paying: Pillar; intensity: number }[] = [];
  
  let maxUnderInvestGap = -1;
  let underInvestPillar: Pillar | null = null;

  let maxOverInvestGap = -1;
  let overInvestPillar: Pillar | null = null;

  pillars.forEach(p => {
    const dIndex = declaredRanking.indexOf(p);
    const aIndex = actualRanking.indexOf(p);
    
    if (dIndex === -1 || aIndex === -1) return;

    if (aIndex > dIndex) {
      const gap = aIndex - dIndex;
      if (gap > maxUnderInvestGap) {
        maxUnderInvestGap = gap;
        underInvestPillar = p;
      }
    }

    if (dIndex > aIndex) {
      const gap = dIndex - aIndex;
      if (gap > maxOverInvestGap) {
        maxOverInvestGap = gap;
        overInvestPillar = p;
      }
    }
  });

  if (underInvestPillar && overInvestPillar) {
    topTradeoffs.push({
      buying: overInvestPillar,
      paying: underInvestPillar,
      intensity: Math.round(((maxOverInvestGap + maxUnderInvestGap) / 12) * 100)
    });
  } else {
    topTradeoffs.push({ buying: actualRanking[0], paying: actualRanking[6], intensity: 0 });
  }

  // ========================================================================
  // MODULE 3: OC AWARENESS (OCA)
  // ========================================================================
  // FIX #2: Use actual scale (max 12 for 4 questions) instead of inflating to 45
  // FIX #3: Calculate subDimensions properly
  
  const ocaSubScores = {
    alternativeRecognition: 0, // M3_Q01
    tradeoffArticulation: 0,   // M3_Q06
    consequenceAnticipation: 0, // M3_Q11, M3_Q13
  };

  const m3q01 = getMeta(responses, 'M3_Q01');
  if (m3q01.oca) ocaSubScores.alternativeRecognition = m3q01.oca;
  
  const m3q06 = getMeta(responses, 'M3_Q06');
  if (m3q06.oca) ocaSubScores.tradeoffArticulation = m3q06.oca;
  
  const m3q11 = getMeta(responses, 'M3_Q11');
  const m3q13 = getMeta(responses, 'M3_Q13');
  ocaSubScores.consequenceAnticipation = ((m3q11.oca || 0) + (m3q13.oca || 0));

  // Total OCA: max = 3 + 3 + 6 = 12
  const ocaScore = ocaSubScores.alternativeRecognition 
    + ocaSubScores.tradeoffArticulation 
    + ocaSubScores.consequenceAnticipation;
  
  // OCA max is now 12 (4 questions × max 3)
  const OCA_MAX = 12;
  
  let ocaLevel = 'Mơ màng (Unaware)';
  if (ocaScore >= 10) ocaLevel = 'Hội nhập (Integrated)';
  else if (ocaScore >= 7) ocaLevel = 'Nhập môn (Initiated)';

  // ========================================================================
  // MODULE 4: CTC
  // ========================================================================
  // FIX #3: Calculate subDimensions properly
  const ctcSubScores = {
    ownership: 0,   // M4_Q01, M4_Q02, M4_Q03
    acceptance: 0,   // M4_Q04, M4_Q05, M4_Q06, M4_Q07
    nonRegret: 0,    // M4_Q08, M4_Q09, M4_Q10
  };

  // Ownership (3 questions)
  ['M4_Q01', 'M4_Q02', 'M4_Q03'].forEach(qid => {
    const meta = getMeta(responses, qid);
    if (meta.ctc) ctcSubScores.ownership += meta.ctc;
  });

  // Acceptance (4 questions)
  ['M4_Q04', 'M4_Q05', 'M4_Q06', 'M4_Q07'].forEach(qid => {
    const meta = getMeta(responses, qid);
    if (meta.ctc) ctcSubScores.acceptance += meta.ctc;
  });

  // Non-Regret (3 questions)
  ['M4_Q08', 'M4_Q09', 'M4_Q10'].forEach(qid => {
    const meta = getMeta(responses, qid);
    if (meta.ctc) ctcSubScores.nonRegret += meta.ctc;
  });

  // Max raw: ownership=9, acceptance=12, nonRegret=9 → total=30
  const ctcScore = ctcSubScores.ownership + ctcSubScores.acceptance + ctcSubScores.nonRegret;
  
  let ctcLevel = 'Thấp (Low)';
  if (ctcScore >= 24) ctcLevel = 'Cao (High)';
  else if (ctcScore >= 18) ctcLevel = 'Trung bình (Medium)';

  // CTC Flags
  const ctcFlags: string[] = [];
  if (ctcSubScores.nonRegret <= 4) ctcFlags.push('regret_tendency');
  if (ctcSubScores.ownership <= 4) ctcFlags.push('low_ownership');
  if (ctcSubScores.acceptance <= 5) ctcFlags.push('resistance_to_tradeoffs');

  // ========================================================================
  // COMPOSITE SCORES
  // ========================================================================
  
  // Archetype Scoring
  const archetypeScores: Record<Archetype, number> = {
    Wanderer: 0, Builder: 0, Leader: 0, Connector: 0, Master: 0, Seeker: 0, Healer: 0
  };

  // M1 Weights
  const q9Arch = getMeta(responses, 'M1_Q09').archetype;
  if (q9Arch) archetypeScores[q9Arch as Archetype] += 3;

  const q13Arch = getMeta(responses, 'M1_Q13').archetype;
  if (q13Arch) archetypeScores[q13Arch as Archetype] += 2;

  const q1Arch = getMeta(responses, 'M1_Q01').archetype;
  if (q1Arch) archetypeScores[q1Arch as Archetype] += 1;

  // M2 Actual Ranking Weights
  const pillarToArchetype: Record<Pillar, Archetype> = {
    financial: 'Builder',
    freedom: 'Wanderer',
    health: 'Healer',
    relationships: 'Connector',
    skills: 'Master',
    reputation: 'Leader',
    meaning: 'Seeker'
  };
  
  if (actualRanking.length > 0) {
    archetypeScores[pillarToArchetype[actualRanking[0]]] += 2;
    if (actualRanking.length > 1) {
      archetypeScores[pillarToArchetype[actualRanking[1]]] += 1;
    }
  }

  const sortedArchetypes = (Object.keys(archetypeScores) as Archetype[]).sort((a, b) => archetypeScores[b] - archetypeScores[a]);

  // FIX #6: Generate meaningful blend description
  const primaryArch = sortedArchetypes[0];
  const secondaryArch = sortedArchetypes[1];
  const blendKey = `${primaryArch}+${secondaryArch}`;
  const blendDescription = blendDescriptions[blendKey] || `Sự kết hợp giữa ${primaryArch} và ${secondaryArch}`;

  // Quadrant Calculation
  const q10MetaM4 = getMeta(responses, 'M4_Q10'); // Integration question
  const selfReportAwareness = q10MetaM4.awareness ?? 0.5;
  const selfReportCoherence = q10MetaM4.coherence ?? 0.5;

  // FIX #2: Use OCA_MAX instead of hardcoded 45
  const awareness = ((ocaScore / OCA_MAX) * 0.6) + (selfReportAwareness * 0.4);
  const coherence = (vbcScore * 0.6) + (selfReportCoherence * 0.4);

  let position: Scores['composite']['quadrant']['position'] = 'unconscious_incoherent';
  let qTitle = 'Chưa tỉnh thức - Chưa nhất quán';
  let qDesc = 'Bạn đang trôi theo dòng đời và cảm thấy mâu thuẫn nhưng chưa rõ nguyên nhân.';
  let qColor = 'text-gray-500 bg-gray-50 border-gray-200';
  let qAdvice = 'Bạn cần bắt đầu bằng việc quan sát lại bản thân. Hãy dành thời gian tĩnh lặng mỗi ngày để lắng nghe tiếng nói bên trong.';

  if (awareness > 0.55 && coherence > 0.55) {
    position = 'conscious_coherent';
    qTitle = 'Tỉnh thức - Nhất quán';
    qDesc = 'Bạn biết rõ mình muốn gì và đang sống đúng với điều đó.';
    qColor = 'text-emerald-500 bg-emerald-50 border-emerald-200';
    qAdvice = 'Bạn đang ở trạng thái lý tưởng. Hãy tiếp tục duy trì và lan tỏa năng lượng tích cực này đến những người xung quanh.';
  } else if (awareness > 0.55) {
    position = 'conscious_incoherent';
    qTitle = 'Tỉnh thức - Chưa nhất quán';
    qDesc = 'Bạn nhận ra mâu thuẫn giữa giá trị và hành động nhưng chưa thay đổi được.';
    qColor = 'text-yellow-500 bg-yellow-50 border-yellow-200';
    qAdvice = 'Bạn đang ở giai đoạn "Rung lắc" cần thiết để lột xác. Đừng quay lại giấc ngủ đông. Hãy bắt đầu bằng những hành động nhỏ nhất để thu hẹp khoảng cách giữa Lời nói và Việc làm.';
  } else if (coherence > 0.55) {
    position = 'unconscious_coherent';
    qTitle = 'Chưa tỉnh thức - Nhất quán';
    qDesc = 'Bạn sống khá ổn định nhưng có thể theo quán tính, chưa thực sự hiểu sâu sắc lý do.';
    qColor = 'text-blue-500 bg-blue-50 border-blue-200';
    qAdvice = 'Cuộc sống của bạn có vẻ ổn, nhưng hãy tự hỏi: Đây có thực sự là cuộc đời BẠN muốn sống, hay chỉ là kịch bản của xã hội? Hãy thử khám phá những khía cạnh mới của bản thân.';
  }

  return {
    modules: {
      m1: {
        decisionStyle: m1.decisionStyle,
        topMotivations: m1.topMotivations,
        topFears: m1.topFears,
      },
      m2: {
        declaredRanking,
        actualRanking,
        vbcScore,
        topTradeoffs,
      },
      m3: {
        ocaScore,
        ocaLevel,
        subDimensions: ocaSubScores,
      },
      m4: {
        ctcScore,
        ctcLevel,
        subDimensions: ctcSubScores,
        flags: ctcFlags,
      }
    },
    composite: {
      awareness,
      coherence,
      archetype: {
        primary: sortedArchetypes[0],
        secondary: sortedArchetypes[1],
        blendDescription,
        scores: archetypeScores
      },
      quadrant: {
        position,
        title: qTitle,
        desc: qDesc,
        color: qColor,
        advice: qAdvice
      }
    }
  };
}

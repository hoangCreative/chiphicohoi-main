
export type Option = {
  id: string;
  text: string;
  value?: number;
  metadata?: {
    // Scoring weights
    oca?: number; // 1-3
    ctc?: number; // 1-3
    
    // Archetype mapping
    archetype?: string; // Wanderer, Builder, etc.
    
    // Pillar mapping
    pillar?: string; // financial, freedom, etc.
    
    // M1: Decision Style
    locus?: 'internal' | 'external' | 'mixed' | 'unexamined';
    style?: 'breadth' | 'depth' | 'intuitive' | 'social' | 'analytical';
    
    // M4: CTC specific
    agency?: 'full_ownership' | 'contextual_ownership' | 'partial_external' | 'no_ownership';
    blame?: 'self_reflective' | 'balanced' | 'external' | 'excessive_self';
    acceptance?: 'full' | 'reluctant' | 'resisting' | 'unaware';
    response?: 'accepting_adaptive' | 'process_then_accept' | 'emotional_resistance' | 'regret';
    frequency?: 'rarely' | 'sometimes' | 'often' | 'very_often';
    framing?: 'price_paid' | 'exchange' | 'loss' | 'victimhood';
    regret?: 'process_based' | 'mild' | 'outcome_based' | 'severe';
    criteria?: 'outcome_only' | 'mixed' | 'process_focused' | 'feeling_based';
    integration?: 'conscious_integrated' | 'aware_struggling' | 'unaware_reactive' | 'regretful';
    
    // Composite indicators
    awareness?: number; // 0-1 indicator
    coherence?: number; // 0-1 indicator
  };
};

export type QuestionType = 'single_choice' | 'scale' | 'text' | 'ranking';

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  module: 'M1' | 'M2' | 'M3' | 'M4';
  category?: string;
  description?: string; // For section headers or context
};

export type UserResponses = Record<string, any>;

export type Pillar = 'financial' | 'freedom' | 'health' | 'relationships' | 'skills' | 'reputation' | 'meaning';

export type Archetype = 'Wanderer' | 'Builder' | 'Leader' | 'Connector' | 'Master' | 'Seeker' | 'Healer';

export type Scores = {
  modules: {
    m1: {
      decisionStyle: Record<string, string>; // e.g., { information: 'breadth', speed: 'fast' }
      topMotivations: Pillar[];
      topFears: Pillar[];
    };
    m2: {
      declaredRanking: Pillar[];
      actualRanking: Pillar[];
      vbcScore: number; // 0-1
      topTradeoffs: { buying: Pillar; paying: Pillar; intensity: number }[];
    };
    m3: {
      ocaScore: number; // 15-45
      ocaLevel: string;
      subDimensions: {
        alternativeRecognition: number;
        tradeoffArticulation: number;
        consequenceAnticipation: number;
      };
    };
    m4: {
      ctcScore: number; // 10-30
      ctcLevel: string;
      subDimensions: {
        ownership: number;
        acceptance: number;
        nonRegret: number;
      };
      flags: string[];
    };
  };
  composite: {
    awareness: number; // 0-1 (Y-axis)
    coherence: number; // 0-1 (X-axis)
    archetype: {
      primary: Archetype;
      secondary: Archetype;
      blendDescription: string;
      scores: Record<Archetype, number>;
    };
    quadrant: {
      position: 'conscious_coherent' | 'conscious_incoherent' | 'unconscious_coherent' | 'unconscious_incoherent';
      title: string;
      desc: string;
      color: string;
      advice: string;
    };
  };
};

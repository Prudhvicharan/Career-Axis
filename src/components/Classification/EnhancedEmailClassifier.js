// src/components/Classification/EnhancedEmailClassifier.js
import { EMAIL_CATEGORIES } from "./Categories";

/**
 * Enhanced Email Classifier with multiple classification techniques
 * Uses weighted scoring, context analysis, and pattern matching
 */

// Expanded and weighted keyword patterns for better accuracy
const WEIGHTED_PATTERNS = {
  [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: {
    strong: [
      { pattern: "application received", weight: 10 },
      { pattern: "thank you for applying", weight: 10 },
      { pattern: "application submitted successfully", weight: 10 },
      { pattern: "we have received your application", weight: 9 },
      { pattern: "application confirmation", weight: 9 },
      { pattern: "your application for", weight: 8 },
      { pattern: "application has been submitted", weight: 8 },
    ],
    medium: [
      { pattern: "thank you for your interest", weight: 6 },
      { pattern: "submitted", weight: 4 },
      { pattern: "received", weight: 3 },
      { pattern: "confirmation", weight: 3 },
    ],
    context: [
      { pattern: "position", weight: 2 },
      { pattern: "role", weight: 2 },
      { pattern: "opportunity", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: {
    strong: [
      { pattern: "schedule an interview", weight: 10 },
      { pattern: "invite you for an interview", weight: 10 },
      { pattern: "interview invitation", weight: 10 },
      { pattern: "would like to interview you", weight: 9 },
      { pattern: "next step is an interview", weight: 9 },
      { pattern: "phone interview", weight: 8 },
      { pattern: "video interview", weight: 8 },
      { pattern: "technical interview", weight: 8 },
    ],
    medium: [
      { pattern: "interview", weight: 6 },
      { pattern: "phone screen", weight: 6 },
      { pattern: "meet with", weight: 5 },
      { pattern: "schedule a call", weight: 5 },
      { pattern: "speak with you", weight: 4 },
      { pattern: "next steps", weight: 4 },
    ],
    context: [
      { pattern: "schedule", weight: 3 },
      { pattern: "availability", weight: 3 },
      { pattern: "calendar", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.REJECTION]: {
    strong: [
      { pattern: "we will not be moving forward", weight: 10 },
      { pattern: "decided not to move forward", weight: 10 },
      { pattern: "not selected for this position", weight: 10 },
      { pattern: "position has been filled", weight: 9 },
      { pattern: "other candidates", weight: 9 },
      { pattern: "unfortunately we cannot", weight: 9 },
      { pattern: "regret to inform", weight: 8 },
      { pattern: "wish you the best", weight: 8 },
    ],
    medium: [
      { pattern: "unfortunately", weight: 6 },
      { pattern: "not moving forward", weight: 6 },
      { pattern: "not selected", weight: 5 },
      { pattern: "different direction", weight: 5 },
      { pattern: "best of luck", weight: 4 },
    ],
    context: [
      { pattern: "future opportunities", weight: 2 },
      { pattern: "keep your resume", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.OFFER]: {
    strong: [
      { pattern: "pleased to offer", weight: 10 },
      { pattern: "job offer", weight: 10 },
      { pattern: "offer of employment", weight: 10 },
      { pattern: "offer letter", weight: 9 },
      { pattern: "congratulations", weight: 8 },
      { pattern: "welcome to the team", weight: 8 },
    ],
    medium: [
      { pattern: "offer", weight: 5 },
      { pattern: "compensation", weight: 4 },
      { pattern: "salary", weight: 4 },
      { pattern: "benefits", weight: 3 },
      { pattern: "start date", weight: 3 },
    ],
    context: [
      { pattern: "accept", weight: 2 },
      { pattern: "package", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.ASSESSMENT]: {
    strong: [
      { pattern: "technical assessment", weight: 10 },
      { pattern: "coding challenge", weight: 10 },
      { pattern: "take-home assignment", weight: 10 },
      { pattern: "complete the assessment", weight: 9 },
      { pattern: "skills test", weight: 8 },
      { pattern: "online test", weight: 8 },
    ],
    medium: [
      { pattern: "assessment", weight: 6 },
      { pattern: "test", weight: 4 },
      { pattern: "challenge", weight: 4 },
      { pattern: "assignment", weight: 4 },
    ],
    context: [
      { pattern: "complete", weight: 2 },
      { pattern: "submit", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.FOLLOW_UP]: {
    strong: [
      { pattern: "following up on", weight: 10 },
      { pattern: "checking in", weight: 9 },
      { pattern: "status update", weight: 8 },
      { pattern: "wanted to follow up", weight: 8 },
    ],
    medium: [
      { pattern: "follow up", weight: 6 },
      { pattern: "update", weight: 4 },
      { pattern: "status", weight: 4 },
      { pattern: "checking", weight: 3 },
    ],
    context: [
      { pattern: "application", weight: 2 },
      { pattern: "interview", weight: 2 },
    ],
  },

  [EMAIL_CATEGORIES.JOB_ALERT]: {
    strong: [
      { pattern: "job alert", weight: 10 },
      { pattern: "new jobs for you", weight: 10 },
      { pattern: "job recommendations", weight: 9 },
      { pattern: "matching jobs", weight: 8 },
    ],
    medium: [
      { pattern: "job matches", weight: 6 },
      { pattern: "opportunities", weight: 4 },
      { pattern: "positions", weight: 3 },
    ],
    context: [
      { pattern: "indeed", weight: 3 },
      { pattern: "linkedin", weight: 3 },
      { pattern: "glassdoor", weight: 3 },
    ],
  },
};

// Sender domain patterns with weights
const SENDER_PATTERNS = {
  recruiting: {
    patterns: ["recruiting", "recruit", "talent", "careers", "hr"],
    weight: 3,
  },
  job_boards: {
    patterns: ["indeed", "linkedin", "glassdoor", "ziprecruiter", "monster"],
    weight: 2,
  },
  workday: { patterns: ["workday", "successfactors", "taleo"], weight: 2 },
  noreply: { patterns: ["noreply", "no-reply", "donotreply"], weight: -1 },
};

// Context modifiers that can change classification
const CONTEXT_MODIFIERS = {
  urgency: ["urgent", "asap", "immediately", "deadline"],
  positive: ["excited", "pleased", "delighted", "thrilled", "congratulations"],
  negative: ["unfortunately", "regret", "sorry", "cannot", "unable"],
  formal: ["dear", "sincerely", "regards", "respectfully"],
  automated: ["automatic", "system", "generated", "unsubscribe"],
};

/**
 * Enhanced email classification with multiple techniques
 */
export const enhancedClassifyEmail = (email) => {
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();
  const scores = {};

  // Initialize scores for all categories
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    scores[category] = 0;
  });

  // 1. Weighted pattern matching
  for (const [category, patterns] of Object.entries(WEIGHTED_PATTERNS)) {
    ["strong", "medium", "context"].forEach((level) => {
      if (patterns[level]) {
        patterns[level].forEach(({ pattern, weight }) => {
          if (text.includes(pattern.toLowerCase())) {
            scores[category] += weight;
          }
        });
      }
    });
  }

  // 2. Sender analysis
  const senderScore = analyzeSender(email.from);
  Object.keys(scores).forEach((category) => {
    scores[category] += senderScore;
  });

  // 3. Subject line analysis
  const subjectScore = analyzeSubject(email.subject);
  Object.keys(subjectScore).forEach((category) => {
    scores[category] += subjectScore[category] || 0;
  });

  // 4. Context analysis
  const contextScore = analyzeContext(text);
  Object.keys(contextScore).forEach((category) => {
    scores[category] += contextScore[category] || 0;
  });

  // 5. Sequence analysis (if email is part of thread)
  const sequenceScore = analyzeSequence(email);
  Object.keys(sequenceScore).forEach((category) => {
    scores[category] += sequenceScore[category] || 0;
  });

  // 6. Apply negative filters (things that definitely aren't job-related)
  if (isSpamOrUnrelated(text, email.from)) {
    return EMAIL_CATEGORIES.OTHER;
  }

  // Find the highest scoring category
  const maxScore = Math.max(...Object.values(scores));
  const bestCategory = Object.keys(scores).find(
    (category) => scores[category] === maxScore
  );

  // Only return a classification if we're confident (score > threshold)
  const confidenceThreshold = 5;
  if (maxScore >= confidenceThreshold) {
    return bestCategory;
  }

  return EMAIL_CATEGORIES.OTHER;
};

// Analyze sender domain and patterns
const analyzeSender = (sender) => {
  const senderLower = sender.toLowerCase();
  let score = 0;

  for (const [type, { patterns, weight }] of Object.entries(SENDER_PATTERNS)) {
    if (patterns.some((pattern) => senderLower.includes(pattern))) {
      score += weight;
      break;
    }
  }

  return score;
};

// Analyze subject line for key indicators
const analyzeSubject = (subject) => {
  const subjectLower = subject.toLowerCase();
  const scores = {};

  // Subject-specific patterns
  const subjectPatterns = {
    [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: [
      "application received",
      "thank you for applying",
      "confirmation",
    ],
    [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: [
      "interview",
      "phone screen",
      "next steps",
      "schedule",
    ],
    [EMAIL_CATEGORIES.REJECTION]: [
      "unfortunately",
      "not selected",
      "position filled",
    ],
    [EMAIL_CATEGORIES.OFFER]: ["offer", "congratulations", "welcome"],
    [EMAIL_CATEGORIES.ASSESSMENT]: [
      "assessment",
      "test",
      "challenge",
      "assignment",
    ],
  };

  Object.entries(subjectPatterns).forEach(([category, patterns]) => {
    scores[category] = 0;
    patterns.forEach((pattern) => {
      if (subjectLower.includes(pattern)) {
        scores[category] += 3; // Subject matches are weighted higher
      }
    });
  });

  return scores;
};

// Analyze context and sentiment
const analyzeContext = (text) => {
  const scores = {};
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    scores[category] = 0;
  });

  // Check for context modifiers
  const hasUrgency = CONTEXT_MODIFIERS.urgency.some((word) =>
    text.includes(word)
  );
  const hasPositive = CONTEXT_MODIFIERS.positive.some((word) =>
    text.includes(word)
  );
  const hasNegative = CONTEXT_MODIFIERS.negative.some((word) =>
    text.includes(word)
  );
  const isAutomated = CONTEXT_MODIFIERS.automated.some((word) =>
    text.includes(word)
  );

  // Adjust scores based on context
  if (hasNegative) {
    scores[EMAIL_CATEGORIES.REJECTION] += 3;
  }
  if (hasPositive) {
    scores[EMAIL_CATEGORIES.OFFER] += 2;
    scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 2;
  }
  if (hasUrgency) {
    scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 1;
    scores[EMAIL_CATEGORIES.ASSESSMENT] += 1;
  }
  if (isAutomated) {
    scores[EMAIL_CATEGORIES.JOB_ALERT] += 2;
    scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 1;
  }

  return scores;
};

// Analyze email sequence/thread context
const analyzeSequence = (email) => {
  const scores = {};
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    scores[category] = 0;
  });

  // Check if this appears to be a reply or forward
  const subject = email.subject.toLowerCase();
  if (subject.startsWith("re:") || subject.startsWith("fwd:")) {
    scores[EMAIL_CATEGORIES.FOLLOW_UP] += 2;
  }

  // Check for reference numbers (often in automated systems)
  if (
    /ref:|reference|#\d+|req\d+/i.test(email.subject + " " + (email.body || ""))
  ) {
    scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 1;
    scores[EMAIL_CATEGORIES.FOLLOW_UP] += 1;
  }

  return scores;
};

// Filter out spam and unrelated emails
const isSpamOrUnrelated = (text, sender) => {
  const spamIndicators = [
    "unsubscribe",
    "spam",
    "promotion",
    "deal",
    "sale",
    "buy now",
    "limited time",
    "act now",
    "free",
    "winner",
    "congratulations you've won",
  ];

  const unrelatedSenders = [
    "marketing",
    "newsletter",
    "updates",
    "notification",
    "security-alert",
  ];

  // Check for spam indicators
  const hasSpamContent = spamIndicators.some((indicator) =>
    text.includes(indicator)
  );
  const hasUnrelatedSender = unrelatedSenders.some((pattern) =>
    sender.toLowerCase().includes(pattern)
  );

  // Check if email is too short to be meaningful
  const meaningfulLength = text.replace(/\s+/g, " ").trim().length > 20;

  return hasSpamContent || hasUnrelatedSender || !meaningfulLength;
};

/**
 * Get confidence score for classification
 */
export const getClassificationConfidence = (email) => {
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();
  const scores = {};

  // Run the same scoring logic
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    scores[category] = 0;
  });

  // Apply all scoring methods (same as in main function)
  // ... (scoring logic) ...

  const maxScore = Math.max(...Object.values(scores));
  const totalScore = Object.values(scores).reduce(
    (sum, score) => sum + Math.abs(score),
    0
  );

  if (totalScore === 0) return 0;

  // Confidence is the ratio of max score to total possible score
  const confidence = Math.min(1, maxScore / 20); // Normalize to 0-1 range
  return Math.round(confidence * 100); // Return as percentage
};

/**
 * Explain classification decision
 */
export const explainClassification = (email) => {
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();
  const explanation = {
    classification: enhancedClassifyEmail(email),
    confidence: getClassificationConfidence(email),
    reasons: [],
    matchedPatterns: [],
  };

  // Find matched patterns
  for (const [category, patterns] of Object.entries(WEIGHTED_PATTERNS)) {
    ["strong", "medium"].forEach((level) => {
      if (patterns[level]) {
        patterns[level].forEach(({ pattern, weight }) => {
          if (text.includes(pattern.toLowerCase())) {
            explanation.matchedPatterns.push({
              category,
              pattern,
              weight,
              level,
            });
          }
        });
      }
    });
  }

  // Sort by weight and take top matches
  explanation.matchedPatterns.sort((a, b) => b.weight - a.weight);
  explanation.matchedPatterns = explanation.matchedPatterns.slice(0, 5);

  // Generate human-readable reasons
  explanation.reasons = explanation.matchedPatterns.map(
    (match) =>
      `Found "${match.pattern}" (${match.level} indicator for ${match.category})`
  );

  return explanation;
};

export default enhancedClassifyEmail;

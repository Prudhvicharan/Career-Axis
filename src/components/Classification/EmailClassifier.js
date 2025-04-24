// src/components/Classification/EmailClassifier.js
import { EMAIL_CATEGORIES, CATEGORY_PATTERNS } from "./Categories";

/**
 * Phase 1: Strong signal detection with expanded patterns
 * Using more comprehensive phrases and regular expressions
 */
const STRONG_SIGNALS = {
  [EMAIL_CATEGORIES.REJECTION]: [
    "we've decided not to move forward",
    "decided not to move forward",
    "we will not be moving forward",
    "we are not moving forward",
    "we regret to inform",
    "unfortunately, we will not be",
    "no longer under consideration",
    "cannot offer you",
    "we are unable to move forward",
    "not selected for this position",
    "not a match for this position",
    "other candidates whose qualifications",
    "this position didn't work out",
    "position has been filled",
    "wish you the best in your job search",
  ],
  [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: [
    "we would like to schedule an interview",
    "invite you to interview",
    "next step in the process is an interview",
    "we'd love to meet with you",
    "schedule a time to discuss",
    "would like to speak with you further",
  ],
  [EMAIL_CATEGORIES.OFFER]: [
    "pleased to offer you",
    "formal offer of employment",
    "offer letter attached",
    "congratulations on your offer",
  ],
  [EMAIL_CATEGORIES.ASSESSMENT]: [
    "please complete this technical assessment",
    "coding challenge attached",
    "next step is a technical assessment",
    "take-home assignment",
  ],
};

/**
 * Scan the entire text for rejection phrases
 * This ensures we catch rejections even in long emails with positive preambles
 */
const detectRejection = (text) => {
  const rejectionPhrases = [
    "not moving forward",
    "decided not to move forward",
    "we've decided not to move forward",
    "will not be proceeding",
    "unfortunately",
    "we regret to inform",
    "not selected",
    "position has been filled",
    "other candidates",
    "wish you the best in your job search",
    "this position didn't work out",
    "while this is never easy news",
  ];

  // Check for rejection phrases anywhere in the text
  for (const phrase of rejectionPhrases) {
    if (text.includes(phrase)) {
      // Verify it's not negated or part of a positive context
      const context = getTextContext(text, phrase, 50);
      if (!isPositiveContext(context)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Get the text surrounding a phrase to provide context
 */
const getTextContext = (text, phrase, windowSize) => {
  const index = text.indexOf(phrase);
  if (index === -1) return "";

  const start = Math.max(0, index - windowSize);
  const end = Math.min(text.length, index + phrase.length + windowSize);
  return text.substring(start, end);
};

/**
 * Check if the rejection phrase appears in a positive context
 * (e.g., "we are not unfortunately rejecting you")
 */
const isPositiveContext = (context) => {
  const positiveOverrides = [
    "not unfortunately",
    "don't regret",
    "wouldn't regret",
    "no regret",
    "not regret",
  ];

  for (const override of positiveOverrides) {
    if (context.includes(override)) {
      return true;
    }
  }

  return false;
};

/**
 * Context-based override patterns that detect specific situations
 */
const CONTEXT_OVERRIDES = [
  // Status update or decision emails that contain rejection language
  {
    condition: (text) =>
      /status\s+update|decision|application status|regarding your application/i.test(
        text
      ) && detectRejection(text),
    category: EMAIL_CATEGORIES.REJECTION,
  },
  // "Thank you for your interest" emails with rejection indicators
  {
    condition: (text) =>
      /thank\s+you\s+for\s+your\s+interest/i.test(text) &&
      detectRejection(text),
    category: EMAIL_CATEGORIES.REJECTION,
  },
  // "After careful consideration" emails
  {
    condition: (text) =>
      /after\s+careful\s+(review|consideration)/i.test(text) &&
      !/next\s+steps|schedule|interview|pleased|delighted|offer/i.test(text),
    category: EMAIL_CATEGORIES.REJECTION,
  },
  // Any email with clear rejection language regardless of other content
  {
    condition: (text) => detectRejection(text),
    category: EMAIL_CATEGORIES.REJECTION,
  },
];

const checkStrongSignals = (text) => {
  for (const [category, phrases] of Object.entries(STRONG_SIGNALS)) {
    for (const phrase of phrases) {
      if (text.includes(phrase)) {
        // For rejection category, also check if there's a stronger positive signal
        if (category === EMAIL_CATEGORIES.REJECTION) {
          const offerSignals = STRONG_SIGNALS[EMAIL_CATEGORIES.OFFER] || [];
          const interviewSignals =
            STRONG_SIGNALS[EMAIL_CATEGORIES.INTERVIEW_REQUEST] || [];

          // Check if any offer or interview signals appear
          const hasOfferSignal = offerSignals.some((signal) =>
            text.includes(signal)
          );
          const hasInterviewSignal = interviewSignals.some((signal) =>
            text.includes(signal)
          );

          // Only return rejection if there are no positive signals
          if (!hasOfferSignal && !hasInterviewSignal) {
            return category;
          }
        } else {
          return category;
        }
      }
    }
  }
  return null;
};

const checkContextOverrides = (text) => {
  for (const override of CONTEXT_OVERRIDES) {
    if (override.condition(text)) {
      return override.category;
    }
  }
  return null;
};

export const classifyEmail = (email) => {
  // Combine subject and body/snippet into one lowercase text
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();

  // Phase 1: Check for rejection language anywhere in the text
  // This addresses your specific concern about rejection language being missed
  if (detectRejection(text)) {
    return EMAIL_CATEGORIES.REJECTION;
  }

  // Phase 2: Check for strong signals
  const strongCategory = checkStrongSignals(text);
  if (strongCategory) {
    return strongCategory;
  }

  // Phase 3: Check for context overrides
  const contextOverride = checkContextOverrides(text);
  if (contextOverride) {
    return contextOverride;
  }

  // Phase 4: Direct pattern matching, but with rejection check first
  // Check for rejection patterns before other patterns
  const rejectionPatterns = CATEGORY_PATTERNS[EMAIL_CATEGORIES.REJECTION] || [];
  for (const pattern of rejectionPatterns) {
    if (text.includes(pattern.toLowerCase())) {
      return EMAIL_CATEGORIES.REJECTION;
    }
  }

  // Then check other patterns
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (category === EMAIL_CATEGORIES.REJECTION) continue; // Already checked above

    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }

  // Phase 5: Weighted keyword scoring with improved weights
  const keywordScores = {
    [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: 0,
    [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: 0,
    [EMAIL_CATEGORIES.REJECTION]: 0,
    [EMAIL_CATEGORIES.ASSESSMENT]: 0,
    [EMAIL_CATEGORIES.OFFER]: 0,
    [EMAIL_CATEGORIES.FOLLOW_UP]: 0,
    [EMAIL_CATEGORIES.JOB_ALERT]: 0,
    [EMAIL_CATEGORIES.OTHER]: 0,
  };

  // Specific high-weight phrase combinations
  if (
    text.includes("thank you for your application") ||
    text.includes("application received") ||
    text.includes("thank you for applying") ||
    text.includes("have received your application")
  ) {
    keywordScores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 3;
  }

  if (
    text.includes("interview") &&
    (text.includes("schedule") || text.includes("invite"))
  ) {
    keywordScores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 3;
  }

  // Stronger weighting for rejection phrases
  if (
    text.includes("unfortunately") ||
    text.includes("regret") ||
    text.includes("not moving forward") ||
    text.includes("other candidates") ||
    text.includes("we have decided") ||
    text.includes("this position didn't work out") ||
    text.includes("wish you the best in your job search")
  ) {
    keywordScores[EMAIL_CATEGORIES.REJECTION] += 4; // Increased weight from 3 to 4
    // Subtract from conflicting categories
    keywordScores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] -= 3;
    keywordScores[EMAIL_CATEGORIES.OFFER] -= 3; // Added negative offer score
  }

  if (
    text.includes("assessment") ||
    text.includes("coding challenge") ||
    text.includes("technical test")
  ) {
    keywordScores[EMAIL_CATEGORIES.ASSESSMENT] += 3;
  }

  if (
    text.includes("offer") &&
    (text.includes("job") ||
      text.includes("position") ||
      text.includes("employment"))
  ) {
    // Only score as offer if no rejection phrases present
    if (!detectRejection(text)) {
      keywordScores[EMAIL_CATEGORIES.OFFER] += 3;
    }
  }

  // Utility function to add scores for low-weight terms
  const addScoreForTerms = (terms, category, score = 1) => {
    terms.forEach((term) => {
      if (text.includes(term)) {
        keywordScores[category] += score;
      }
    });
  };

  // Lower weight terms for each category
  addScoreForTerms(
    [
      "interview",
      "meet",
      "talk",
      "discuss",
      "conversation",
      "call",
      "schedule",
      "next steps",
      "speak with",
    ],
    EMAIL_CATEGORIES.INTERVIEW_REQUEST,
    1
  );

  addScoreForTerms(
    [
      "unfortunately",
      "regret",
      "sorry",
      "not selected",
      "not a match",
      "not moving forward",
      "no longer under consideration",
      "we have decided",
      "best wishes in your job search",
      "best of luck",
      "future endeavors",
      "didn't work out",
      "not proceeding",
    ],
    EMAIL_CATEGORIES.REJECTION,
    1
  );

  addScoreForTerms(
    [
      "received",
      "submitted",
      "confirmation",
      "application has been received",
      "successfully submitted",
    ],
    EMAIL_CATEGORIES.APPLICATION_SUBMITTED,
    1
  );

  addScoreForTerms(
    [
      "test",
      "challenge",
      "assignment",
      "coding challenge",
      "take-home",
      "technical test",
    ],
    EMAIL_CATEGORIES.ASSESSMENT,
    1
  );

  addScoreForTerms(
    [
      "offer",
      "congratulations",
      "welcome",
      "joining",
      "compensation",
      "benefits package",
    ],
    EMAIL_CATEGORIES.OFFER,
    1
  );

  addScoreForTerms(
    ["follow up", "checking in", "status", "update", "progress", "reminder"],
    EMAIL_CATEGORIES.FOLLOW_UP,
    1
  );

  // Special case: if there are both offer and rejection terms, prioritize rejection
  if (
    keywordScores[EMAIL_CATEGORIES.REJECTION] > 0 &&
    keywordScores[EMAIL_CATEGORIES.OFFER] > 0
  ) {
    keywordScores[EMAIL_CATEGORIES.REJECTION] += 2; // Give extra weight to rejection
  }

  // Determine highest scoring category
  let maxScore = 0;
  let maxCategory = EMAIL_CATEGORIES.OTHER;
  for (const [category, score] of Object.entries(keywordScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }

  // Final check: if rejection and another category have the same score, prioritize rejection
  if (
    maxScore > 0 &&
    keywordScores[EMAIL_CATEGORIES.REJECTION] === maxScore &&
    maxCategory !== EMAIL_CATEGORIES.REJECTION
  ) {
    return EMAIL_CATEGORIES.REJECTION;
  }

  // Return the category if confident; otherwise default to OTHER
  return maxScore > 0 ? maxCategory : EMAIL_CATEGORIES.OTHER;
};

export const extractCompanyName = (email) => {
  // Your existing extractCompanyName function works well, keep as is
  const fromText = email.from.toLowerCase();

  // Check for common recruiting patterns
  const recruitingPatterns = [
    /([a-zA-Z0-9\s]+) recruiting/i,
    /([a-zA-Z0-9\s]+) careers/i,
    /([a-zA-Z0-9\s]+) hr/i,
    /([a-zA-Z0-9\s]+) talent/i,
    /([a-zA-Z0-9\s]+) jobs/i,
  ];

  for (const pattern of recruitingPatterns) {
    const match = email.from.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Extract from email domain
  if (fromText.includes("@")) {
    const emailParts = fromText.split("@");
    if (emailParts.length > 1) {
      const domain = emailParts[1].split(".")[0];
      if (
        ![
          "gmail",
          "yahoo",
          "hotmail",
          "outlook",
          "mail",
          "aol",
          "icloud",
        ].includes(domain)
      ) {
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      }
    }
  }

  // Use subject patterns as fallback
  const subjectCompanyPatterns = [
    /thank you for applying to (.*?) for/i,
    /thank you for your interest in (.*?)[.,:]/i,
    /your application (?:to|for) (.*?) has/i,
    /your application (?:to|for) (.*?) position/i,
  ];

  for (const pattern of subjectCompanyPatterns) {
    const match = email.subject.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: if the sender has a name, try to extract a company-like term
  if (fromText.includes("<") && fromText.includes("@")) {
    const senderName = fromText.split("<")[0].trim();
    if (senderName.toLowerCase().includes(" at ")) {
      return senderName.split(" at ")[1].trim();
    }
  }

  // Try to extract from subject's capitalized words (if they are not common words)
  const subjectWords = email.subject.split(" ");
  for (const word of subjectWords) {
    if (
      word.length > 2 &&
      word[0] === word[0].toUpperCase() &&
      word[1] === word[1].toLowerCase()
    ) {
      const commonWords = [
        "The",
        "Your",
        "Our",
        "This",
        "That",
        "We",
        "They",
        "Job",
        "New",
        "Re:",
        "Thank",
        "Application",
        "Interview",
        "Position",
        "Software",
        "Engineer",
        "Developer",
        "Senior",
        "Junior",
        "Manager",
        "Lead",
        "I",
        "A",
        "An",
        "For",
        "From",
        "With",
      ];
      if (!commonWords.includes(word)) {
        return word.replace(/[^a-zA-Z]/g, "");
      }
    }
  }

  return "Unknown Company";
};

/**
 * Diagnostic function that explains why an email was classified a certain way
 */
export const explainClassification = (email) => {
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();

  // Track each phase of classification
  const hasRejectionLanguage = detectRejection(text);
  const strongCategory = checkStrongSignals(text);
  const contextOverride = checkContextOverrides(text);

  // Calculate keyword scores
  const keywordScores = {};
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    keywordScores[category] = 0;
  });

  // Get high-impact phrases that were detected
  const detectedPhrases = [];

  if (text.includes("not moving forward"))
    detectedPhrases.push("not moving forward");
  if (text.includes("unfortunately")) detectedPhrases.push("unfortunately");
  if (text.includes("regret")) detectedPhrases.push("regret");
  if (text.includes("thank you for your interest"))
    detectedPhrases.push("thank you for your interest");
  if (text.includes("wish you the best"))
    detectedPhrases.push("wish you the best");
  if (text.includes("offer")) detectedPhrases.push("offer");
  if (text.includes("interview")) detectedPhrases.push("interview");
  if (text.includes("we've decided")) detectedPhrases.push("we've decided");

  // Run the full classification
  const finalCategory = classifyEmail(email);

  return {
    email: {
      subject: email.subject,
      from: email.from,
      snippet: email.snippet || "(no snippet)",
    },
    classification: finalCategory,
    explanation: `
Classification: ${finalCategory}

Analysis:
- Rejection language detected: ${hasRejectionLanguage ? "Yes" : "No"}
- Strong signal detected: ${strongCategory || "None"}
- Context override detected: ${contextOverride || "None"}
- Key phrases detected: ${detectedPhrases.join(", ") || "None"}

This email was classified as ${finalCategory} primarily because ${
      hasRejectionLanguage
        ? 'it contains rejection language like "' +
          (text.includes("not moving forward")
            ? "not moving forward"
            : text.includes("unfortunately")
            ? "unfortunately"
            : text.includes("we've decided")
            ? "we've decided"
            : "rejection terms") +
          '"'
        : strongCategory
        ? "it contains strong signals for " + strongCategory
        : contextOverride
        ? "the context indicates it is a " + contextOverride
        : "the weighted keyword analysis determined this was the most likely category"
    }.
`.trim(),
  };
};

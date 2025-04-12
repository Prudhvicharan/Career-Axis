import { EMAIL_CATEGORIES, CATEGORY_PATTERNS } from "./Categories";

export const classifyEmail = (email) => {
  // Combine subject and body for analysis
  const text = `${email.subject} ${email.body || email.snippet}`.toLowerCase();

  // Check each category's patterns
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }

  // Simple keyword scoring approach
  const keywordScores = {
    [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: 0,
    [EMAIL_CATEGORIES.REJECTION]: 0,
    [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: 0,
    [EMAIL_CATEGORIES.ASSESSMENT]: 0,
    [EMAIL_CATEGORIES.OFFER]: 0,
  };

  // Interview related terms
  const interviewTerms = [
    "interview",
    "meet",
    "talk",
    "discuss",
    "conversation",
    "call",
    "schedule",
  ];
  interviewTerms.forEach((term) => {
    if (text.includes(term))
      keywordScores[EMAIL_CATEGORIES.INTERVIEW_REQUEST]++;
  });

  // Rejection related terms
  const rejectionTerms = [
    "unfortunately",
    "regret",
    "sorry",
    "not selected",
    "other candidates",
  ];
  rejectionTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.REJECTION]++;
  });

  // Application submission terms
  const submissionTerms = [
    "received",
    "submitted",
    "thank you for applying",
    "confirmation",
  ];
  submissionTerms.forEach((term) => {
    if (text.includes(term))
      keywordScores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED]++;
  });

  // Assessment terms
  const assessmentTerms = [
    "test",
    "assessment",
    "challenge",
    "assignment",
    "exercise",
  ];
  assessmentTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.ASSESSMENT]++;
  });

  // Offer terms
  const offerTerms = [
    "offer",
    "congratulations",
    "pleased to",
    "welcome",
    "joining",
  ];
  offerTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.OFFER]++;
  });

  // Get the category with the highest score
  let maxScore = 0;
  let maxCategory = EMAIL_CATEGORIES.OTHER;

  for (const [category, score] of Object.entries(keywordScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }

  // Only return a category if the score is above a threshold
  return maxScore > 0 ? maxCategory : EMAIL_CATEGORIES.OTHER;
};

export const extractCompanyName = (email) => {
  // Try to extract company name from email sender
  const fromText = email.from.toLowerCase();

  // Remove common email domains and extract company name
  const emailParts = fromText.split("@");
  if (emailParts.length > 1) {
    const domain = emailParts[1].split(".")[0];
    if (!["gmail", "yahoo", "hotmail", "outlook", "mail"].includes(domain)) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  // Try to extract from subject line if domain approach failed
  const subjectWords = email.subject.split(" ");
  for (const word of subjectWords) {
    // Check for words that might be company names (capitalized words longer than 2 chars)
    if (
      word.length > 2 &&
      word[0] === word[0].toUpperCase() &&
      word[1] === word[1].toLowerCase()
    ) {
      // Skip common words that start with capital letters
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
      ];
      if (!commonWords.includes(word)) {
        return word.replace(/[^a-zA-Z]/g, "");
      }
    }
  }

  return "Unknown Company";
};

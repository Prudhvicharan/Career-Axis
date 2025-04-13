// src/components/Classification/EmailClassifier.js
import { EMAIL_CATEGORIES, CATEGORY_PATTERNS } from "./Categories";

export const classifyEmail = (email) => {
  // Combine subject and body for analysis (gracefully handle missing body)
  const text = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();

  // Check each category's patterns with more robust matching
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }

  // Enhanced keyword scoring approach with more careful weights
  const keywordScores = {
    [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: 0,
    [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: 0,
    [EMAIL_CATEGORIES.REJECTION]: 0,
    [EMAIL_CATEGORIES.ASSESSMENT]: 0,
    [EMAIL_CATEGORIES.OFFER]: 0,
    [EMAIL_CATEGORIES.FOLLOW_UP]: 0,
    [EMAIL_CATEGORIES.OTHER]: 0,
  };

  // Specific patterns that strongly indicate categories
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

  if (
    text.includes("unfortunately") &&
    (text.includes("move forward") || text.includes("other candidates"))
  ) {
    keywordScores[EMAIL_CATEGORIES.REJECTION] += 3;
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
    keywordScores[EMAIL_CATEGORIES.OFFER] += 3;
  }

  // More general terms with lower weights
  // Interview related terms
  const interviewTerms = [
    "interview",
    "meet",
    "talk",
    "discuss",
    "conversation",
    "call",
    "schedule",
    "next steps",
    "speak with",
  ];
  interviewTerms.forEach((term) => {
    if (text.includes(term))
      keywordScores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 1;
  });

  // Rejection related terms
  const rejectionTerms = [
    "unfortunately",
    "regret",
    "sorry",
    "not selected",
    "other candidates",
    "not a match",
    "not moving forward",
    "no longer under consideration",
  ];
  rejectionTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.REJECTION] += 1;
  });

  // Application submission terms
  const submissionTerms = [
    "received",
    "submitted",
    "thank you for applying",
    "confirmation",
    "thank you for your interest",
    "application has been received",
    "successfully submitted",
  ];
  submissionTerms.forEach((term) => {
    if (text.includes(term))
      keywordScores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 1;
  });

  // Assessment terms
  const assessmentTerms = [
    "test",
    "assessment",
    "challenge",
    "assignment",
    "exercise",
    "coding challenge",
    "take-home",
    "technical test",
  ];
  assessmentTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.ASSESSMENT] += 1;
  });

  // Offer terms
  const offerTerms = [
    "offer",
    "congratulations",
    "pleased to",
    "welcome",
    "joining",
    "compensation",
    "benefits package",
    "formal offer",
  ];
  offerTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.OFFER] += 1;
  });

  // Follow-up terms
  const followUpTerms = [
    "follow up",
    "checking in",
    "status",
    "update",
    "progress",
    "reminder",
  ];
  followUpTerms.forEach((term) => {
    if (text.includes(term)) keywordScores[EMAIL_CATEGORIES.FOLLOW_UP] += 1;
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

  // Check for common patterns in recruiting emails
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

  // Extract from the email domain if from has @ symbol
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

  // Try to extract company name from subject
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

  // Try to extract from the first part of the sender's email if it's a person
  if (fromText.includes("<") && fromText.includes("@")) {
    // This looks like "Person Name <email@company.com>"
    const senderName = fromText.split("<")[0].trim();
    // Check if there's "at" or "@" in the sender name which often indicates company
    if (senderName.toLowerCase().includes(" at ")) {
      return senderName.split(" at ")[1].trim();
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
        // Remove any punctuation from the end of the word
        return word.replace(/[^a-zA-Z]/g, "");
      }
    }
  }

  return "Unknown Company";
};

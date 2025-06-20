// src/components/Classification/RobustEmailClassifier.js
import { EMAIL_CATEGORIES } from "./Categories";

/**
 * Robust Email Classifier with improved logic based on real-world examples
 * Addresses the specific misclassification issues identified
 */

// Strong rejection indicators that override other signals
const STRONG_REJECTION_PATTERNS = [
  // Direct rejection phrases
  "we won't be moving forward",
  "we will not be moving forward",
  "we are not moving forward",
  "we won't be proceeding",
  "we will not be proceeding",
  "we are not proceeding",
  "after careful consideration",
  "we have decided not to move forward",
  "we have decided not to proceed",
  "we regret to inform you",
  "we regrettably inform you",
  "unfortunately, we cannot",
  "unfortunately we cannot",
  "unfortunately, we will not",
  "unfortunately we will not",
  "position has been filled",
  "we have filled the position",
  "selected another candidate",
  "chosen another candidate",
  "other candidates whose",
  "we wish you every success",
  "we wish you the best",
  "best of luck in your search",
  "not selected for this position",
  "will not be selected",
  "your application will not be moving forward",
  "your application is not moving forward",
];

// Job alert indicators (mass communications)
const JOB_ALERT_PATTERNS = [
  // Subject line indicators
  { pattern: /job alert/i, weight: 10 },
  { pattern: /new job/i, weight: 8 },
  { pattern: /job.{0,20}notification/i, weight: 9 },
  { pattern: /weekly.{0,10}job/i, weight: 8 },
  { pattern: /job.{0,10}digest/i, weight: 8 },
  { pattern: /jobs you.{0,20}like/i, weight: 8 },
  { pattern: /jobs.{0,20}might.{0,20}interest/i, weight: 8 },
  { pattern: /position.{0,20}matches.{0,20}your/i, weight: 7 },
  { pattern: /opportunities.{0,20}match/i, weight: 7 },
  { pattern: /job list update/i, weight: 9 },
  { pattern: /career opportunities/i, weight: 7 },

  // Content indicators
  { pattern: /view.{0,10}jobs/i, weight: 6 },
  { pattern: /explore.{0,10}jobs/i, weight: 6 },
  { pattern: /see all.{0,20}jobs/i, weight: 6 },
  { pattern: /jobs based on your profile/i, weight: 8 },
  { pattern: /update your.{0,20}preferences/i, weight: 6 },
  { pattern: /job recommendations/i, weight: 7 },
  { pattern: /recommended jobs/i, weight: 7 },
  { pattern: /latest job opportunities/i, weight: 7 },
  { pattern: /newest job openings/i, weight: 7 },
];

// Sender domain classifications
const SENDER_CLASSIFICATIONS = {
  job_boards: [
    "glassdoor.com",
    "indeed.com",
    "linkedin.com",
    "ziprecruiter.com",
    "monster.com",
    "dice.com",
    "wellfound.com",
    "angellist.com",
    "governmentjobs.com",
    "careers.com",
    "careerbuilder.com",
    "upward.careers",
    "hired.com",
  ],
  ats_systems: [
    "workday.com",
    "successfactors.com",
    "taleo.com",
    "greenhouse.com",
    "lever.com",
    "smartrecruiters.com",
    "jobvite.com",
    "icims.com",
  ],
  recruiting: ["recruiting", "recruit", "talent", "careers", "hr"],
};

/**
 * Main classification function with improved logic
 */
export const robustClassifyEmail = (email) => {
  const fullText = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();
  const subject = email.subject.toLowerCase();
  const body = (email.body || email.snippet || "").toLowerCase();
  const sender = email.from.toLowerCase();

  // STEP 1: Check for strong rejection signals first (highest priority)
  if (isRejectionEmail(fullText, subject, body)) {
    return EMAIL_CATEGORIES.REJECTION;
  }

  // STEP 2: Check for job alerts (mass communications)
  if (isJobAlert(fullText, subject, sender)) {
    return EMAIL_CATEGORIES.JOB_ALERT;
  }

  // STEP 3: Check for application confirmations
  if (isApplicationSubmitted(fullText, subject, body, sender)) {
    return EMAIL_CATEGORIES.APPLICATION_SUBMITTED;
  }

  // STEP 4: Check for interview requests
  if (isInterviewRequest(fullText, subject, body, sender)) {
    return EMAIL_CATEGORIES.INTERVIEW_REQUEST;
  }

  // STEP 5: Check for offers
  if (isJobOffer(fullText, subject, body, sender)) {
    return EMAIL_CATEGORIES.OFFER;
  }

  // STEP 6: Check for assessments
  if (isAssessment(fullText, subject, body)) {
    return EMAIL_CATEGORIES.ASSESSMENT;
  }

  // STEP 7: Check for follow-ups
  if (isFollowUp(fullText, subject, body)) {
    return EMAIL_CATEGORIES.FOLLOW_UP;
  }

  return EMAIL_CATEGORIES.OTHER;
};

/**
 * Check if email is a rejection
 */
const isRejectionEmail = (fullText, subject, body) => {
  // Check for strong rejection patterns
  for (const pattern of STRONG_REJECTION_PATTERNS) {
    if (fullText.includes(pattern)) {
      return true;
    }
  }

  // Check for rejection context patterns
  const rejectionContext = [
    // Combination patterns that indicate rejection
    fullText.includes("after careful consideration") &&
      fullText.includes("not"),
    fullText.includes("thank you for") && fullText.includes("unfortunately"),
    fullText.includes("your application") && fullText.includes("will not"),
    fullText.includes("other candidates") && fullText.includes("selected"),
    fullText.includes("position") && fullText.includes("filled"),
    fullText.includes("wish you") &&
      (fullText.includes("success") || fullText.includes("best")),

    // Subject line rejection indicators
    subject.includes("update on your application") && body.includes("not"),
    subject.includes("regarding your application") &&
      body.includes("unfortunately"),
    subject.includes("decision on") && body.includes("not moving forward"),
  ];

  return rejectionContext.some((condition) => condition);
};

/**
 * Check if email is a job alert
 */
const isJobAlert = (fullText, subject, sender) => {
  // Check sender domain first
  const isFromJobBoard = SENDER_CLASSIFICATIONS.job_boards.some((domain) =>
    sender.includes(domain)
  );

  // Strong job alert indicators
  let score = 0;

  // Check patterns with weights
  for (const { pattern, weight } of JOB_ALERT_PATTERNS) {
    if (pattern.test(fullText)) {
      score += weight;
    }
  }

  // Additional scoring
  if (isFromJobBoard) score += 5;
  if (fullText.includes("unsubscribe")) score += 3;
  if (fullText.includes("update your preferences")) score += 4;
  if (fullText.includes("job recommendations")) score += 4;
  if (fullText.includes("matches your") && fullText.includes("profile"))
    score += 5;

  // Check for mass communication indicators
  const massCommIndicators = [
    fullText.includes("view in your browser"),
    fullText.includes("can't see this email"),
    fullText.includes("click here to unsubscribe"),
    fullText.includes("you're receiving this"),
    fullText.includes("update your job preferences"),
    sender.includes("noreply") || sender.includes("no-reply"),
    sender.includes("alerts") || sender.includes("notifications"),
  ];

  const massCommCount = massCommIndicators.filter(Boolean).length;
  if (massCommCount >= 2) score += 6;

  return score >= 8;
};

/**
 * Check if email is application submitted confirmation
 */
const isApplicationSubmitted = (fullText, subject, body, sender) => {
  // Exclude if it's clearly a rejection
  if (
    fullText.includes("unfortunately") ||
    fullText.includes("not moving forward")
  ) {
    return false;
  }

  // Strong application submitted indicators
  const confirmationPatterns = [
    "application received",
    "thank you for applying",
    "we have received your application",
    "your application has been submitted",
    "application submitted successfully",
    "submission confirmed",
    "application confirmation",
    "successfully applied",
  ];

  const hasConfirmationPattern = confirmationPatterns.some((pattern) =>
    fullText.includes(pattern)
  );

  // Subject line indicators
  const subjectPatterns = [
    subject.includes("application received"),
    subject.includes("thank you for applying"),
    subject.includes("confirmation"),
    subject.includes("application submitted"),
  ];

  const hasSubjectPattern = subjectPatterns.some(Boolean);

  // Sender indicators (ATS systems, careers emails)
  const isFromATS =
    SENDER_CLASSIFICATIONS.ats_systems.some((domain) =>
      sender.includes(domain)
    ) ||
    sender.includes("careers") ||
    sender.includes("noreply");

  return hasConfirmationPattern || (hasSubjectPattern && isFromATS);
};

/**
 * Check if email is an interview request
 */
const isInterviewRequest = (fullText, subject, body, sender) => {
  // Must contain interview-related words
  const interviewWords = [
    "interview",
    "phone screen",
    "video call",
    "meet with",
  ];
  const hasInterviewWord = interviewWords.some((word) =>
    fullText.includes(word)
  );

  if (!hasInterviewWord) return false;

  // Strong interview request indicators
  const interviewPatterns = [
    "schedule an interview",
    "interview invitation",
    "invite you for an interview",
    "would like to schedule",
    "available for an interview",
    "set up an interview",
    "interview with our team",
    "phone interview",
    "video interview",
    "next step is an interview",
  ];

  const hasStrongPattern = interviewPatterns.some((pattern) =>
    fullText.includes(pattern)
  );

  // Scheduling indicators
  const schedulingWords = [
    "schedule",
    "calendar",
    "availability",
    "time",
    "meet",
    "call",
  ];
  const schedulingCount = schedulingWords.filter((word) =>
    fullText.includes(word)
  ).length;

  // Exclude if it's clearly a job alert with interview tips
  if (
    fullText.includes("interview tips") ||
    fullText.includes("interview questions") ||
    fullText.includes("interview game plan")
  ) {
    return false;
  }

  return hasStrongPattern || (hasInterviewWord && schedulingCount >= 2);
};

/**
 * Check if email is a job offer
 */
const isJobOffer = (fullText, subject, body, sender) => {
  // Strong offer indicators
  const offerPatterns = [
    "job offer",
    "offer of employment",
    "pleased to offer",
    "offer letter",
    "congratulations",
    "welcome to the team",
    "employment offer",
    "formal offer",
  ];

  const hasOfferPattern = offerPatterns.some((pattern) =>
    fullText.includes(pattern)
  );

  // Compensation indicators
  const compensationWords = ["salary", "compensation", "benefits", "package"];
  const hasCompensation = compensationWords.some((word) =>
    fullText.includes(word)
  );

  // Subject line indicators
  const offerSubjects = [
    subject.includes("offer"),
    subject.includes("congratulations"),
    subject.includes("welcome"),
  ];

  const hasOfferSubject = offerSubjects.some(Boolean);

  // Exclude job alerts that mention "offer"
  if (fullText.includes("job alert") || fullText.includes("new jobs")) {
    return false;
  }

  return hasOfferPattern || (hasOfferSubject && hasCompensation);
};

/**
 * Check if email is an assessment request
 */
const isAssessment = (fullText, subject, body) => {
  const assessmentPatterns = [
    "technical assessment",
    "coding challenge",
    "skills assessment",
    "online assessment",
    "take the assessment",
    "complete the assessment",
    "assessment invitation",
    "skills test",
    "technical test",
  ];

  return assessmentPatterns.some((pattern) => fullText.includes(pattern));
};

/**
 * Check if email is a follow-up
 */
const isFollowUp = (fullText, subject, body) => {
  // Follow-up indicators
  const followUpPatterns = [
    "following up",
    "follow up",
    "checking in",
    "status update",
    "quick update",
    "touching base",
  ];

  const hasFollowUpPattern = followUpPatterns.some((pattern) =>
    fullText.includes(pattern)
  );

  // Reply indicators
  const isReply = subject.startsWith("re:") || subject.startsWith("fwd:");

  return hasFollowUpPattern || isReply;
};

/**
 * Enhanced company name extraction
 */
export const extractCompanyName = (email) => {
  const fromText = email.from.toLowerCase();
  const subjectText = email.subject.toLowerCase();

  // Method 1: Extract from sender name before email
  if (email.from.includes("<")) {
    const senderName = email.from.split("<")[0].trim();

    // Check if sender name contains company indicators
    const companyPatterns = [
      /(.+?)\s+recruiting/i,
      /(.+?)\s+careers/i,
      /(.+?)\s+hr/i,
      /(.+?)\s+talent/i,
    ];

    for (const pattern of companyPatterns) {
      const match = senderName.match(pattern);
      if (match && match[1]) {
        return cleanCompanyName(match[1]);
      }
    }

    // If sender name doesn't contain keywords, use it as is if it's not a person name
    if (
      !senderName.includes(" ") ||
      senderName.includes("technologies") ||
      senderName.includes("corp") ||
      senderName.includes("inc")
    ) {
      return cleanCompanyName(senderName);
    }
  }

  // Method 2: Extract from email domain
  const emailMatch = email.from.match(/@([^>]+)/);
  if (emailMatch) {
    const domain = emailMatch[1].split(".")[0];
    if (!isGenericDomain(domain)) {
      return capitalizeFirst(domain);
    }
  }

  // Method 3: Extract from subject
  const subjectCompanyPatterns = [
    /application for .+ at (.+?)(?:\s|$)/i,
    /position at (.+?)(?:\s|$)/i,
    /job at (.+?)(?:\s|$)/i,
    /(.+?) job/i,
  ];

  for (const pattern of subjectCompanyPatterns) {
    const match = email.subject.match(pattern);
    if (match && match[1]) {
      const company = cleanCompanyName(match[1]);
      if (company.length > 1 && !isCommonWord(company)) {
        return company;
      }
    }
  }

  return "Unknown Company";
};

// Helper functions
const cleanCompanyName = (name) => {
  return name
    .replace(/\b(inc|corp|llc|ltd|company|co|technologies|tech)\b\.?/gi, "")
    .replace(/[^\w\s&-]/g, "")
    .trim()
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const isGenericDomain = (domain) => {
  const genericDomains = [
    "gmail",
    "yahoo",
    "hotmail",
    "outlook",
    "aol",
    "icloud",
    "noreply",
    "no-reply",
    "donotreply",
    "mail",
  ];
  return genericDomains.includes(domain.toLowerCase());
};

const isCommonWord = (word) => {
  const commonWords = [
    "position",
    "role",
    "job",
    "opportunity",
    "team",
    "company",
    "application",
    "the",
    "and",
    "for",
    "with",
  ];
  return commonWords.includes(word.toLowerCase());
};

/**
 * Get confidence score for classification
 */
export const getRobustConfidence = (email) => {
  const classification = robustClassifyEmail(email);
  const fullText = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();

  let confidence = 50; // Base confidence

  // Increase confidence based on strong indicators
  switch (classification) {
    case EMAIL_CATEGORIES.REJECTION:
      if (
        STRONG_REJECTION_PATTERNS.some((pattern) => fullText.includes(pattern))
      ) {
        confidence = 95;
      }
      break;

    case EMAIL_CATEGORIES.JOB_ALERT:
      if (
        SENDER_CLASSIFICATIONS.job_boards.some((domain) =>
          email.from.includes(domain)
        )
      ) {
        confidence = 90;
      }
      break;

    case EMAIL_CATEGORIES.APPLICATION_SUBMITTED:
      if (
        fullText.includes("application received") ||
        fullText.includes("thank you for applying")
      ) {
        confidence = 85;
      }
      break;

    default:
      confidence = 70;
  }

  return confidence;
};

/**
 * Debug function to explain classification
 */
export const explainRobustClassification = (email) => {
  const classification = robustClassifyEmail(email);
  const fullText = `${email.subject} ${
    email.body || email.snippet || ""
  }`.toLowerCase();
  const reasons = [];

  // Find matching patterns
  if (classification === EMAIL_CATEGORIES.REJECTION) {
    const matchedPatterns = STRONG_REJECTION_PATTERNS.filter((pattern) =>
      fullText.includes(pattern)
    );
    reasons.push(
      `Rejection patterns found: ${matchedPatterns.slice(0, 3).join(", ")}`
    );
  }

  if (classification === EMAIL_CATEGORIES.JOB_ALERT) {
    const jobBoardMatch = SENDER_CLASSIFICATIONS.job_boards.find((domain) =>
      email.from.includes(domain)
    );
    if (jobBoardMatch) {
      reasons.push(`Sender is job board: ${jobBoardMatch}`);
    }

    const alertPatterns = JOB_ALERT_PATTERNS.filter(({ pattern }) =>
      pattern.test(fullText)
    );
    if (alertPatterns.length > 0) {
      reasons.push(`Job alert patterns: ${alertPatterns.length} matches`);
    }
  }

  return {
    classification,
    confidence: getRobustConfidence(email),
    reasons,
    sender: email.from,
    subject: email.subject,
  };
};

export default robustClassifyEmail;

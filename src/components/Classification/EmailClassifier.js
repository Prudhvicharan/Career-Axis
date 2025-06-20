// src/components/Classification/EmailClassifier.js - Updated with Robust Classifier
import { EMAIL_CATEGORIES } from "./Categories";
import {
  robustClassifyEmail,
  extractCompanyName as robustExtractCompany,
  getRobustConfidence,
  explainRobustClassification,
} from "./RobustEmailClassifier";

/**
 * Main Email Classification Interface
 * Now uses the robust classifier that handles your specific failure cases
 */

/**
 * Main classification function - now uses robust classifier
 */
export const classifyEmail = (email) => {
  try {
    return robustClassifyEmail(email);
  } catch (error) {
    console.error("Error in email classification:", error);
    return EMAIL_CATEGORIES.OTHER;
  }
};

/**
 * Extract company name using robust method
 */
export const extractCompanyName = (email) => {
  try {
    return robustExtractCompany(email);
  } catch (error) {
    console.error("Error extracting company name:", error);
    return "Unknown Company";
  }
};

/**
 * Get confidence score for classification
 */
export const getClassificationConfidence = (email) => {
  try {
    return getRobustConfidence(email);
  } catch (error) {
    console.error("Error getting confidence:", error);
    return 50;
  }
};

/**
 * Get detailed explanation of classification
 */
export const explainClassification = (email) => {
  try {
    return explainRobustClassification(email);
  } catch (error) {
    console.error("Error explaining classification:", error);
    return {
      classification: EMAIL_CATEGORIES.OTHER,
      confidence: 0,
      reasons: ["Error occurred during classification"],
      error: error.message,
    };
  }
};

/**
 * Batch classify multiple emails
 */
export const batchClassifyEmails = (emails, options = {}) => {
  const startTime = Date.now();
  const results = {
    total: emails.length,
    processed: 0,
    errors: 0,
    classifications: {},
    performance: {},
    summary: {},
  };

  // Initialize category counts
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    results.classifications[category] = [];
    results.summary[category] = 0;
  });

  emails.forEach((email, index) => {
    try {
      const classification = classifyEmail(email);
      const confidence = getClassificationConfidence(email);

      results.classifications[classification].push({
        id: email.id,
        subject: email.subject,
        confidence: confidence,
        index: index,
      });

      results.summary[classification]++;
      results.processed++;

      if (options.debug) {
        console.log(
          `Email ${index + 1}/${
            emails.length
          }: ${classification} (${confidence}%) - ${email.subject}`
        );
      }
    } catch (error) {
      console.error(`Error classifying email ${index}:`, error);
      results.errors++;
    }
  });

  const endTime = Date.now();
  results.performance = {
    totalTime: endTime - startTime,
    averageTime: (endTime - startTime) / emails.length,
    emailsPerSecond: Math.round((emails.length / (endTime - startTime)) * 1000),
  };

  return results;
};

/**
 * Test the classifier with your specific problem emails
 */
export const testProblematicEmails = () => {
  console.log("🧪 Testing Previously Problematic Emails");

  const problematicEmails = [
    {
      subject:
        "Your application for Software Engineer, .NET at Tyler Technologies",
      from: "Tyler Technologies Recruiting Team <reply@careers.tylertech.com>",
      body: "Hi Sai Prudhvi Charan, Thank you for taking the time to apply with us at Tyler Technologies. After careful consideration of your background and experience, we won't be moving forward with your application for the role of Software Engineer, .NET at this time.",
      expectedCategory: EMAIL_CATEGORIES.REJECTION,
      previousWrongCategory: EMAIL_CATEGORIES.APPLICATION_SUBMITTED,
    },
    {
      subject: "Job Posting Notification at American Express",
      from: "Amex Recruiting <Amex_Recruiting_AXP@invalidemail.com>",
      body: "The position of Engineer -25009054, which matches your indicated preferences on your profile, has just been opened and posted on our Career site.",
      expectedCategory: EMAIL_CATEGORIES.JOB_ALERT,
      previousWrongCategory: EMAIL_CATEGORIES.FOLLOW_UP,
    },
    {
      subject:
        "Job at Tyler Technologies,JE Dunn is still available. Apply Soon.",
      from: "Glassdoor <noreply@glassdoor.com>",
      body: "See all of your recently viewed jobs, saved jobs, and more Your job activity Hey Sai Prudhvi Charan Pick up your job search where you left off and explore interview tips from the community.",
      expectedCategory: EMAIL_CATEGORIES.JOB_ALERT,
      previousWrongCategory: EMAIL_CATEGORIES.INTERVIEW_REQUEST,
    },
  ];

  let fixedCount = 0;
  problematicEmails.forEach((testEmail, index) => {
    const prediction = classifyEmail(testEmail);
    const isFixed = prediction === testEmail.expectedCategory;

    if (isFixed) {
      fixedCount++;
    }

    console.log(
      `Test ${index + 1}: ${isFixed ? "✅ FIXED" : "❌ STILL BROKEN"}`
    );
    console.log(`  Subject: ${testEmail.subject.substring(0, 50)}...`);
    console.log(`  Expected: ${testEmail.expectedCategory}`);
    console.log(`  Previous: ${testEmail.previousWrongCategory} (wrong)`);
    console.log(
      `  Current:  ${prediction} ${isFixed ? "(correct!)" : "(still wrong)"}`
    );
    console.log("");
  });

  console.log(
    `🎯 Fixed ${fixedCount}/${problematicEmails.length} previously broken classifications`
  );
  return { fixed: fixedCount, total: problematicEmails.length };
};

/**
 * Validate classification with confidence thresholds
 */
export const validateClassification = (email, minConfidence = 70) => {
  const classification = classifyEmail(email);
  const confidence = getClassificationConfidence(email);

  return {
    classification,
    confidence,
    isReliable: confidence >= minConfidence,
    needsReview: confidence < minConfidence,
  };
};

/**
 * Get classification statistics for a set of emails
 */
export const getClassificationStats = (emails) => {
  const stats = {
    total: emails.length,
    byCategory: {},
    byConfidence: {
      high: 0, // 80+
      medium: 0, // 50-79
      low: 0, // <50
    },
    averageConfidence: 0,
  };

  // Initialize category counts
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    stats.byCategory[category] = { count: 0, percentage: 0 };
  });

  let totalConfidence = 0;

  emails.forEach((email) => {
    const classification = classifyEmail(email);
    const confidence = getClassificationConfidence(email);

    stats.byCategory[classification].count++;
    totalConfidence += confidence;

    if (confidence >= 80) {
      stats.byConfidence.high++;
    } else if (confidence >= 50) {
      stats.byConfidence.medium++;
    } else {
      stats.byConfidence.low++;
    }
  });

  // Calculate percentages
  Object.keys(stats.byCategory).forEach((category) => {
    stats.byCategory[category].percentage = Math.round(
      (stats.byCategory[category].count / emails.length) * 100
    );
  });

  stats.averageConfidence = Math.round(totalConfidence / emails.length);

  return stats;
};

/**
 * Debug helper to analyze misclassifications
 */
export const debugMisclassification = (email, expectedCategory) => {
  const prediction = classifyEmail(email);
  const explanation = explainClassification(email);

  console.log("🐛 Misclassification Debug:");
  console.log(`Expected: ${expectedCategory}`);
  console.log(`Predicted: ${prediction}`);
  console.log(`Confidence: ${explanation.confidence}%`);
  console.log(`Subject: ${email.subject}`);
  console.log(`From: ${email.from}`);
  console.log(`Reasons: ${explanation.reasons.join("; ")}`);
  console.log(
    `Body preview: ${(email.body || email.snippet || "").substring(0, 200)}...`
  );

  return {
    isCorrect: prediction === expectedCategory,
    prediction,
    expected: expectedCategory,
    explanation,
  };
};

/**
 * Performance monitoring
 */
export const monitorPerformance = (email) => {
  const start = Date.now();
  const classification = classifyEmail(email);
  const confidence = getClassificationConfidence(email);
  const end = Date.now();

  const performance = {
    classification,
    confidence,
    processingTime: end - start,
    timestamp: new Date().toISOString(),
  };

  // Log slow classifications
  if (performance.processingTime > 50) {
    console.warn("Slow classification detected:", performance);
  }

  return performance;
};

// Backward compatibility exports
export { EMAIL_CATEGORIES };

// Default export with all utilities
export default {
  classifyEmail,
  extractCompanyName,
  getClassificationConfidence,
  explainClassification,
  batchClassifyEmails,
  testProblematicEmails,
  validateClassification,
  getClassificationStats,
  debugMisclassification,
  monitorPerformance,
};

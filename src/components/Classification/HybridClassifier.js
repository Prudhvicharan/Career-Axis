// src/components/Classification/HybridClassifier.js
import { EMAIL_CATEGORIES } from "./Categories";
import {
  enhancedClassifyEmail,
  getClassificationConfidence,
} from "./EnhancedEmailClassifier";
import {
  classifyEmailML,
  getMLConfidence,
  explainMLClassification,
} from "./MLEmailClassifier";

/**
 * Hybrid Email Classifier that combines multiple approaches:
 * 1. Rule-based pattern matching
 * 2. Machine learning features
 * 3. Context analysis
 * 4. Ensemble voting
 */

class HybridClassifier {
  constructor() {
    this.classifiers = {
      enhanced: enhancedClassifyEmail,
      ml: classifyEmailML,
      contextual: this.contextualClassify.bind(this),
      statistical: this.statisticalClassify.bind(this),
    };

    this.weights = {
      enhanced: 0.35,
      ml: 0.25,
      contextual: 0.25,
      statistical: 0.15,
    };
  }

  /**
   * Main classification method using ensemble approach
   */
  classify(email) {
    try {
      const results = {};
      const confidences = {};

      // Run all classifiers
      Object.entries(this.classifiers).forEach(([name, classifier]) => {
        try {
          results[name] = classifier(email);
          confidences[name] = this.getConfidenceForClassifier(name, email);
        } catch (error) {
          console.error(`Error in ${name} classifier:`, error);
          results[name] = EMAIL_CATEGORIES.OTHER;
          confidences[name] = 0;
        }
      });

      // Ensemble voting with weighted confidence
      const finalResult = this.ensembleVote(results, confidences);

      return finalResult;
    } catch (error) {
      console.error("Error in hybrid classification:", error);
      return EMAIL_CATEGORIES.OTHER;
    }
  }

  /**
   * Context-aware classifier focusing on email structure and flow
   */
  contextualClassify(email) {
    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();
    const subject = email.subject.toLowerCase();
    const sender = email.from.toLowerCase();
    const body = (email.body || email.snippet || "").toLowerCase();

    // Context indicators
    const context = {
      isReply: subject.startsWith("re:") || subject.startsWith("fwd:"),
      hasReferenceNumber: /(?:ref|reference|req|job\s*id)[:\s#]*\d+/i.test(
        text
      ),
      senderType: this.analyzeSenderType(sender),
      emailStructure: this.analyzeEmailStructure(body),
      urgencyLevel: this.analyzeUrgency(text),
      sentimentScore: this.analyzeSentiment(text),
    };

    // Context-based scoring
    const scores = this.initializeScores();

    // Apply context rules
    if (context.isReply) {
      scores[EMAIL_CATEGORIES.FOLLOW_UP] += 15;
    }

    if (context.hasReferenceNumber) {
      scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 10;
      scores[EMAIL_CATEGORIES.FOLLOW_UP] += 5;
    }

    // Sender type influence
    switch (context.senderType) {
      case "ats":
        scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 12;
        scores[EMAIL_CATEGORIES.ASSESSMENT] += 8;
        break;
      case "recruiting":
        scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 10;
        scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 8;
        break;
      case "job_board":
        scores[EMAIL_CATEGORIES.JOB_ALERT] += 15;
        break;
      case "hr":
        scores[EMAIL_CATEGORIES.OFFER] += 8;
        scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 8;
        break;
    }

    // Sentiment influence
    if (context.sentimentScore < -0.3) {
      scores[EMAIL_CATEGORIES.REJECTION] += 12;
    } else if (context.sentimentScore > 0.3) {
      scores[EMAIL_CATEGORIES.OFFER] += 8;
      scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 6;
    }

    // Structure influence
    if (
      context.emailStructure.hasSignature &&
      context.emailStructure.isProfessional
    ) {
      scores[EMAIL_CATEGORIES.OFFER] += 5;
      scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 5;
    }

    return this.getBestCategory(scores);
  }

  /**
   * Statistical classifier using frequency analysis and patterns
   */
  statisticalClassify(email) {
    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();
    const words = text.split(/\s+/).filter((word) => word.length > 2);

    const scores = this.initializeScores();

    // Word frequency analysis
    const wordFreq = this.calculateWordFrequency(words);

    // Statistical patterns for each category
    const statisticalPatterns = {
      [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: {
        keyWords: [
          "thank",
          "application",
          "received",
          "submitted",
          "confirmation",
        ],
        avgWordCount: 50,
        commonPhrases: [
          "thank you for",
          "we have received",
          "your application",
        ],
      },
      [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: {
        keyWords: ["interview", "schedule", "meet", "discuss", "next"],
        avgWordCount: 80,
        commonPhrases: ["schedule an interview", "would like to", "next step"],
      },
      [EMAIL_CATEGORIES.REJECTION]: {
        keyWords: ["unfortunately", "not", "other", "candidates", "position"],
        avgWordCount: 60,
        commonPhrases: [
          "unfortunately we",
          "not moving forward",
          "other candidates",
        ],
      },
      [EMAIL_CATEGORIES.OFFER]: {
        keyWords: ["offer", "pleased", "congratulations", "position", "salary"],
        avgWordCount: 120,
        commonPhrases: ["pleased to offer", "congratulations", "offer letter"],
      },
      [EMAIL_CATEGORIES.ASSESSMENT]: {
        keyWords: ["assessment", "test", "challenge", "technical", "complete"],
        avgWordCount: 70,
        commonPhrases: [
          "technical assessment",
          "coding challenge",
          "please complete",
        ],
      },
    };

    // Score based on statistical patterns
    Object.entries(statisticalPatterns).forEach(([category, pattern]) => {
      let score = 0;

      // Key word frequency score
      pattern.keyWords.forEach((word) => {
        if (wordFreq[word]) {
          score += wordFreq[word] * 5;
        }
      });

      // Phrase matching score
      pattern.commonPhrases.forEach((phrase) => {
        if (text.includes(phrase)) {
          score += 10;
        }
      });

      // Length similarity score
      const lengthDiff = Math.abs(words.length - pattern.avgWordCount);
      const lengthScore = Math.max(0, 10 - lengthDiff / 10);
      score += lengthScore;

      scores[category] += score;
    });

    return this.getBestCategory(scores);
  }

  /**
   * Ensemble voting mechanism
   */
  ensembleVote(results, confidences) {
    const categoryVotes = {};

    // Initialize vote counts
    Object.values(EMAIL_CATEGORIES).forEach((category) => {
      categoryVotes[category] = 0;
    });

    // Weighted voting
    Object.entries(results).forEach(([classifierName, category]) => {
      const weight = this.weights[classifierName] || 0.25;
      const confidence = confidences[classifierName] || 50;

      // Convert confidence to multiplier (0.5 to 1.5)
      const confidenceMultiplier = confidence / 100 + 0.5;

      categoryVotes[category] += weight * confidenceMultiplier;
    });

    // Find the category with highest votes
    let maxVotes = 0;
    let bestCategory = EMAIL_CATEGORIES.OTHER;

    Object.entries(categoryVotes).forEach(([category, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        bestCategory = category;
      }
    });

    // Apply confidence threshold
    if (maxVotes < 0.3) {
      return EMAIL_CATEGORIES.OTHER;
    }

    return bestCategory;
  }

  /**
   * Get confidence score for a specific classifier
   */
  getConfidenceForClassifier(classifierName, email) {
    switch (classifierName) {
      case "enhanced":
        return getClassificationConfidence(email);
      case "ml":
        return getMLConfidence(email);
      case "contextual":
        return this.getContextualConfidence(email);
      case "statistical":
        return this.getStatisticalConfidence(email);
      default:
        return 50;
    }
  }

  /**
   * Helper methods
   */
  initializeScores() {
    const scores = {};
    Object.values(EMAIL_CATEGORIES).forEach((category) => {
      scores[category] = 0;
    });
    return scores;
  }

  getBestCategory(scores) {
    let maxScore = 0;
    let bestCategory = EMAIL_CATEGORIES.OTHER;

    Object.entries(scores).forEach(([category, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    });

    return bestCategory;
  }

  analyzeSenderType(sender) {
    if (/workday|successfactors|taleo|greenhouse|lever/i.test(sender)) {
      return "ats";
    }
    if (/recruit|talent|hiring/i.test(sender)) {
      return "recruiting";
    }
    if (/indeed|linkedin|glassdoor|ziprecruiter|monster/i.test(sender)) {
      return "job_board";
    }
    if (/hr|human.resources/i.test(sender)) {
      return "hr";
    }
    return "unknown";
  }

  analyzeEmailStructure(body) {
    return {
      hasSignature: /regards|sincerely|best|thank you/i.test(body),
      isProfessional: !/hey|hi there|what's up/i.test(body),
      hasLinks: /https?:\/\//.test(body),
      hasPhoneNumber: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(body),
    };
  }

  analyzeUrgency(text) {
    const urgentWords = ["urgent", "asap", "immediate", "deadline", "expires"];
    return urgentWords.filter((word) => text.includes(word)).length;
  }

  analyzeSentiment(text) {
    const positiveWords = [
      "pleased",
      "excited",
      "congratulations",
      "welcome",
      "great",
      "excellent",
    ];
    const negativeWords = [
      "unfortunately",
      "regret",
      "sorry",
      "cannot",
      "unable",
      "not",
    ];

    const positiveCount = positiveWords.filter((word) =>
      text.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      text.includes(word)
    ).length;

    return (
      (positiveCount - negativeCount) /
      Math.max(1, positiveCount + negativeCount)
    );
  }

  calculateWordFrequency(words) {
    const freq = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
  }

  getContextualConfidence(email) {
    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();
    let confidence = 50;

    // Boost confidence based on strong indicators
    if (text.includes("re:") || text.includes("fwd:")) confidence += 10;
    if (/ref|reference|req|job\s*id/i.test(text)) confidence += 15;
    if (this.analyzeSenderType(email.from) !== "unknown") confidence += 15;

    return Math.min(100, confidence);
  }

  getStatisticalConfidence(email) {
    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();
    const words = text.split(/\s+/).filter((word) => word.length > 2);

    // Base confidence on text length and keyword density
    let confidence = Math.min(50, words.length / 2);

    const jobKeywords = [
      "position",
      "role",
      "job",
      "career",
      "application",
      "interview",
    ];
    const keywordCount = jobKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;

    confidence += keywordCount * 10;

    return Math.min(100, confidence);
  }

  /**
   * Get detailed explanation of classification
   */
  explainClassification(email) {
    const results = {};
    const explanations = {};

    // Get results from all classifiers
    Object.entries(this.classifiers).forEach(([name, classifier]) => {
      try {
        results[name] = classifier(email);
        explanations[name] = this.getClassifierExplanation(name, email);
      } catch (error) {
        results[name] = EMAIL_CATEGORIES.OTHER;
        explanations[name] = { error: error.message };
      }
    });

    const finalResult = this.classify(email);

    return {
      finalClassification: finalResult,
      individualResults: results,
      explanations: explanations,
      consensusLevel: this.calculateConsensus(results),
      recommendation: this.getRecommendation(results, finalResult),
    };
  }

  getClassifierExplanation(classifierName, email) {
    switch (classifierName) {
      case "ml":
        return explainMLClassification(email);
      case "contextual":
        return {
          type: "contextual",
          confidence: this.getContextualConfidence(email),
        };
      case "statistical":
        return {
          type: "statistical",
          confidence: this.getStatisticalConfidence(email),
        };
      default:
        return {
          type: classifierName,
          confidence: this.getConfidenceForClassifier(classifierName, email),
        };
    }
  }

  calculateConsensus(results) {
    const counts = {};
    Object.values(results).forEach((category) => {
      counts[category] = (counts[category] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));
    const totalClassifiers = Object.keys(results).length;

    return Math.round((maxCount / totalClassifiers) * 100);
  }

  getRecommendation(results, finalResult) {
    const consensus = this.calculateConsensus(results);

    if (consensus >= 75) {
      return "High confidence - all classifiers agree";
    } else if (consensus >= 50) {
      return "Medium confidence - majority agreement";
    } else {
      return "Low confidence - classifiers disagree, manual review recommended";
    }
  }
}

// Export singleton instance
const hybridClassifier = new HybridClassifier();

export const classifyEmailHybrid = (email) => {
  return hybridClassifier.classify(email);
};

export const explainHybridClassification = (email) => {
  return hybridClassifier.explainClassification(email);
};

export const getHybridConfidence = (email) => {
  const explanation = hybridClassifier.explainClassification(email);
  return explanation.consensusLevel;
};

export default hybridClassifier;

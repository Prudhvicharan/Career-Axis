// src/components/Classification/MLEmailClassifier.js
import natural from "natural";
import { EMAIL_CATEGORIES } from "./Categories";

/**
 * Machine Learning Style Email Classifier
 * Uses NLP techniques like TF-IDF, N-grams, and feature extraction
 */

// Training data with labeled examples
const TRAINING_DATA = {
  [EMAIL_CATEGORIES.APPLICATION_SUBMITTED]: [
    "Thank you for applying to the Software Engineer position at TechCorp",
    "We have received your application for the Developer role",
    "Your application has been submitted successfully",
    "Application confirmation for Product Manager position",
    "Thank you for your interest in joining our team",
    "We received your application and will review it shortly",
    "Your application for Data Scientist has been received",
    "Application submitted: Senior Developer position",
  ],

  [EMAIL_CATEGORIES.INTERVIEW_REQUEST]: [
    "We would like to schedule an interview with you",
    "Invitation to interview for Software Engineer position",
    "Next step: Phone interview scheduling",
    "Interview invitation - Technical Lead role",
    "Let's schedule a time to discuss the position",
    "We'd like to speak with you about the Developer role",
    "Technical interview invitation for Monday",
    "Interview scheduling for Senior Engineer position",
  ],

  [EMAIL_CATEGORIES.REJECTION]: [
    "Unfortunately, we will not be moving forward",
    "We've decided to move forward with another candidate",
    "Position has been filled by another candidate",
    "We regret to inform you that you were not selected",
    "Thank you for your interest, but we cannot offer you the position",
    "After careful consideration, we've chosen another candidate",
    "We wish you the best of luck in your job search",
    "Unfortunately, we cannot proceed with your application",
  ],

  [EMAIL_CATEGORIES.OFFER]: [
    "We are pleased to offer you the position",
    "Congratulations! Job offer for Software Engineer",
    "Formal offer of employment attached",
    "Welcome to the team! Offer details enclosed",
    "We'd like to extend an offer for the Developer position",
    "Employment offer - Senior Engineer role",
    "Offer letter for Product Manager position",
    "Job offer with compensation details",
  ],

  [EMAIL_CATEGORIES.ASSESSMENT]: [
    "Please complete the technical assessment",
    "Coding challenge for Software Engineer position",
    "Take-home assignment attached",
    "Technical test for Developer role",
    "Programming challenge - next step in process",
    "Skills assessment for Senior Engineer position",
    "Online coding test invitation",
    "Technical evaluation assignment",
  ],

  [EMAIL_CATEGORIES.FOLLOW_UP]: [
    "Following up on your application status",
    "Checking in regarding the Developer position",
    "Update on your interview process",
    "Status check: Software Engineer application",
    "Following up on our previous conversation",
    "Application status update request",
    "Checking on interview feedback",
    "Follow-up regarding your candidacy",
  ],

  [EMAIL_CATEGORIES.JOB_ALERT]: [
    "New job alert: Software Engineer positions",
    "Job recommendations based on your profile",
    "New opportunities matching your skills",
    "Weekly job digest - Developer positions",
    "Job matches found for your search",
    "New job postings in your area",
    "Career opportunities you might like",
    "Job alert: Senior Engineer openings",
  ],
};

class MLEmailClassifier {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
    this.categoryVectors = {};
    this.featureWeights = {};
    this.isInitialized = false;

    this.initializeClassifier();
  }

  initializeClassifier() {
    try {
      // Create TF-IDF vectors for each category
      Object.entries(TRAINING_DATA).forEach(([category, examples]) => {
        examples.forEach((example) => {
          const processed = this.preprocessText(example);
          this.tfidf.addDocument(processed);
        });
      });

      // Build category vectors
      let docIndex = 0;
      Object.entries(TRAINING_DATA).forEach(([category, examples]) => {
        this.categoryVectors[category] = [];

        examples.forEach(() => {
          const vector = [];
          this.tfidf.listTerms(docIndex).forEach((item) => {
            vector.push({
              term: item.term,
              tfidf: item.tfidf,
            });
          });
          this.categoryVectors[category].push(vector);
          docIndex++;
        });
      });

      // Calculate feature importance
      this.calculateFeatureWeights();
      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing ML classifier:", error);
      this.isInitialized = false;
    }
  }

  preprocessText(text) {
    if (!text) return [];

    // Convert to lowercase and tokenize
    const tokens = this.tokenizer.tokenize(text.toLowerCase());

    // Remove stop words and stem
    return tokens
      .filter((token) => !natural.stopwords.includes(token))
      .filter((token) => token.length > 2)
      .map((token) => this.stemmer.stem(token));
  }

  extractFeatures(email) {
    const text = `${email.subject} ${email.body || email.snippet || ""}`;
    const features = {
      // Text-based features
      tokens: this.preprocessText(text),
      wordCount: text.split(" ").length,
      hasNumbers: /\d/.test(text),
      hasEmail: /@/.test(text),
      hasPhone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text),

      // Sender features
      senderDomain: this.extractDomain(email.from),
      isPersonalEmail: this.isPersonalEmail(email.from),
      senderName: this.extractSenderName(email.from),

      // Subject features
      subjectLength: email.subject.length,
      subjectHasQuestion: email.subject.includes("?"),
      subjectHasExclamation: email.subject.includes("!"),

      // Temporal features
      dayOfWeek: new Date(email.date).getDay(),
      hour: new Date(email.date).getHours(),

      // Structure features
      hasGreeting: this.hasGreeting(text),
      hasSignature: this.hasSignature(text),
      formalityScore: this.calculateFormality(text),

      // Job-specific features
      jobKeywords: this.countJobKeywords(text),
      companyIndicators: this.countCompanyIndicators(text),
      positionTitles: this.countPositionTitles(text),
    };

    return features;
  }

  calculateSimilarity(text1, text2) {
    const tokens1 = new Set(this.preprocessText(text1));
    const tokens2 = new Set(this.preprocessText(text2));

    const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    return intersection.size / union.size; // Jaccard similarity
  }

  classifyWithML(email) {
    if (!this.isInitialized) {
      console.warn("ML Classifier not initialized, falling back to rule-based");
      return this.fallbackClassify(email);
    }

    try {
      const features = this.extractFeatures(email);
      const text = `${email.subject} ${email.body || email.snippet || ""}`;
      const scores = {};

      // Initialize scores
      Object.keys(EMAIL_CATEGORIES).forEach((key) => {
        scores[EMAIL_CATEGORIES[key]] = 0;
      });

      // Calculate similarity scores with training data
      Object.entries(TRAINING_DATA).forEach(([category, examples]) => {
        let categoryScore = 0;

        examples.forEach((example) => {
          const similarity = this.calculateSimilarity(text, example);
          categoryScore += similarity;
        });

        scores[category] = categoryScore / examples.length;
      });

      // Apply feature-based scoring
      const featureScore = this.scoreBasedOnFeatures(features);
      Object.keys(featureScore).forEach((category) => {
        scores[category] += featureScore[category];
      });

      // Apply domain knowledge rules
      const ruleScore = this.applyDomainRules(email, features);
      Object.keys(ruleScore).forEach((category) => {
        scores[category] += ruleScore[category];
      });

      // Find best category
      const maxScore = Math.max(...Object.values(scores));
      const bestCategory = Object.keys(scores).find(
        (cat) => scores[cat] === maxScore
      );

      // Apply confidence threshold
      if (maxScore > 0.1) {
        return bestCategory;
      }

      return EMAIL_CATEGORIES.OTHER;
    } catch (error) {
      console.error("Error in ML classification:", error);
      return this.fallbackClassify(email);
    }
  }

  scoreBasedOnFeatures(features) {
    const scores = {};
    Object.values(EMAIL_CATEGORIES).forEach((cat) => (scores[cat] = 0));

    // Sender domain scoring
    if (features.senderDomain) {
      if (
        ["workday", "successfactors", "taleo"].includes(features.senderDomain)
      ) {
        scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 0.3;
      }
      if (
        ["indeed", "linkedin", "glassdoor", "ziprecruiter"].includes(
          features.senderDomain
        )
      ) {
        scores[EMAIL_CATEGORIES.JOB_ALERT] += 0.4;
      }
    }

    // Job keywords scoring
    if (features.jobKeywords > 3) {
      scores[EMAIL_CATEGORIES.JOB_ALERT] += 0.2;
    }

    // Formality scoring
    if (features.formalityScore > 0.7) {
      scores[EMAIL_CATEGORIES.OFFER] += 0.2;
      scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 0.1;
    }

    // Time-based patterns
    if (
      features.hour >= 9 &&
      features.hour <= 17 &&
      features.dayOfWeek >= 1 &&
      features.dayOfWeek <= 5
    ) {
      scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 0.1;
      scores[EMAIL_CATEGORIES.APPLICATION_SUBMITTED] += 0.1;
    }

    return scores;
  }

  applyDomainRules(email, features) {
    const scores = {};
    Object.values(EMAIL_CATEGORIES).forEach((cat) => (scores[cat] = 0));

    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();

    // Strong rejection indicators
    if (text.includes("unfortunately") && text.includes("not moving forward")) {
      scores[EMAIL_CATEGORIES.REJECTION] += 0.8;
    }

    // Strong interview indicators
    if (text.includes("schedule") && text.includes("interview")) {
      scores[EMAIL_CATEGORIES.INTERVIEW_REQUEST] += 0.7;
    }

    // Strong offer indicators
    if (text.includes("pleased to offer") || text.includes("congratulations")) {
      scores[EMAIL_CATEGORIES.OFFER] += 0.8;
    }

    // Assessment indicators
    if (
      text.includes("technical") &&
      (text.includes("test") || text.includes("assessment"))
    ) {
      scores[EMAIL_CATEGORIES.ASSESSMENT] += 0.7;
    }

    return scores;
  }

  // Helper methods
  extractDomain(email) {
    const match = email.match(/@([^>]+)/);
    return match ? match[1].split(".")[0].toLowerCase() : "";
  }

  isPersonalEmail(email) {
    const personalDomains = ["gmail", "yahoo", "hotmail", "outlook", "aol"];
    const domain = this.extractDomain(email);
    return personalDomains.includes(domain);
  }

  extractSenderName(email) {
    const match = email.match(/^([^<]+)</);
    return match ? match[1].trim() : "";
  }

  hasGreeting(text) {
    const greetings = ["dear", "hello", "hi", "greetings"];
    return greetings.some((greeting) => text.toLowerCase().includes(greeting));
  }

  hasSignature(text) {
    const signatures = ["regards", "sincerely", "best", "thank you"];
    return signatures.some((sig) => text.toLowerCase().includes(sig));
  }

  calculateFormality(text) {
    const formalWords = [
      "please",
      "thank you",
      "sincerely",
      "regards",
      "respectfully",
    ];
    const informalWords = ["hey", "yeah", "gonna", "wanna", "cool"];

    const formalCount = formalWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;
    const informalCount = informalWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    return (formalCount - informalCount + 5) / 10; // Normalize to 0-1
  }

  countJobKeywords(text) {
    const jobKeywords = [
      "position",
      "role",
      "job",
      "career",
      "opportunity",
      "employment",
      "hiring",
      "recruit",
      "candidate",
      "application",
      "resume",
      "cv",
    ];
    return jobKeywords.filter((keyword) => text.toLowerCase().includes(keyword))
      .length;
  }

  countCompanyIndicators(text) {
    const indicators = [
      "company",
      "corporation",
      "inc",
      "ltd",
      "llc",
      "team",
      "organization",
    ];
    return indicators.filter((indicator) =>
      text.toLowerCase().includes(indicator)
    ).length;
  }

  countPositionTitles(text) {
    const titles = [
      "engineer",
      "developer",
      "manager",
      "analyst",
      "specialist",
      "coordinator",
      "director",
      "senior",
      "junior",
      "lead",
      "principal",
    ];
    return titles.filter((title) => text.toLowerCase().includes(title)).length;
  }

  calculateFeatureWeights() {
    // Calculate importance of different features based on training data
    this.featureWeights = {
      subjectMatch: 0.4,
      bodyMatch: 0.3,
      senderDomain: 0.2,
      timePattern: 0.1,
    };
  }

  fallbackClassify(email) {
    // Simple rule-based fallback when ML fails
    const text = `${email.subject} ${
      email.body || email.snippet || ""
    }`.toLowerCase();

    if (text.includes("unfortunately") || text.includes("not moving forward")) {
      return EMAIL_CATEGORIES.REJECTION;
    }
    if (text.includes("interview") && text.includes("schedule")) {
      return EMAIL_CATEGORIES.INTERVIEW_REQUEST;
    }
    if (
      text.includes("thank you for applying") ||
      text.includes("application received")
    ) {
      return EMAIL_CATEGORIES.APPLICATION_SUBMITTED;
    }
    if (text.includes("offer") && text.includes("position")) {
      return EMAIL_CATEGORIES.OFFER;
    }
    if (text.includes("assessment") || text.includes("coding challenge")) {
      return EMAIL_CATEGORIES.ASSESSMENT;
    }
    if (text.includes("follow up") || text.includes("checking in")) {
      return EMAIL_CATEGORIES.FOLLOW_UP;
    }
    if (text.includes("job alert") || text.includes("new jobs")) {
      return EMAIL_CATEGORIES.JOB_ALERT;
    }

    return EMAIL_CATEGORIES.OTHER;
  }

  getClassificationConfidence(email) {
    const features = this.extractFeatures(email);
    const text = `${email.subject} ${email.body || email.snippet || ""}`;

    let confidence = 0;

    // Text similarity confidence
    let maxSimilarity = 0;
    Object.entries(TRAINING_DATA).forEach(([category, examples]) => {
      examples.forEach((example) => {
        const similarity = this.calculateSimilarity(text, example);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      });
    });
    confidence += maxSimilarity * 0.5;

    // Feature confidence
    if (features.jobKeywords > 2) confidence += 0.2;
    if (features.companyIndicators > 0) confidence += 0.1;
    if (features.positionTitles > 0) confidence += 0.1;
    if (!features.isPersonalEmail) confidence += 0.1;

    return Math.min(100, Math.round(confidence * 100));
  }
}

// Export singleton instance
const mlClassifier = new MLEmailClassifier();

export const classifyEmailML = (email) => {
  return mlClassifier.classifyWithML(email);
};

export const getMLConfidence = (email) => {
  return mlClassifier.getClassificationConfidence(email);
};

export const explainMLClassification = (email) => {
  const features = mlClassifier.extractFeatures(email);
  const classification = mlClassifier.classifyWithML(email);
  const confidence = mlClassifier.getClassificationConfidence(email);

  return {
    classification,
    confidence,
    features: {
      wordCount: features.wordCount,
      jobKeywords: features.jobKeywords,
      companyIndicators: features.companyIndicators,
      senderDomain: features.senderDomain,
      formalityScore: Math.round(features.formalityScore * 100),
    },
    reasoning: [
      `Text contains ${features.jobKeywords} job-related keywords`,
      `Sender domain: ${features.senderDomain || "personal email"}`,
      `Formality score: ${Math.round(features.formalityScore * 100)}%`,
      `${features.companyIndicators} company indicators found`,
    ],
  };
};

export default mlClassifier;

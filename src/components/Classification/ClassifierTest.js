// src/components/Classification/ClassifierTest.js
import {
  robustClassifyEmail,
  explainRobustClassification,
} from "./RobustEmailClassifier";
import { EMAIL_CATEGORIES } from "./Categories";

/**
 * Test cases based on your real examples
 */
const TEST_CASES = [
  {
    name: "Tyler Technologies Rejection",
    email: {
      id: "test1",
      subject:
        "Your application for Software Engineer, .NET at Tyler Technologies",
      from: "Tyler Technologies Recruiting Team <reply@careers.tylertech.com>",
      body: "Hi Sai Prudhvi Charan, Thank you for taking the time to apply with us at Tyler Technologies. After careful consideration of your background and experience, we won't be moving forward with your application for the role of Software Engineer, .NET at this time. If you've applied for other positions, that's great! Our recruiting team reviews each application separately, so if we think you might be a match for another role, we'll definitely let you know. We appreciate your interest in us and wish you every success.",
    },
    expected: EMAIL_CATEGORIES.REJECTION,
    currentWrong: EMAIL_CATEGORIES.APPLICATION_SUBMITTED,
  },

  {
    name: "American Express Job Alert",
    email: {
      id: "test2",
      subject: "Job Posting Notification at American Express",
      from: "Amex Recruiting <Amex_Recruiting_AXP@invalidemail.com>",
      body: "Dear Sai Prudhvi Charan Pothumsetty: The position of Engineer -25009054, which matches your indicated preferences on your profile, has just been opened and posted on our Career site. To review the job description and qualification, please click here. If you believe your credentials meet the necessary requirements for this position, please complete our online application process using the above link. In order to be considered for this position, you must fully complete and e-sign your online application. If you would like to view other available positions, click Jobs. If you would like to update your job preferences, please review your profile. If you do not wish to receive further job posting notifications,",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.FOLLOW_UP,
  },

  {
    name: "Glassdoor Job Alert",
    email: {
      id: "test3",
      subject:
        "Job at Tyler Technologies,JE Dunn is still available. Apply Soon.",
      from: "Glassdoor <noreply@glassdoor.com>",
      body: "See all of your recently viewed jobs, saved jobs, and more Your job activity Hey Sai Prudhvi Charan Pick up your job search where you left off and explore interview tips from the community. Your recently viewed jobs Software Engineer, .NET Tyler Technologies 3.7 Software Engineer, .NET Overland Park, KS Google Application Developer JE Dunn 4.4 Google Application Developer Kansas City, MO 69K - 101K (Glassdoor est.) Jobs you might like Senior Web Developer eCommerce Specialist Shaman Pharma Senior Web Developer eCommerce Specialist Kansas City, MO 50K (Employer est.) Easy Apply Software Engineer Athlon Optics Software Engineer Lenexa, KS 70K - 100K (Employer est.) Easy Apply Software Engineer - AIML SeedTrust LLC Software Engineer - AIML United States 100K - 120K (Employer est.) Easy Apply Principal Cloud Engineer...",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.INTERVIEW_REQUEST,
  },

  {
    name: "Pennington County Job List",
    email: {
      id: "test4",
      subject: "Pennington County Job List Update",
      from: "Sage Nichols <sage-nichols-pennington@m.attract.governmentjobs.com>",
      body: "Hello Sai Prudhvi Charan! My name is Sage with Pennington County HR, here with your weekly look at our latest job opportunities with Pennington County! If you're looking for a career with great benefits, excellent retirement plans, and the chance to grow in the beautiful Black Hills, we'd love for you to take a look. Below are our newest job opportunities and the link to our full list This Week's Newest Job Openings: 247 Technician Lead Electrician Lead Plumber You can explore these and all current job openings here: View Current Job Openings If you have any questions, please feel free to reach out to me! Best, Sage Nichols Pennington County HR",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.OFFER,
  },

  {
    name: "Upward Recruiting Outreach",
    email: {
      id: "test5",
      subject:
        "Sai Prudhvi Charan, are you interested in working for Milton Hershey School?",
      from: "Upward <jobs@upward.careers>",
      body: "Hi Sai Prudhvi Charan, My name is Stephanie Clark from Upward and I'm here to help you find a job. Varsity Brands is hiring a Senior Backend Developer near Dallas, TX 75202 and there might be a fit for you. To see compensation details, as well as job responsibilities and qualifications, please click on the link below. Thanks for your consideration. Senior Backend Developer @ Varsity Brands Regards, Stephanie Clark Hiring Specialist at Upward You are receiving Upward Job Alert emails.",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.INTERVIEW_REQUEST,
  },

  {
    name: "Wellfound Job Alert",
    email: {
      id: "test6",
      subject: "Here are 1 new jobs you'd be a great fit for",
      from: '"Wellfound (formerly AngelList Talent)" <team@hi.wellfound.com>',
      body: "Can't see this email? View in Your Browser Your job search status: Interview ready Open Closed Hi, Sai! We found 1 new job that might interest you. Check them out! Doss Give your operators superpowers Staff Frontend Engineer San Francisco 200-300k Full-time Don't see something you're looking for? You can always update your preferences if they've changed this will help us send you the most relevant job recommendations possible. Refer Earn Spread the opportunity! Refer friends and receive 200 for every hire made through your unique referral link.. You're receiving this notification because you're looking for jobs on Wellfound",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.INTERVIEW_REQUEST,
  },

  {
    name: "Dice Career Newsletter",
    email: {
      id: "test7",
      subject:
        "What Tech Job Is Right for You? Matching Your Skills to Market Demand.",
      from: "Dice <dice@connect.dice.com>",
      body: "First Job, Smart Job: How to Choose a Role That Grows with You Sign in to Dice Get Career Advice May 24, 2025 This week we dive into matching your tech skills with the current employment market, a new certification from CompTIA, and more. Let's dive in! Job Hunting Insights What Tech Job Is Right for You? Matching Your Skills to Market Demand. Congratulations, recent graduate! You're obtained your degree and you're ready to embark on your professional journey. But with so many tech roles out there, how do you pinpoint the tech job that truly aligns with your unique blend of skills, interests, and career aspirations? Save time job hunting. Check out these Software Engineer jobs based on your profile: Software Engineer Jack Henry Associates Birmingham, Alabama, USA or Remote Posted 04-10-2025 Senior Front End Software Engineer",
    },
    expected: EMAIL_CATEGORIES.JOB_ALERT,
    currentWrong: EMAIL_CATEGORIES.OFFER,
  },
];

/**
 * Run comprehensive test suite
 */
export const runClassifierTests = () => {
  console.log("🧪 Running Email Classifier Tests");
  console.log("=".repeat(50));

  let passed = 0;
  let failed = 0;
  const results = [];

  TEST_CASES.forEach((testCase, index) => {
    const prediction = robustClassifyEmail(testCase.email);
    const explanation = explainRobustClassification(testCase.email);
    const isCorrect = prediction === testCase.expected;

    if (isCorrect) {
      passed++;
    } else {
      failed++;
    }

    const result = {
      testName: testCase.name,
      expected: testCase.expected,
      predicted: prediction,
      previousWrong: testCase.currentWrong,
      correct: isCorrect,
      confidence: explanation.confidence,
      reasons: explanation.reasons,
      subject: testCase.email.subject.substring(0, 50) + "...",
      sender: testCase.email.from,
    };

    results.push(result);

    // Log individual test result
    console.log(`\n📧 Test ${index + 1}: ${testCase.name}`);
    console.log(`Subject: ${testCase.email.subject}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Predicted: ${prediction} ${isCorrect ? "✅" : "❌"}`);
    console.log(`Previously: ${testCase.currentWrong} (was wrong)`);
    console.log(`Confidence: ${explanation.confidence}%`);
    console.log(`Reasons: ${explanation.reasons.join("; ")}`);

    return {
      classification: prediction,
      confidence: explanation.confidence,
      explanation: explanation.reasons,
      email: {
        subject: email.subject,
        from: email.from,
        snippet: (email.body || email.snippet || "").substring(0, 100) + "...",
      },
    };
  });
};

/**
 * Performance benchmark
 */
export const benchmarkClassifier = (emails) => {
  console.log("⏱️ Running Performance Benchmark");

  const startTime = Date.now();
  const results = emails.map((email) => robustClassifyEmail(email));
  const endTime = Date.now();

  const totalTime = endTime - startTime;
  const avgTime = totalTime / emails.length;
  const emailsPerSecond = Math.round((emails.length / totalTime) * 1000);

  console.log(`📊 Performance Results:`);
  console.log(`Total emails: ${emails.length}`);
  console.log(`Total time: ${totalTime}ms`);
  console.log(`Average time per email: ${avgTime.toFixed(2)}ms`);
  console.log(`Emails per second: ${emailsPerSecond}`);

  return {
    totalEmails: emails.length,
    totalTime,
    averageTime: avgTime,
    emailsPerSecond,
    results,
  };
};

/**
 * Confidence distribution analysis
 */
export const analyzeConfidenceDistribution = (emails) => {
  console.log("📈 Analyzing Confidence Distribution");

  const confidenceScores = emails.map((email) => {
    const classification = robustClassifyEmail(email);
    const explanation = explainRobustClassification(email);
    return {
      email: email.subject.substring(0, 30),
      classification,
      confidence: explanation.confidence,
    };
  });

  // Group by confidence ranges
  const ranges = {
    high: confidenceScores.filter((s) => s.confidence >= 80).length,
    medium: confidenceScores.filter(
      (s) => s.confidence >= 50 && s.confidence < 80
    ).length,
    low: confidenceScores.filter((s) => s.confidence < 50).length,
  };

  console.log("Confidence Distribution:");
  console.log(
    `High (80-100%): ${ranges.high} emails (${Math.round(
      (ranges.high / emails.length) * 100
    )}%)`
  );
  console.log(
    `Medium (50-79%): ${ranges.medium} emails (${Math.round(
      (ranges.medium / emails.length) * 100
    )}%)`
  );
  console.log(
    `Low (0-49%): ${ranges.low} emails (${Math.round(
      (ranges.low / emails.length) * 100
    )}%)`
  );

  return ranges;
};

/**
 * Category distribution analysis
 */
export const analyzeCategoryDistribution = (emails) => {
  console.log("📊 Analyzing Category Distribution");

  const categoryCount = {};
  Object.values(EMAIL_CATEGORIES).forEach((category) => {
    categoryCount[category] = 0;
  });

  emails.forEach((email) => {
    const classification = robustClassifyEmail(email);
    categoryCount[classification]++;
  });

  console.log("Category Distribution:");
  Object.entries(categoryCount).forEach(([category, count]) => {
    const percentage = Math.round((count / emails.length) * 100);
    console.log(`${category}: ${count} emails (${percentage}%)`);
  });

  return categoryCount;
};

/**
 * Export test utilities
 */
export const createTestEmail = (subject, from, body) => {
  return {
    id: Date.now().toString(),
    subject,
    from,
    body,
    snippet: body.substring(0, 150),
    date: new Date().toISOString(),
  };
};

/**
 * Regression test to ensure fixes don't break existing functionality
 */
export const runRegressionTests = () => {
  console.log("🔄 Running Regression Tests");

  const regressionCases = [
    // Basic application submitted
    createTestEmail(
      "Application Received - Software Engineer",
      "careers@company.com",
      "Thank you for your application. We have received your resume and will review it shortly."
    ),

    // Basic interview request
    createTestEmail(
      "Interview Invitation - Developer Role",
      "hr@techcorp.com",
      "We would like to schedule an interview with you for the Developer position. Please let us know your availability."
    ),

    // Basic rejection
    createTestEmail(
      "Update on your application",
      "recruiting@startup.com",
      "Unfortunately, we have decided to move forward with other candidates at this time."
    ),

    // Basic offer
    createTestEmail(
      "Job Offer - Senior Engineer",
      "ceo@company.com",
      "We are pleased to offer you the position of Senior Engineer with a salary of $120,000."
    ),

    // Basic assessment
    createTestEmail(
      "Technical Assessment",
      "tech@company.com",
      "Please complete this coding challenge as the next step in our interview process."
    ),
  ];

  const expectedResults = [
    EMAIL_CATEGORIES.APPLICATION_SUBMITTED,
    EMAIL_CATEGORIES.INTERVIEW_REQUEST,
    EMAIL_CATEGORIES.REJECTION,
    EMAIL_CATEGORIES.OFFER,
    EMAIL_CATEGORIES.ASSESSMENT,
  ];

  let regressionPassed = 0;
  regressionCases.forEach((email, index) => {
    const prediction = robustClassifyEmail(email);
    const expected = expectedResults[index];
    const correct = prediction === expected;

    if (correct) {
      regressionPassed++;
    }

    console.log(
      `Regression ${index + 1}: ${
        correct ? "✅" : "❌"
      } (${prediction} vs ${expected})`
    );
  });

  console.log(
    `Regression Tests: ${regressionPassed}/${regressionCases.length} passed`
  );
  return regressionPassed === regressionCases.length;
};

// Export all test functions
export default {
  runClassifierTests,
  testSingleEmail,
  benchmarkClassifier,
  analyzeConfidenceDistribution,
  analyzeCategoryDistribution,
  createTestEmail,
  runRegressionTests,
  TEST_CASES,
};

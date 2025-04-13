// src/services/summarizationService.js

// A simpler approach that doesn't rely on external libraries
export const summarizeEmail = (emailBody) => {
  if (!emailBody || typeof emailBody !== "string") {
    return "No content available for this email.";
  }

  try {
    // Clean the text
    const cleanText = emailBody
      .replace(/\s+/g, " ")
      .replace(/(\r\n|\n|\r)/gm, " ")
      .trim();

    // If text is very short, return as is
    if (cleanText.length < 200) {
      return cleanText;
    }

    // Split into sentences
    const sentences = splitIntoSentences(cleanText);

    // If only a few sentences, return all
    if (sentences.length <= 3) {
      return cleanText;
    }

    // Extract important sentences based on keywords
    const jobRelatedKeywords = [
      "application",
      "interview",
      "position",
      "opportunity",
      "job",
      "role",
      "thank",
      "resume",
      "cv",
      "hiring",
      "candidate",
      "qualification",
      "experience",
      "skill",
      "background",
      "team",
      "schedule",
      "meet",
      "process",
      "next steps",
      "assessment",
      "test",
      "challenge",
      "offer",
      "salary",
      "compensation",
      "benefits",
      "start",
      "date",
      "onboarding",
    ];

    // Score sentences by keyword occurrences and position
    const scoredSentences = sentences.map((sentence, index) => {
      // Prefer sentences at the beginning
      const positionScore = index < 3 ? 3 - index : 0;

      // Count relevant keywords
      const keywordScore = jobRelatedKeywords.reduce((score, keyword) => {
        return score + (sentence.toLowerCase().includes(keyword) ? 1 : 0);
      }, 0);

      // Prefer medium-length sentences
      const lengthScore = sentence.length > 20 && sentence.length < 200 ? 1 : 0;

      return {
        sentence,
        score: positionScore + keywordScore * 2 + lengthScore,
        index,
      };
    });

    // Get top 3 sentences by score, then sort by original position
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index)
      .map((item) => item.sentence);

    return topSentences.join(" ");
  } catch (error) {
    console.error("Error summarizing email:", error);
    // Return the first 150 characters as a fallback
    return emailBody.substring(0, 150) + (emailBody.length > 150 ? "..." : "");
  }
};

// Helper function to split text into sentences
function splitIntoSentences(text) {
  // Basic sentence splitting regex - handles periods, question marks, exclamation points
  const sentenceDelimiters = /[.!?](?:\s+|$)/;
  const sentences = text
    .split(sentenceDelimiters)
    .filter((sentence) => sentence.trim().length > 0)
    .map((sentence) => sentence.trim());

  return sentences;
}

import { WordTokenizer, SentenceTokenizer } from "natural";

const wordTokenizer = new WordTokenizer();
const sentenceTokenizer = new SentenceTokenizer();

export const summarizeEmail = (emailBody) => {
  try {
    // Clean the text
    const cleanText = emailBody.replace(/\s+/g, " ").trim();

    // Split into sentences
    const sentences = sentenceTokenizer.tokenize(cleanText);

    // If text is short, return as is
    if (sentences.length <= 3) {
      return cleanText;
    }

    // Calculate word frequency
    const words = wordTokenizer.tokenize(cleanText.toLowerCase());
    const wordFreq = {};
    words.forEach((word) => {
      if (word.length > 3) {
        // ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences based on word frequency
    const sentenceScores = sentences.map((sentence) => {
      const sentenceWords = wordTokenizer.tokenize(sentence.toLowerCase());
      const score = sentenceWords.reduce(
        (acc, word) => acc + (wordFreq[word] || 0),
        0
      );
      return { sentence, score: score / sentenceWords.length };
    });

    // Get top 3 sentences
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.sentence);

    return topSentences.join(" ");
  } catch (error) {
    console.error("Error summarizing email:", error);
    return emailBody.substring(0, 200) + "..."; // Fallback to simple truncation
  }
};

// src/services/storageService.js
const STORAGE_KEY = "job_application_tracker_data";

export const saveProcessedEmails = (emails) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

export const getProcessedEmails = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const clearStoredEmails = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

import type { TeamSession, Question } from '../types/game';

const LOCAL_SESSION_KEY = 'web_of_doom_active_session';
const LOCAL_QUESTIONS_KEY = 'web_of_doom_custom_questions';
const DEVICE_TOKEN_KEY = 'web_of_doom_device_token';

export function getDeviceToken(): string {
  let token = localStorage.getItem(DEVICE_TOKEN_KEY);
  if (!token) {
    token = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  }
  return token;
}

export function saveLocalSession(session: TeamSession): void {
  try {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session locally', e);
  }
}

export function getLocalSession(): TeamSession | null {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse local session', e);
    return null;
  }
}

export function clearLocalSession(): void {
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

export function saveCustomQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save custom questions', e);
  }
}

export function getCustomQuestions(): Question[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

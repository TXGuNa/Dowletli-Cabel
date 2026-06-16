// Stores Contact messages and Booking requests submitted on the website.
//
// NOTE: With no backend, submissions are saved in the visitor's browser
// (localStorage) and are visible in the admin panel ON THE SAME BROWSER/DEVICE.
// To collect leads from every visitor across devices, forward submissions to a
// backend or a form service — do that inside `addSubmission` (a single place).

export interface ContactSubmission {
  id: string;
  type: 'contact';
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface BookingSubmission {
  id: string;
  type: 'booking';
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  createdAt: number;
  read: boolean;
}

export type Submission = ContactSubmission | BookingSubmission;

const KEY = 'dowletli_submissions_v1';
export const SUBMISSIONS_EVENT = 'dowletli-submissions';

export function loadSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Submission[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function persist(list: Submission[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(SUBMISSIONS_EVENT));
  } catch {
    /* ignore */
  }
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addSubmission(
  input:
    | Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>
    | Omit<BookingSubmission, 'id' | 'createdAt' | 'read'>,
): Submission {
  const sub = { ...input, id: makeId(), createdAt: Date.now(), read: false } as Submission;
  const list = loadSubmissions();
  list.unshift(sub);
  persist(list);
  return sub;
}

export function markRead(id: string, read = true) {
  persist(loadSubmissions().map((s) => (s.id === id ? { ...s, read } : s)));
}

export function deleteSubmission(id: string) {
  persist(loadSubmissions().filter((s) => s.id !== id));
}

export function clearSubmissions() {
  persist([]);
}

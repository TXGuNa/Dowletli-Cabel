// Contact messages and Booking requests submitted on the website.
//
// Submissions are sent to the server (/api/submissions, stored in Cloudflare KV)
// so the admin sees every visitor's request in the panel, from any device.

import {
  fetchSubmissions, removeAllSubmissions, removeSubmission, sendSubmission, setSubmissionRead,
} from './api';

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

// Public site: send a form. Resolves on success, throws if it could not be delivered.
export async function addSubmission(
  input:
    | Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>
    | Omit<BookingSubmission, 'id' | 'createdAt' | 'read'>,
): Promise<void> {
  await sendSubmission(input as unknown as Record<string, string>);
}

// Admin panel helpers
export const loadSubmissions = () => fetchSubmissions<Submission>();
export const markRead = (id: string, read = true) => setSubmissionRead(id, read);
export const deleteSubmission = (id: string) => removeSubmission(id);
export const clearSubmissions = () => removeAllSubmissions();

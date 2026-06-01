import type { DayScheduleItem, WeddingDayKey } from '../types';
import { adminRequest } from './adminApi';

export type DaySchedulePayload = {
  dayKey: WeddingDayKey;
  startTime: string;
  endTime?: string;
  title: string;
  location?: string;
  notes?: string;
};

export function getAdminDaySchedule(token: string) {
  return adminRequest<DayScheduleItem[]>(token, '/api/admin/day-schedule');
}

export function createAdminDayScheduleItem(token: string, payload: DaySchedulePayload) {
  return adminRequest<DayScheduleItem>(token, '/api/admin/day-schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateAdminDayScheduleItem(token: string, id: string, payload: DaySchedulePayload) {
  return adminRequest<DayScheduleItem>(token, `/api/admin/day-schedule/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminDayScheduleItem(token: string, id: string) {
  return adminRequest<void>(token, `/api/admin/day-schedule/${id}`, {
    method: 'DELETE',
  });
}

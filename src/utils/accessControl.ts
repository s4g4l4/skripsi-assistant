export interface UserAccessInfo {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  trialStartedAt: number; // timestamp in ms
  trialDurationHours: number; // duration in hours (default 5)
  accessGrantedUntil: number; // timestamp in ms
  accessStatus: 'active' | 'unlimited' | 'cancelled' | 'expired';
}

export const ADMIN_EMAIL = 'febricase@gmail.com';
export const ADMIN_NAME = 'Febri (Admin Dukun Skripsi)';
export const ADMIN_WA_NUMBER = '0895405247374';
export const ADMIN_WA_LINK = `https://wa.me/62895405247374?text=${encodeURIComponent('Halo Admin Dukun Skripsi, masa aktif gratis 7 hari untuk akun saya telah habis. Mohon perpanjang masa pakai akun saya.')}`;

export const FREE_TRIAL_DAYS = 7;
export const FREE_TRIAL_HOURS = 168; // 7 * 24
export const FREE_TRIAL_MS = FREE_TRIAL_HOURS * 3600 * 1000;

export function isCampusEmail(email: string): boolean {
  if (!email) return false;
  const domain = email.toLowerCase().split('@')[1] || '';
  return domain.endsWith('.ac.id') || domain.endsWith('.edu') || domain.includes('.ac.id') || domain.includes('.edu');
}

const DEFAULT_USERS_KEY = 'dukun_skripsi_all_users_v2';
const CURRENT_USER_KEY = 'user_info';

// Initialize default users if not present
export function getStoredUsers(): UserAccessInfo[] {
  const now = Date.now();
  const defaultAjeng: UserAccessInfo = {
    id: 'user-ajeng-01',
    name: 'Ajeng Maharani',
    email: 'ajengmaharani@gmail.com',
    role: 'user',
    trialStartedAt: now,
    trialDurationHours: FREE_TRIAL_HOURS,
    accessGrantedUntil: now + FREE_TRIAL_MS,
    accessStatus: 'active'
  };

  try {
    const raw = localStorage.getItem(DEFAULT_USERS_KEY);
    if (raw) {
      const users: UserAccessInfo[] = JSON.parse(raw);
      return users;
    }
  } catch (e) {
    console.error('Failed to parse stored users:', e);
  }

  // Default seed users
  const seedUsers: UserAccessInfo[] = [
    {
      id: 'admin-01',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      trialStartedAt: now,
      trialDurationHours: 999999,
      accessGrantedUntil: now + 999999 * 3600 * 1000,
      accessStatus: 'unlimited'
    },
    defaultAjeng,
    {
      id: 'user-analysis-01',
      name: 'User Uji Coba Analysis',
      email: 'analysis@dukunskripsi.id',
      role: 'user',
      trialStartedAt: now,
      trialDurationHours: FREE_TRIAL_HOURS,
      accessGrantedUntil: now + FREE_TRIAL_MS,
      accessStatus: 'active'
    }
  ];

  localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(seedUsers));
  return seedUsers;
}

export function registerOrUpdateUserAccess(user: UserAccessInfo) {
  // Check if campus email
  if (user.email && isCampusEmail(user.email) && user.role !== 'admin') {
    user.accessStatus = 'unlimited';
    user.trialDurationHours = 999999;
    user.accessGrantedUntil = Date.now() + 999999 * 3600 * 1000;
  }

  const allUsers = getStoredUsers();
  const index = allUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    allUsers[index] = { ...allUsers[index], ...user };
  } else {
    allUsers.push(user);
  }
  saveStoredUsers(allUsers);
}

export function saveStoredUsers(users: UserAccessInfo[]) {
  localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserAccess(): UserAccessInfo {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // If user is admin
      if (parsed.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || parsed.role === 'admin') {
        return {
          id: parsed.id || 'admin-01',
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: 'admin',
          trialStartedAt: parsed.trialStartedAt || Date.now(),
          trialDurationHours: 999999,
          accessGrantedUntil: Date.now() + 999999 * 3600 * 1000,
          accessStatus: 'unlimited'
        };
      }

      // Sync with global users list if exists
      const allUsers = getStoredUsers();
      const existingInAll = allUsers.find(u => u.email.toLowerCase() === parsed.email?.toLowerCase());

      if (existingInAll) {
        return existingInAll;
      }

      // If new logged in regular user without trialStartedAt
      const now = Date.now();
      const userEmail = parsed.email || 'user@dukunskripsi.id';
      const isCampus = isCampusEmail(userEmail);

      const newAccess: UserAccessInfo = {
        id: parsed.id || `user-${Date.now()}`,
        name: parsed.name || 'User Dukun Skripsi',
        email: userEmail,
        role: 'user',
        trialStartedAt: parsed.trialStartedAt || now,
        trialDurationHours: isCampus ? 999999 : (parsed.trialDurationHours || FREE_TRIAL_HOURS),
        accessGrantedUntil: isCampus ? (now + 999999 * 3600 * 1000) : (parsed.accessGrantedUntil || (now + FREE_TRIAL_MS)),
        accessStatus: isCampus ? 'unlimited' : (parsed.accessStatus || 'active')
      };

      // Save into global list
      allUsers.push(newAccess);
      saveStoredUsers(allUsers);
      return newAccess;
    }
  } catch (e) {
    console.error('Error getting current user access:', e);
  }

  // Default fallback user
  const now = Date.now();
  return {
    id: 'user-default',
    name: 'User Uji Coba Analysis',
    email: 'analysis@dukunskripsi.id',
    role: 'user',
    trialStartedAt: now,
    trialDurationHours: FREE_TRIAL_HOURS,
    accessGrantedUntil: now + FREE_TRIAL_MS,
    accessStatus: 'active'
  };
}

export function isAccessValid(user: UserAccessInfo): boolean {
  if (user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true; // Admin always has full access
  }

  if (user.accessStatus === 'cancelled' || user.accessStatus === 'expired') {
    return false;
  }

  if (user.accessStatus === 'unlimited') {
    return true;
  }

  // Check timestamp
  const now = Date.now();
  return now < user.accessGrantedUntil;
}

export function getRemainingTimeString(user: UserAccessInfo): string {
  if (user.role === 'admin' || user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return 'Akses Admin (Akses Penuh)';
  }

  if (isCampusEmail(user.email)) {
    return 'Mail Kampus (Gratis Selamanya)';
  }

  if (user.accessStatus === 'cancelled') {
    return 'Akses Dibatalkan';
  }

  if (user.accessStatus === 'unlimited') {
    return 'Gratis Selamanya (Unlimited)';
  }

  const now = Date.now();
  const diffMs = user.accessGrantedUntil - now;

  if (diffMs <= 0) {
    return 'Masa Aktif 7 Hari Berakhir';
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} Hari ${hours} Jam Tersisa`;
  }
  if (hours > 0) {
    return `${hours} Jam ${minutes} Menit Tersisa`;
  }
  return `${minutes} Menit Tersisa`;
}

export function adjustUserAccessTime(
  userEmail: string,
  adjustment: { hours?: number; days?: number; action: 'add' | 'reduce' }
) {
  const allUsers = getStoredUsers();
  const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());

  if (userIndex === -1) return;

  const target = allUsers[userIndex];
  const now = Date.now();

  let deltaMs = 0;
  if (adjustment.hours) deltaMs += Math.abs(adjustment.hours) * 3600 * 1000;
  if (adjustment.days) deltaMs += Math.abs(adjustment.days) * 24 * 3600 * 1000;

  if (adjustment.action === 'reduce') {
    deltaMs = -deltaMs;
  }

  // Base time calculation
  let baseTime = target.accessGrantedUntil;
  if (target.accessStatus === 'unlimited') {
    baseTime = now;
  } else if (target.accessGrantedUntil < now || target.accessStatus !== 'active') {
    baseTime = now;
  }

  const newTime = baseTime + deltaMs;

  if (newTime <= now) {
    target.accessGrantedUntil = now;
    target.accessStatus = 'expired';
  } else {
    target.accessGrantedUntil = newTime;
    target.accessStatus = 'active';
  }

  allUsers[userIndex] = target;
  saveStoredUsers(allUsers);

  // If editing currently logged in user, update current user_info as well
  const current = getCurrentUserAccess();
  if (current.email.toLowerCase() === userEmail.toLowerCase()) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));
  }
}

export function extendUserAccess(userEmail: string, durationToAdd: { hours?: number; days?: number; unlimited?: boolean }) {
  const allUsers = getStoredUsers();
  const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());

  if (userIndex === -1) return;

  const target = allUsers[userIndex];
  const now = Date.now();

  if (durationToAdd.unlimited) {
    target.accessStatus = 'unlimited';
    target.accessGrantedUntil = now + 999999 * 3600 * 1000;
  } else {
    let addedMs = 0;
    if (durationToAdd.hours) addedMs += durationToAdd.hours * 3600 * 1000;
    if (durationToAdd.days) addedMs += durationToAdd.days * 24 * 3600 * 1000;

    // Base extension from current time or existing valid until
    const baseTime = (target.accessGrantedUntil > now && target.accessStatus === 'active')
      ? target.accessGrantedUntil
      : now;

    target.accessGrantedUntil = baseTime + addedMs;
    target.accessStatus = 'active';
  }

  allUsers[userIndex] = target;
  saveStoredUsers(allUsers);

  // If editing currently logged in user, update current user_info as well
  const current = getCurrentUserAccess();
  if (current.email.toLowerCase() === userEmail.toLowerCase()) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));
  }
}

export function revokeUserAccess(userEmail: string) {
  const allUsers = getStoredUsers();
  const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === userEmail.toLowerCase());

  if (userIndex === -1) return;

  allUsers[userIndex].accessStatus = 'cancelled';
  allUsers[userIndex].accessGrantedUntil = Date.now();
  saveStoredUsers(allUsers);

  const current = getCurrentUserAccess();
  if (current.email.toLowerCase() === userEmail.toLowerCase()) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(allUsers[userIndex]));
  }
}

export function deleteUserAccount(userEmail: string) {
  if (!userEmail) return;
  const targetEmail = userEmail.trim().toLowerCase();
  
  if (targetEmail === ADMIN_EMAIL.toLowerCase()) {
    console.warn('Cannot delete admin account');
    return; // Admin account cannot be deleted
  }

  const allUsers = getStoredUsers();
  const filtered = allUsers.filter(u => u.email.trim().toLowerCase() !== targetEmail);
  saveStoredUsers(filtered);

  // If deleted user is currently logged in, clear user session
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email?.trim().toLowerCase() === targetEmail) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  } catch (e) {
    console.error('Error clearing deleted user session:', e);
  }

  // Dispatch custom storage event for instant UI update across components
  window.dispatchEvent(new Event('storage'));
}

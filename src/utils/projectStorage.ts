import { ThesisData } from './thesisGenerator';
import { getCurrentUserAccess } from './accessControl';

export interface UserProjectItem {
  id: string;
  userEmail: string;
  title: string;
  documentType: string;
  universityName: string;
  status: string;
  progress: number;
  updatedAt: string;
  thesisData: ThesisData;
}

const STORAGE_KEY = 'user_thesis_projects_list';

export function getUserProjects(userEmail?: string, isAdmin: boolean = false): UserProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let allProjects: UserProjectItem[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          allProjects = parsed;
        }
      } catch {
        allProjects = [];
      }
    }

    // Fallback: If no projects in STORAGE_KEY yet, but active_thesis_data exists, convert it
    if (allProjects.length === 0) {
      const activeRaw = localStorage.getItem('active_thesis_data');
      if (activeRaw) {
        try {
          const activeThesis: ThesisData = JSON.parse(activeRaw);
          if (activeThesis && typeof activeThesis === 'object') {
            const currentUser = userEmail || getCurrentUserAccess().email;
            const fallbackProject: UserProjectItem = {
              id: activeThesis.id || 'thesis_' + Date.now(),
              userEmail: currentUser,
              title: activeThesis.research?.title || 'Draft Penelitian Utama',
              documentType: activeThesis.documentType || 'Skripsi',
              universityName: activeThesis.university?.name || 'Universitas Indonesia',
              status: 'Draf Proposal',
              progress: 35,
              updatedAt: activeThesis.updatedAt || new Date().toISOString(),
              thesisData: activeThesis,
            };
            allProjects = [fallbackProject];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
          }
        } catch {}
      }
    }

    if (isAdmin) {
      return Array.isArray(allProjects) ? allProjects : [];
    }

    const currentEmail = (userEmail || getCurrentUserAccess().email).toLowerCase();
    return (Array.isArray(allProjects) ? allProjects : []).filter(p => (p?.userEmail || '').toLowerCase() === currentEmail);
  } catch (e) {
    console.error('Error reading user projects from localStorage', e);
    return [];
  }
}

export function saveUserProject(thesis: ThesisData): UserProjectItem {
  const currentUser = getCurrentUserAccess().email;
  const raw = localStorage.getItem(STORAGE_KEY);
  let allProjects: UserProjectItem[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) allProjects = parsed;
    } catch {}
  }

  const existingIndex = allProjects.findIndex(p => p.id === thesis.id);
  const projectItem: UserProjectItem = {
    id: thesis.id,
    userEmail: currentUser,
    title: thesis.research?.title || 'Tanpa Judul Penelitian',
    documentType: thesis.documentType || 'Skripsi',
    universityName: thesis.university?.name || 'Universitas Indonesia',
    status: 'Draf Proposal',
    progress: 45,
    updatedAt: new Date().toISOString(),
    thesisData: thesis,
  };

  if (existingIndex >= 0) {
    allProjects[existingIndex] = {
      ...allProjects[existingIndex],
      ...projectItem,
      progress: allProjects[existingIndex].progress || 45,
    };
  } else {
    allProjects.unshift(projectItem);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
  localStorage.setItem('active_thesis_data', JSON.stringify(thesis));
  return projectItem;
}

export function deleteUserProject(projectId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const allProjects: UserProjectItem[] = Array.isArray(parsed) ? parsed : [];
    const filtered = allProjects.filter(p => p && p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting user project:', e);
  }
}

export function openUserProject(projectId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const allProjects: UserProjectItem[] = Array.isArray(parsed) ? parsed : [];
    const found = allProjects.find(p => p && p.id === projectId);
    if (found && found.thesisData) {
      localStorage.setItem('active_thesis_data', JSON.stringify(found.thesisData));
    }
  } catch (e) {
    console.error('Error opening user project:', e);
  }
}

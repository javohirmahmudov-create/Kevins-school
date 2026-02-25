// lib/storage.ts
// Kevin's Academy Local Storage Management

/** Student interface */
export interface Student {
  id: string;
  fullName: string;
  role?: 'student';
  username?: string;
  password?: string;
  email: string;
  phone: string;
  group: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Group interface */
export interface Group {
  id: string;
  name: string;
  description: string;
  teacher: string;
  schedule: string;
  maxStudents: number;
  level?: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced';
  studentCount?: number;
  createdAt: string;
}

/** Material interface */
export interface Material {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  group: string;
  uploadedBy: string;
  uploadedAt: string;
  dueDate?: string;
}

/** Score interface */
export interface Score extends Record<string, number | string | undefined> {
  id: string;
  studentName: string;
  createdAt: string;
}

/** Attendance interface */
export interface Attendance {
  id: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  group: string;
}

/** Payment interface */
export interface Payment {
  id: string;
  studentName: string;
  amount: number;
  month: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

/** Parent interface */
export interface Parent {
  id: string;
  fullName: string;
  role?: 'parent';
  email: string;
  phone: string;
  username?: string;
  password?: string;
  studentId: string;
  createdAt: string;
}

/** Admin interface */
export interface Admin {
  id: string;
  role?: 'admin';
  username: string;
  password: string;
  fullName: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export type AuthRole = 'admin' | 'student' | 'parent';

/** AdminStorage Class */
export class AdminStorage {
  // 🔹 Demo admin va student/parent yaratish
  ensureDemoAdmins(): void {
    if (typeof window === 'undefined') return;

    const ensureAdmin = (username: string, password: string, fullName: string, email: string) => {
      const existing = this.getAdminByUsername(username);
      if (!existing) {
        this.createAdmin({ username, password, fullName, email });
        return;
      }

      const updates: Partial<Admin> = {};
      if (existing.password !== password) updates.password = password;
      if (!existing.isActive) updates.isActive = true;

      if (Object.keys(updates).length > 0) this.updateAdmin(existing.id, updates);
    };

    ensureAdmin('admin', 'admin123', 'Demo Administrator', 'admin@kevinsacademy.com');
    ensureAdmin('kevin_teacher', 'kevin_0209', 'Kevin Teacher', 'kevin@kevinsacademy.com');

    const admin = this.getAdminByUsername('admin');
    if (!admin) return;

    const studentKey = this.getAdminKey(admin.id, 'students');
    const globalStudentsKey = 'kevins_academy_students';
    const parentKey = this.getAdminKey(admin.id, 'parents');
    const globalParentsKey = 'kevins_academy_parents';

    const defaultStudent: Student = {
      id: 'student_demo_1',
      fullName: 'John Doe',
      role: 'student',
      username: 'student',
      password: 'student123',
      email: 'student@kevinsacademy.com',
      phone: '+1 (555) 010-2000',
      group: 'Beginner A1',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const defaultParent: Parent = {
      id: 'parent_demo_1',
      fullName: 'Jane Doe',
      role: 'parent',
      username: 'parent',
      password: 'parent123',
      email: 'parent@kevinsacademy.com',
      phone: '+1 (555) 010-3000',
      studentId: defaultStudent.id,
      createdAt: new Date().toISOString(),
    };

    const ensureArrayItem = <T extends { username?: string }>(key: string, item: T) => {
      const existingRaw = localStorage.getItem(key);
      const list: T[] = existingRaw ? JSON.parse(existingRaw) : [];
      const hasItem = list.some((entry) => entry.username === item.username);
      if (!hasItem) {
        list.push(item);
        localStorage.setItem(key, JSON.stringify(list));
      }
    };

    ensureArrayItem<Student>(studentKey, defaultStudent);
    ensureArrayItem<Student>(globalStudentsKey, defaultStudent);
    ensureArrayItem<Parent>(parentKey, defaultParent);
    ensureArrayItem<Parent>(globalParentsKey, defaultParent);
  }

  // 🔹 Helper: Adminga xos localStorage key
  private getAdminKey(adminId: string, key: string): string {
    return `kevins_academy_${adminId}_${key}`;
  }

  private getCurrentAdmin(): Admin | null {
    if (typeof window === 'undefined') return null;
    const currentAdmin = localStorage.getItem('kevins_academy_current_admin');
    return currentAdmin ? JSON.parse(currentAdmin) : null;
  }

  private setCurrentAdmin(admin: Admin | null): void {
    if (typeof window === 'undefined') return;
    if (admin) localStorage.setItem('kevins_academy_current_admin', JSON.stringify(admin));
    else localStorage.removeItem('kevins_academy_current_admin');
  }

  /** 🔹 Admin CRUD */
  createAdmin(adminData: Omit<Admin, 'id' | 'createdAt' | 'isActive'>): Admin {
    const admins = this.getAdmins();
    const newAdmin: Admin = {
      ...adminData,
      id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    admins.push(newAdmin);
    localStorage.setItem('kevins_academy_admins', JSON.stringify(admins));
    return newAdmin;
  }

  getAdmins(): Admin[] {
    if (typeof window === 'undefined') return [];
    const admins = localStorage.getItem('kevins_academy_admins');
    return admins ? JSON.parse(admins) : [];
  }

  getAdminById(id: string): Admin | null {
    return this.getAdmins().find(a => a.id === id) || null;
  }

  getAdminByUsername(username: string): Admin | null {
    return this.getAdmins().find(a => a.username === username) || null;
  }

  updateAdmin(id: string, updates: Partial<Admin>): Admin | null {
    const admins = this.getAdmins();
    const idx = admins.findIndex(a => a.id === id);
    if (idx === -1) return null;
    admins[idx] = { ...admins[idx], ...updates };
    localStorage.setItem('kevins_academy_admins', JSON.stringify(admins));
    if (this.getCurrentAdmin()?.id === id) this.setCurrentAdmin(admins[idx]);
    return admins[idx];
  }

  deleteAdmin(id: string): boolean {
    const admins = this.getAdmins();
    const filtered = admins.filter(a => a.id !== id);
    if (filtered.length === admins.length) return false;

    localStorage.setItem('kevins_academy_admins', JSON.stringify(filtered));
    ['students', 'groups', 'materials', 'scores', 'attendance', 'payments', 'parents'].forEach(key =>
      localStorage.removeItem(this.getAdminKey(id, key))
    );

    if (this.getCurrentAdmin()?.id === id) this.setCurrentAdmin(null);
    return true;
  }

  /** 🔹 Authentication */
  authenticateAdmin(username: string, password: string): Admin | null {
    const admin = this.getAdminByUsername(username);
    if (admin && admin.password === password && admin.isActive) {
      this.setCurrentAdmin(admin);
      return admin;
    }
    return null;
  }

  logoutAdmin(): void {
    this.setCurrentAdmin(null);
  }

  getCurrentAdminData(): Admin | null {
    return this.getCurrentAdmin();
  }

  /** 🔹 Data storage functions (namespaced per admin) */
  saveData(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    const admin = this.getCurrentAdmin();
    if (!admin) throw new Error('No admin logged in');
    localStorage.setItem(this.getAdminKey(admin.id, key), JSON.stringify(data));
  }

  getData(key: string): any {
    if (typeof window === 'undefined') return null;
    const admin = this.getCurrentAdmin();
    if (!admin) throw new Error('No admin logged in');
    const data = localStorage.getItem(this.getAdminKey(admin.id, key));
    return data ? JSON.parse(data) : null;
  }

  deleteData(key: string): void {
    if (typeof window === 'undefined') return;
    const admin = this.getCurrentAdmin();
    if (!admin) throw new Error('No admin logged in');
    localStorage.removeItem(this.getAdminKey(admin.id, key));
  }

  /** 🔹 Read-only access for any admin without switching */
  getDataForAdmin(adminId: string, key: string): any {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.getAdminKey(adminId, key));
    return data ? JSON.parse(data) : null;
  }

  /** 🔹 Find student across all admins by credentials */
  findStudentByCredentials(
    username: string,
    password: string
  ): { status: 'not_found' | 'inactive' | 'match'; student: Student | null; adminId: string | null } {
    const admins = this.getAdmins();
    let lastInactive: { student: Student; adminId: string } | null = null;

    for (const admin of admins) {
      const students: Student[] = this.getDataForAdmin(admin.id, 'students') || [];
      const match = students.find(s => s.username === username);
      if (!match) continue;
      if (match.password !== password) continue;
      if (match.status === 'inactive') {
        lastInactive = { student: match, adminId: admin.id };
        continue;
      }
      return { status: 'match', student: match, adminId: admin.id };
    }

    if (lastInactive) {
      return { status: 'inactive', student: lastInactive.student, adminId: lastInactive.adminId };
    }

    return { status: 'not_found', student: null, adminId: null };
  }

  /** 🔹 Find parent across all admins by credentials */
  findParentByCredentials(
    username: string,
    password: string
  ): { status: 'not_found' | 'match'; parent: Parent | null; adminId: string | null } {
    const admins = this.getAdmins();

    for (const admin of admins) {
      const parents: Parent[] = this.getDataForAdmin(admin.id, 'parents') || [];
      const match = parents.find(p => p.username === username);
      if (!match) continue;
      if (match.password !== password) continue;
      return { status: 'match', parent: match, adminId: admin.id };
    }

    return { status: 'not_found', parent: null, adminId: null };
  }

  /** 🔹 Convenience methods */
  getStudents(): Student[] { return this.getData('students') || []; }
  saveStudents(students: Student[]): void {
    this.saveData('students', students.map(s => ({ ...s, role: 'student' })));
  }

  getGroups(): Group[] { return this.getData('groups') || []; }
  saveGroups(groups: Group[]): void { this.saveData('groups', groups); }

  getMaterials(): Material[] { return this.getData('materials') || []; }
  saveMaterials(materials: Material[]): void { this.saveData('materials', materials); }

  getScores(): Score[] { return this.getData('scores') || []; }
  saveScores(scores: Score[]): void { this.saveData('scores', scores); }

  getAttendance(): Attendance[] { return this.getData('attendance') || []; }
  saveAttendance(attendance: Attendance[]): void { this.saveData('attendance', attendance); }

  getPayments(): Payment[] { return this.getData('payments') || []; }
  savePayments(payments: Payment[]): void { this.saveData('payments', payments); }

  getParents(): Parent[] { return this.getData('parents') || []; }
  saveParents(parents: Parent[]): void {
    this.saveData('parents', parents.map(p => ({ ...p, role: 'parent' })));
  }
}

/** 🔹 Export singleton instance */
export const adminStorage = new AdminStorage();

/** 🔹 Optional alias for backward compatibility */
export const storage = adminStorage;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TaskEntity, TaskStatus, TaskSubmission } from '@/types/database';
import { sendEmailNotification, getAppSettings } from '@/utils/settings';
import { getRelativeDeadline, formatShortDateTime } from '@/utils/date';

interface TaskContextType {
  tasks: TaskEntity[];
  getTasksForWorker: (workerEmail?: string) => TaskEntity[];
  createTask: (newTask: Omit<TaskEntity, 'id' | 'task_code' | 'created_at' | 'revision_count'>) => { success: boolean; task?: TaskEntity };
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, adminFeedback?: string) => { success: boolean };
  submitWork: (taskId: string, submission: Omit<TaskSubmission, 'submittedAt'>) => { success: boolean; error?: string };
  assignWorker: (taskId: string, workerId: string, workerName: string, workerEmail: string) => { success: boolean };
  deleteTask: (taskId: string) => { success: boolean };
  clearAllTasks: () => void;
  resetSampleTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'jt_tasks_pipeline';

/**
 * Generate dynamically synchronized initial tasks based on today's real date
 */
export function generateDynamicInitialTasks(): TaskEntity[] {
  const currentYear = new Date().getFullYear();

  return [
    {
      id: 'task-001',
      task_code: `JT-${currentYear}-081`,
      customer_name: 'Rian A. (Mahasiswa Unpad)',
      customer_phone: '+62 813-9821-4432',
      service_title: 'Bimbingan & Olah Data Skripsi',
      title: 'Olah data SPSS, Uji Asumsi Klasik, & Regresi Linear Berganda',
      brief: 'Data Excel 100 responden sudah terlampir. Kerjakan output SPSS, uji normalitas Shapiro-Wilk/Kolmogorov-Smirnov, heteroskedastisitas scatterplot, dan interpretasi tabel R-Square.',
      deadline: getRelativeDeadline(0, '20:00'), // Hari ini
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      price: 'Rp 450.000',
      worker_id: 'usr-003',
      worker_email: 'worker@jokitugasku.id',
      worker_name: 'Penjoki Budi Santoso',
      revision_count: 0,
      created_at: formatShortDateTime(new Date(Date.now() - 4 * 3600 * 1000)),
    },
    {
      id: 'task-002',
      task_code: `JT-${currentYear}-082`,
      customer_name: 'Nadia P. (Mahasiswa ITS)',
      customer_phone: '+62 812-4451-7721',
      service_title: 'Joki PPT & Slide Presentasi',
      title: 'Slide Sempro 20 Hal Tema Artificial Intelligence',
      brief: 'Format slide 16:9 modern minimalist, warna dominan biru navy & violet. Sertakan speaker notes di setiap slide untuk persiapan tanya jawab dosen penguji.',
      deadline: getRelativeDeadline(1, '12:00'), // Besok
      priority: 'NORMAL',
      status: 'REVIEW',
      price: 'Rp 180.000',
      worker_id: 'usr-004',
      worker_email: 'dina.designer@gmail.com',
      worker_name: 'Dina Rahmawati',
      revision_count: 0,
      submission: {
        notes: 'Draft 20 slide sudah selesai. Desain menggunakan Canva Pro & master PPTX terlampir di Google Drive.',
        driveLink: 'https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP-JT-082',
        fileName: 'Slide_Sempro_AI_Nadia_ITS_v1.pptx',
        fileSize: '14.2 MB',
        submittedAt: formatShortDateTime(new Date(Date.now() - 1.5 * 3600 * 1000)) + ' WIB',
        submittedBy: 'dina.designer@gmail.com'
      },
      created_at: formatShortDateTime(new Date(Date.now() - 24 * 3600 * 1000)),
    },
    {
      id: 'task-003',
      task_code: `JT-${currentYear}-083`,
      customer_name: 'Dimas S. (Siswa SMK Malang)',
      customer_phone: '+62 857-1102-9981',
      service_title: 'Joki Laporan PKL & Magang',
      title: 'Laporan PKL Bengkel Motor & Modul Perawatan Berkala',
      brief: 'Laporan PKL 35 halaman BAB 1-4 sesuai panduan SMK Telkom. Dilengkapi diagram alur kerja dan foto dokumentasi kegiatan magang.',
      deadline: getRelativeDeadline(2, '18:00'), // +2 Hari
      priority: 'HIGH',
      status: 'REVISION',
      price: 'Rp 300.000',
      worker_id: 'usr-003',
      worker_email: 'worker@jokitugasku.id',
      worker_name: 'Penjoki Budi Santoso',
      revision_count: 1,
      admin_feedback: 'Catatan Dosen Penguji: Bab 3 tambahkan analisis penyebab kerusakan sistem injeksi & lampirkan logbook harian.',
      submission: {
        notes: 'Draft awal Bab 1-4 sudah disusun sesuai format.',
        driveLink: 'https://drive.google.com/drive/folders/2bC3dE4fG5hI6jK7lM8nO9pQ-JT-083',
        fileName: 'Laporan_PKL_Dimas_v1.docx',
        fileSize: '6.8 MB',
        submittedAt: formatShortDateTime(new Date(Date.now() - 12 * 3600 * 1000)) + ' WIB',
        submittedBy: 'worker@jokitugasku.id'
      },
      created_at: formatShortDateTime(new Date(Date.now() - 48 * 3600 * 1000)),
    },
    {
      id: 'task-004',
      task_code: `JT-${currentYear}-084`,
      customer_name: 'Alif K. (Mahasiswa Farmasi UI)',
      customer_phone: '+62 896-7782-3314',
      service_title: 'Joki Laporan Praktikum',
      title: 'Laporan Praktikum Biokimia Kinetika Enzim Katalase',
      brief: 'Laporan 12 halaman lengkap dengan grafik perhitungan laju reaksi Michaelis-Menten dan pembahasan jurnal ilmiah berbahasa Inggris.',
      deadline: getRelativeDeadline(3, '23:59'), // +3 Hari
      priority: 'NORMAL',
      status: 'ASSIGNED',
      price: 'Rp 220.000',
      worker_id: 'usr-005',
      worker_email: 'fauzi.penjoki@gmail.com',
      worker_name: 'Fauzi Rahmat',
      revision_count: 0,
      created_at: formatShortDateTime(new Date(Date.now() - 6 * 3600 * 1000)),
    },
  ];
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskEntity[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
    const initial = generateDynamicInitialTasks();
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  });

  const saveTasks = (newTasks: TaskEntity[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const getTasksForWorker = useCallback((workerEmail?: string) => {
    if (!workerEmail) return tasks;
    return tasks.filter(t => t.worker_email?.toLowerCase() === workerEmail.toLowerCase());
  }, [tasks]);

  const createTask = useCallback((newTaskData: Omit<TaskEntity, 'id' | 'task_code' | 'created_at' | 'revision_count'>) => {
    const currentYear = new Date().getFullYear();
    const count = tasks.length + 1;
    const taskCode = `JT-${currentYear}-${String(count).padStart(3, '0')}`;
    
    const newTask: TaskEntity = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      task_code: taskCode,
      revision_count: 0,
      created_at: formatShortDateTime(new Date()),
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    return { success: true, task: newTask };
  }, [tasks]);

  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus, adminFeedback?: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const isRevision = newStatus === 'REVISION';
        return {
          ...t,
          status: newStatus,
          admin_feedback: adminFeedback !== undefined ? adminFeedback : t.admin_feedback,
          revision_count: isRevision ? t.revision_count + 1 : t.revision_count
        };
      }
      return t;
    });

    saveTasks(updated);
    return { success: true };
  }, [tasks]);

  const submitWork = useCallback((taskId: string, submission: Omit<TaskSubmission, 'submittedAt'>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Tugas tidak ditemukan' };

    const fullSubmission: TaskSubmission = {
      ...submission,
      submittedAt: formatShortDateTime(new Date()) + ' WIB'
    };

    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'REVIEW' as TaskStatus,
          submission: fullSubmission
        };
      }
      return t;
    });

    saveTasks(updated);

    // Optional email trigger
    const settings = getAppSettings();
    if (settings.sendTaskAssignedEmail) {
      sendEmailNotification({
        toEmail: settings.contactEmail,
        toName: 'Super Admin',
        subject: `[Tugas Selesai Dikerjakan] ${task.task_code} - ${task.title}`,
        htmlContent: `
          <h3>Worker telah mengupload hasil tugas: ${task.task_code}</h3>
          <p><strong>Judul:</strong> ${task.title}</p>
          <p><strong>Diserahkan oleh:</strong> ${submission.submittedBy}</p>
          <p><strong>Catatan:</strong> ${submission.notes}</p>
          ${submission.driveLink ? `<p><a href="${submission.driveLink}">Buka Google Drive</a></p>` : ''}
        `
      }).catch(console.error);
    }

    return { success: true };
  }, [tasks]);

  const assignWorker = useCallback((taskId: string, workerId: string, workerName: string, workerEmail: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false };

    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          worker_id: workerId,
          worker_name: workerName,
          worker_email: workerEmail,
          status: (t.status === 'NEW' ? 'ASSIGNED' : t.status) as TaskStatus
        };
      }
      return t;
    });

    saveTasks(updated);

    // Trigger email notification to worker
    const settings = getAppSettings();
    if (settings.sendTaskAssignedEmail && workerEmail) {
      sendEmailNotification({
        toEmail: workerEmail,
        toName: workerName,
        subject: `[Tugas Baru Ditugaskan] ${task.task_code} - ${task.title}`,
        htmlContent: `
          <h3>Halo ${workerName},</h3>
          <p>Anda mendapatkan penugasan tugas baru:</p>
          <p><strong>Kode Tugas:</strong> ${task.task_code}</p>
          <p><strong>Judul:</strong> ${task.title}</p>
          <p><strong>Layanan:</strong> ${task.service_title}</p>
          <p><strong>Deadline:</strong> ${task.deadline}</p>
          <p><strong>Brief:</strong><br/>${task.brief}</p>
          <p>Silakan buka Portal Worker untuk memulai pengerjaan.</p>
        `
      }).catch(console.error);
    }

    return { success: true };
  }, [tasks]);

  const deleteTask = useCallback((taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasks(updated);
    return { success: true };
  }, [tasks]);

  const clearAllTasks = useCallback(() => {
    saveTasks([]);
  }, []);

  const resetSampleTasks = useCallback(() => {
    const initial = generateDynamicInitialTasks();
    saveTasks(initial);
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      getTasksForWorker,
      createTask,
      updateTaskStatus,
      submitWork,
      assignWorker,
      deleteTask,
      clearAllTasks,
      resetSampleTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

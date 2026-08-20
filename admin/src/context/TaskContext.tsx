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
    return [];
  });

  // Fetch real tasks from Supabase on mount
  useEffect(() => {
    if (!supabase) return;

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTasks(data as any);
          localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data));
        }
      } catch (e) {
        console.error('Supabase fetch tasks error', e);
      }
    };

    fetchTasks();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('tasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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

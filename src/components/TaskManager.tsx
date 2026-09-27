import { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, X, Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  assignee?: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  completedAt?: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem('lendingos_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Seed with sample tasks
      const seedTasks: Task[] = [
        {
          id: '1',
          title: 'Review loan application LN-2026-0846',
          description: 'Grace Wanjiku - KES 8,500 Micro Personal',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
          assignee: 'Credit Officer',
          entityType: 'Loan',
          entityId: 'LN-2026-0846',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Follow up on overdue loan LN-2026-0843',
          description: 'David Kiprop - 45 days overdue',
          priority: 'urgent',
          status: 'pending',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          assignee: 'Collections',
          entityType: 'Loan',
          entityId: 'LN-2026-0843',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Complete KYC verification for Mary Kamau',
          description: 'Pending document review',
          priority: 'medium',
          status: 'in_progress',
          assignee: 'Compliance',
          entityType: 'Borrower',
          entityId: 'brw_004',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
          id: '4',
          title: 'Generate monthly compliance report',
          description: 'DLAK Code of Conduct self-assessment',
          priority: 'medium',
          status: 'completed',
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ];
      setTasks(seedTasks);
      localStorage.setItem('lendingos_tasks', JSON.stringify(seedTasks));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('lendingos_tasks', JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    saveTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
  };

  const toggleTaskStatus = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        if (t.status === 'completed') {
          return { ...t, status: 'pending' as const, completedAt: undefined };
        } else {
          return { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter || (filter === 'pending' && t.status === 'in_progress'));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'high': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'medium': return 'bg-primary-50 text-primary-700 border-primary-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDueDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 0) return { text: 'Overdue', color: 'text-danger-600' };
    if (hours < 2) return { text: 'Due soon', color: 'text-warning-600' };
    if (hours < 24) return { text: `${hours}h left`, color: 'text-primary-600' };
    return { text: `${Math.floor(hours / 24)}d left`, color: 'text-gray-500' };
  };

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">My Tasks</h3>
          <p className="text-sm text-gray-500">{pendingCount} pending · {urgentCount} urgent</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex items-center gap-3">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={addTask}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === 'pending' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === 'completed' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <CheckSquare size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No tasks</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dueDateStatus = getDueDateStatus(task.dueDate);
            return (
              <div
                key={task.id}
                className={`p-3 border rounded-lg transition-colors ${
                  task.status === 'completed' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-primary-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {task.status === 'completed' ? (
                      <CheckSquare size={18} className="text-accent-600" />
                    ) : (
                      <Square size={18} className="text-gray-400 hover:text-primary-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.entityType && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {task.entityType}
                        </span>
                      )}
                      {dueDateStatus && (
                        <span className={`text-xs flex items-center gap-1 ${dueDateStatus.color}`}>
                          <Clock size={10} />
                          {dueDateStatus.text}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-xs text-gray-500">· {task.assignee}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

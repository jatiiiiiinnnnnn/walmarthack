// app/(employee)/(tabs)/tasks.tsx
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed' | 'scheduled';
    category: string;
    assignedTo: string;
    dueDate: string;
    estimatedTime: string;
    completedAt: string | null;
    tags: string[];
}

const tasksData: Task[] = [
  {
    id: 1,
    title: 'Review customer sustainability reports',
    description: 'Analyze monthly customer impact reports and identify top performers',
    priority: 'high',
    status: 'pending',
    category: 'Analytics',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-06-13',
    estimatedTime: '2 hours',
    completedAt: null,
    tags: ['reports', 'analytics', 'monthly']
  },
  {
    id: 2,
    title: 'Update recycling center locations',
    description: 'Add 3 new recycling centers and update contact information for existing ones',
    priority: 'medium',
    status: 'completed',
    category: 'Data Management',
    assignedTo: 'Mike Chen',
    dueDate: '2025-06-12',
    estimatedTime: '1 hour',
    completedAt: '2025-06-12T14:30:00Z',
    tags: ['locations', 'recycling', 'updates']
  },
  {
    id: 3,
    title: 'Approve new eco-challenge proposals',
    description: 'Review and approve 5 new environmental challenges submitted by the team',
    priority: 'medium',
    status: 'in-progress',
    category: 'Content Management',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-06-14',
    estimatedTime: '3 hours',
    completedAt: null,
    tags: ['challenges', 'approval', 'content']
  },
  {
    id: 4,
    title: 'Analyze monthly environmental impact',
    description: 'Generate comprehensive report on store environmental impact for stakeholders',
    priority: 'high',
    status: 'pending',
    category: 'Reporting',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-06-15',
    estimatedTime: '4 hours',
    completedAt: null,
    tags: ['impact', 'monthly', 'stakeholders']
  },
  {
    id: 5,
    title: 'Train new staff on rescue deal process',
    description: 'Conduct training session for 3 new employees on creating and managing rescue deals',
    priority: 'low',
    status: 'scheduled',
    category: 'Training',
    assignedTo: 'Mike Chen',
    dueDate: '2025-06-16',
    estimatedTime: '2 hours',
    completedAt: null,
    tags: ['training', 'staff', 'rescue-deals']
  },
  {
    id: 6,
    title: 'Update donation partner contacts',
    description: 'Verify and update contact information for all food bank partners',
    priority: 'medium',
    status: 'pending',
    category: 'Partnerships',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-06-17',
    estimatedTime: '1.5 hours',
    completedAt: null,
    tags: ['donations', 'partners', 'contacts']
  }
];

export default function TasksTab() {
  const [tasks, setTasks] = useState(tasksData);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
    estimatedTime: '',
    tags: ''
  });

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority as 'high' | 'medium' | 'low'] - priorityOrder[a.priority as 'high' | 'medium' | 'low'];
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length
  };

interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed' | 'scheduled';
    category: string;
    assignedTo: string;
    dueDate: string;
    estimatedTime: string;
    completedAt: string | null;
    tags: string[];
}

interface NewTask {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    dueDate: string;
    estimatedTime: string;
    tags: string;
}

const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
    switch (priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#6B7280';
    }
};

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed' | 'scheduled') => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'scheduled': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: 'pending' | 'in-progress' | 'completed' | 'scheduled') => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null
          }
        : task
    ));
    Alert.alert('Success', `Task status updated to ${newStatus}`);
  };

  const addNewTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      status: 'pending',
      category: newTask.category,
      assignedTo: 'Sarah Johnson',
      dueDate: newTask.dueDate,
      estimatedTime: newTask.estimatedTime,
      completedAt: null,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'General',
      dueDate: '',
      estimatedTime: '',
      tags: ''
    });
    setShowAddTaskModal(false);
    Alert.alert('Success', 'New task created successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days overdue`;
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
    
    return (
      <TouchableOpacity 
        style={[styles.taskCard, isOverdue && styles.taskCardOverdue]}
        onPress={() => {
          setSelectedTask(task);
          setShowTaskModal(true);
        }}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskHeaderLeft}>
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskCategory}>{task.category}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status.replace('-', ' ')}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>

        <View style={styles.taskMeta}>
          <View style={styles.taskMetaLeft}>
            <Text style={styles.taskDueDate}>
              📅 {formatDate(task.dueDate)}
            </Text>
            <Text style={styles.taskEstimate}>
              ⏱️ {task.estimatedTime}
            </Text>
          </View>
          <Text style={styles.taskAssignee}>
            👤 {task.assignedTo}
          </Text>
        </View>

        {task.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {task.tags.length > 3 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>+{task.tags.length - 3}</Text>
              </View>
            )}
          </View>
        )}

        {task.status !== 'completed' && (
          <View style={styles.taskActions}>
            {task.status === 'pending' && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => updateTaskStatus(task.id, 'in-progress')}
              >
                <Text style={styles.actionButtonText}>Start</Text>
              </TouchableOpacity>
            )}
            {task.status === 'in-progress' && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => updateTaskStatus(task.id, 'completed')}
              >
                <Text style={styles.actionButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const TaskModal = () => (
    <Modal visible={showTaskModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowTaskModal(false)}>
            <Text style={styles.modalBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Task Details</Text>
          <View />
        </View>

        {selectedTask && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalTaskHeader}>
              <Text style={styles.modalTaskTitle}>{selectedTask.title}</Text>
              <View style={styles.modalTaskMeta}>
                <View style={[styles.modalPriorityBadge, { backgroundColor: getPriorityColor(selectedTask.priority) }]}>
                  <Text style={styles.modalPriorityText}>{selectedTask.priority} priority</Text>
                </View>
                <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedTask.status) }]}>
                  <Text style={styles.modalStatusText}>{selectedTask.status.replace('-', ' ')}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.modalTaskDescription}>{selectedTask.description}</Text>

            <View style={styles.modalDetailsSection}>
              <Text style={styles.modalSectionTitle}>Details</Text>
              <View style={styles.modalDetailsList}>
                <View style={styles.modalDetailItem}>
                  <Text style={styles.modalDetailLabel}>Category</Text>
                  <Text style={styles.modalDetailValue}>{selectedTask.category}</Text>
                </View>
                <View style={styles.modalDetailItem}>
                  <Text style={styles.modalDetailLabel}>Assigned To</Text>
                  <Text style={styles.modalDetailValue}>{selectedTask.assignedTo}</Text>
                </View>
                <View style={styles.modalDetailItem}>
                  <Text style={styles.modalDetailLabel}>Due Date</Text>
                  <Text style={styles.modalDetailValue}>
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.modalDetailItem}>
                  <Text style={styles.modalDetailLabel}>Estimated Time</Text>
                  <Text style={styles.modalDetailValue}>{selectedTask.estimatedTime}</Text>
                </View>
                {selectedTask.completedAt && (
                  <View style={styles.modalDetailItem}>
                    <Text style={styles.modalDetailLabel}>Completed At</Text>
                    <Text style={styles.modalDetailValue}>
                      {new Date(selectedTask.completedAt).toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {selectedTask.tags.length > 0 && (
              <View style={styles.modalTagsSection}>
                <Text style={styles.modalSectionTitle}>Tags</Text>
                <View style={styles.modalTagsContainer}>
                  {selectedTask.tags.map((tag, index) => (
                    <View key={index} style={styles.modalTag}>
                      <Text style={styles.modalTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedTask.status !== 'completed' && (
              <View style={styles.modalActions}>
                {selectedTask.status === 'pending' && (
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      updateTaskStatus(selectedTask.id, 'in-progress');
                      setShowTaskModal(false);
                    }}
                  >
                    <Text style={styles.modalActionButtonText}>Start Task</Text>
                  </TouchableOpacity>
                )}
                {selectedTask.status === 'in-progress' && (
                  <TouchableOpacity 
                    style={[styles.modalActionButton, styles.modalCompleteButton]}
                    onPress={() => {
                      updateTaskStatus(selectedTask.id, 'completed');
                      setShowTaskModal(false);
                    }}
                  >
                    <Text style={styles.modalActionButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const AddTaskModal = () => (
    <Modal visible={showAddTaskModal} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
            <Text style={styles.modalBackButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Task</Text>
          <TouchableOpacity onPress={addNewTask}>
            <Text style={styles.modalSaveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={newTask.title}
              onChangeText={(value) => setNewTask(prev => ({ ...prev, title: value }))}
              placeholder="Enter task title"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              value={newTask.description}
              onChangeText={(value) => setNewTask(prev => ({ ...prev, description: value }))}
              placeholder="Enter task description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.formLabel}>Priority</Text>
              <View style={styles.pickerContainer}>
                {['low', 'medium', 'high'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerOption,
                      newTask.priority === priority && styles.pickerOptionActive
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, priority }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      newTask.priority === priority && styles.pickerOptionTextActive
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.formLabel}>Category</Text>
              <TextInput
                style={styles.formInput}
                value={newTask.category}
                onChangeText={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                placeholder="Category"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.formLabel}>Due Date *</Text>
              <TextInput
                style={styles.formInput}
                value={newTask.dueDate}
                onChangeText={(value) => setNewTask(prev => ({ ...prev, dueDate: value }))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.formLabel}>Estimated Time</Text>
              <TextInput
                style={styles.formInput}
                value={newTask.estimatedTime}
                onChangeText={(value) => setNewTask(prev => ({ ...prev, estimatedTime: value }))}
                placeholder="2 hours"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tags (comma separated)</Text>
            <TextInput
              style={styles.formInput}
              value={newTask.tags}
              onChangeText={(value) => setNewTask(prev => ({ ...prev, tags: value }))}
              placeholder="analytics, monthly, reports"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Management</Text>
        <Text style={styles.headerSubtitle}>Organize and track your daily tasks</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{taskStats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>{taskStats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#3B82F6' }]}>{taskStats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{taskStats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.controlsSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddTaskModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              {['all', 'pending', 'in-progress', 'completed'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text style={[styles.filterButtonText, filterStatus === status && styles.filterButtonTextActive]}>
                    {status === 'in-progress' ? 'In Progress' : status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Priority:</Text>
              {['all', 'high', 'medium', 'low'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[styles.filterButton, filterPriority === priority && styles.filterButtonActive]}
                  onPress={() => setFilterPriority(priority)}
                >
                  <Text style={[styles.filterButtonText, filterPriority === priority && styles.filterButtonTextActive]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList}>
        <View style={styles.tasksContainer}>
          {taskStats.overdue > 0 && (
            <View style={styles.overdueAlert}>
              <Text style={styles.overdueAlertText}>
                ⚠️ {taskStats.overdue} task{taskStats.overdue > 1 ? 's' : ''} overdue
              </Text>
            </View>
          )}
          
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>✅</Text>
              <Text style={styles.emptyStateTitle}>No tasks found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search criteria' : 'All tasks completed! Great job!'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TaskModal />
      <AddTaskModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#047857',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  controlsSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#047857',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  tasksList: {
    flex: 1,
  },
  tasksContainer: {
    padding: 16,
    gap: 16,
  },
  overdueAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  overdueAlertText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskCardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  taskCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskMetaLeft: {
    gap: 4,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskEstimate: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskAssignee: {
    fontSize: 12,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#6B7280',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBackButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalSaveButton: {
    fontSize: 16,
    color: '#047857',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTaskHeader: {
    marginBottom: 16,
  },
  modalTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalTaskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  modalPriorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalPriorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalTaskDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalDetailsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalDetailsList: {
    gap: 8,
  },
  modalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalTagsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTag: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalTagText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
  },
  modalActions: {
    gap: 12,
    marginTop: 24,
  },
  modalActionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCompleteButton: {
    backgroundColor: '#10B981',
  },
  modalActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  pickerOptionActive: {
    backgroundColor: '#047857',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  pickerOptionTextActive: {
    color: 'white',
    fontWeight: '500',
  },
});
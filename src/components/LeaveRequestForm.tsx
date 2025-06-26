import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, FileText, User, CheckCircle, X, BarChart3, TrendingUp, Users } from 'lucide-react';

interface FormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveRecord {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  days: number;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  leaveTypes: Array<{ value: string; label: string }>;
}

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
  minDate?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, formData, leaveTypes }) => {
  if (!isOpen) return null;

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-90vh overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Request Submitted!</h2>
                <p className="text-green-100">Your leave request has been sent for approval</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Leave Type</span>
              <span className="text-sm font-semibold text-gray-900">{selectedLeaveType?.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Start Date</span>
              <span className="text-sm font-semibold text-gray-900">{formatDisplayDate(formData.startDate)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">End Date</span>
              <span className="text-sm font-semibold text-gray-900">{formatDisplayDate(formData.endDate)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Duration</span>
              <span className="text-sm font-semibold text-blue-600">{calculateDays()} day{calculateDays() !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600">Reason</span>
            <p className="text-sm text-gray-900 mt-1 bg-gray-50 rounded-lg p-3">{formData.reason}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> Your manager will review this request and you'll receive an email notification once it's been processed.
            </p>
          </div>
        </div>

        <div className="border-t p-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomCalendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, onClose, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const today = new Date();
  const minDateObj = minDate ? new Date(minDate) : today;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateDisabled = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date < minDateObj;
  };

  const isDateSelected = (year: number, month: number, day: number) => {
    const dateStr = formatDate(year, month, day);
    return dateStr === selectedDate;
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day)) {
      onDateSelect(dateStr);
      onClose();
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const selected = isDateSelected(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={disabled}
        className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${disabled
            ? 'text-gray-300 cursor-not-allowed'
            : selected
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-50 text-gray-700'
          }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="w-8 h-8 text-xs font-medium text-gray-500 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

const LeaveDashboard: React.FC = () => {
  // Mock data for demonstration
  const [leaveRecords] = useState<LeaveRecord[]>([
    {
      id: '1',
      leaveType: 'annual',
      startDate: '2024-12-25',
      endDate: '2024-12-27',
      reason: 'Christmas holiday with family',
      status: 'approved',
      submittedDate: '2024-12-01',
      days: 3
    },
    {
      id: '2',
      leaveType: 'sick',
      startDate: '2024-11-15',
      endDate: '2024-11-15',
      reason: 'Flu symptoms and fever',
      status: 'approved',
      submittedDate: '2024-11-15',
      days: 1
    },
    {
      id: '3',
      leaveType: 'personal',
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      reason: 'Personal matters to attend',
      status: 'pending',
      submittedDate: '2024-12-20',
      days: 3
    },
    {
      id: '4',
      leaveType: 'annual',
      startDate: '2024-10-10',
      endDate: '2024-10-12',
      reason: 'Long weekend vacation',
      status: 'rejected',
      submittedDate: '2024-10-01',
      days: 3
    }
  ]);

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'emergency', label: 'Emergency Leave' }
  ];

  const getLeaveTypeLabel = (value: string) => {
    return leaveTypes.find(type => type.value === value)?.label || value;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  // Calculate statistics
  const totalDaysUsed = leaveRecords
    .filter(record => record.status === 'approved')
    .reduce((sum, record) => sum + record.days, 0);

  const pendingRequests = leaveRecords.filter(record => record.status === 'pending').length;
  const approvedRequests = leaveRecords.filter(record => record.status === 'approved').length;

  const leaveTypeStats = leaveTypes.map(type => {
    const typeRecords = leaveRecords.filter(record => record.leaveType === type.value && record.status === 'approved');
    const totalDays = typeRecords.reduce((sum, record) => sum + record.days, 0);
    return {
      type: type.label,
      days: totalDays,
      requests: typeRecords.length
    };
  }).filter(stat => stat.days > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Leave Dashboard</h1>
              <p className="text-purple-100">Overview of your leave requests and balances</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Days Used</p>
                  <p className="text-2xl font-bold text-blue-900">{totalDaysUsed}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Approved Requests</p>
                  <p className="text-2xl font-bold text-green-900">{approvedRequests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Type Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Leave Type Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaveTypeStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{stat.type}</span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{stat.days} days</p>
                      <p className="text-xs text-gray-500">{stat.requests} request{stat.requests !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Records */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Recent Leave Requests</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <div className="divide-y divide-gray-200">
            {leaveRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{getLeaveTypeLabel(record.leaveType)}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)} {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatDisplayDate(record.startDate)} - {formatDisplayDate(record.endDate)}</span>
                      <span>•</span>
                      <span>{record.days} day{record.days !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-sm text-gray-700">{record.reason}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Submitted: {formatDisplayDate(record.submittedDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaveRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'emergency', label: 'Emergency Leave' }
  ];

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for your leave';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
    setErrors({});
  };

  const calculateLeaveDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        formData={formData}
        leaveTypes={leaveTypes}
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Leave Request</h1>
                <p className="text-blue-100">Submit your time-off request</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Leave Type */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Leave Type</span>
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) => handleInputChange('leaveType', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${errors.leaveType
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                  }`}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.leaveType && (
                <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="relative">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowStartCalendar(!showStartCalendar);
                    setShowEndCalendar(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-colors focus:outline-none ${errors.startDate
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                    }`}
                >
                  {formData.startDate ? formatDisplayDate(formData.startDate) : 'Select start date'}
                </button>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
                {showStartCalendar && (
                  <CustomCalendar
                    selectedDate={formData.startDate}
                    onDateSelect={(date) => handleInputChange('startDate', date)}
                    onClose={() => setShowStartCalendar(false)}
                  />
                )}
              </div>

              {/* End Date */}
              <div className="relative">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>End Date</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndCalendar(!showEndCalendar);
                    setShowStartCalendar(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-colors focus:outline-none ${errors.endDate
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                    }`}
                >
                  {formData.endDate ? formatDisplayDate(formData.endDate) : 'Select end date'}
                </button>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
                {showEndCalendar && (
                  <CustomCalendar
                    selectedDate={formData.endDate}
                    onDateSelect={(date) => handleInputChange('endDate', date)}
                    onClose={() => setShowEndCalendar(false)}
                    minDate={formData.startDate}
                  />
                )}
              </div>
            </div>

            {/* Leave Duration Display */}
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Leave Duration: {calculateLeaveDays()} day{calculateLeaveDays() !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Reason</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Please provide a reason for your leave request..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 resize-none transition-colors focus:outline-none ${errors.reason
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                  }`}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function LeaveManagementApp() {
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('form')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${currentView === 'form'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Request Leave
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${currentView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentView === 'form' ? <LeaveRequestForm /> : <LeaveDashboard />}
      </div>
    </div>
  );
}

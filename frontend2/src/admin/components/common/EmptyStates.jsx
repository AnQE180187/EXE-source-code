import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Flag, 
  CreditCard, 
  Settings, 
  Search, 
  Plus,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Empty State Component
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionLabel, 
  onAction,
  type = 'default'
}) => {
  const getIconColor = () => {
    switch (type) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      default:
        return 'var(--primary)';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'linear-gradient(135deg, #fee2e2, #fecaca)';
      case 'warning':
        return 'linear-gradient(135deg, #fef3c7, #fde68a)';
      case 'success':
        return 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
      default:
        return 'linear-gradient(135deg, var(--primary-50), var(--primary-100))';
    }
  };

  return (
    <div className="ap-card">
      <div className="ap-card__body">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '3rem 2rem',
          gap: '1.5rem'
        }}>
          {/* Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: getBackgroundColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getIconColor(),
            marginBottom: '0.5rem'
          }}>
            {icon}
          </div>

          {/* Content */}
          <div style={{ maxWidth: '400px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--ink)',
              marginBottom: '0.5rem'
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--muted)',
              lineHeight: '1.6',
              margin: 0
            }}>
              {description}
            </p>
          </div>

          {/* Action Button */}
          {action && (
            <button
              className="ap-btn ap-btn--primary"
              onClick={onAction}
              style={{ marginTop: '0.5rem' }}
            >
              {action}
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Predefined Empty States
export const EmptyStates = {
  // Users
  NoUsers: () => (
    <EmptyState
      icon={<Users size={32} />}
      title="No users found"
      description="There are no users in the system yet. Users will appear here once they register."
      action={<Plus size={16} />}
      actionLabel="Invite Users"
      onAction={() => console.log('Invite users')}
    />
  ),

  // Events
  NoEvents: () => (
    <EmptyState
      icon={<Calendar size={32} />}
      title="No events found"
      description="There are no events to display. Create your first event to get started."
      action={<Plus size={16} />}
      actionLabel="Create Event"
      onAction={() => console.log('Create event')}
    />
  ),

  // Reports
  NoReports: () => (
    <EmptyState
      icon={<Flag size={32} />}
      title="No reports found"
      description="Great! There are no reports to review at the moment. All content is clean."
      action={<RefreshCw size={16} />}
      actionLabel="Refresh"
      onAction={() => console.log('Refresh reports')}
    />
  ),

  // Payments
  NoPayments: () => (
    <EmptyState
      icon={<CreditCard size={32} />}
      title="No payments found"
      description="No payment transactions have been recorded yet. Payments will appear here once users make transactions."
      action={<RefreshCw size={16} />}
      actionLabel="Refresh"
      onAction={() => console.log('Refresh payments')}
    />
  ),

  // Audit Logs
  NoAuditLogs: () => (
    <EmptyState
      icon={<FileText size={32} />}
      title="No audit logs found"
      description="No system activities have been logged yet. Audit logs will appear here as users interact with the system."
      action={<RefreshCw size={16} />}
      actionLabel="Refresh"
      onAction={() => console.log('Refresh audit logs')}
    />
  ),

  // Search Results
  NoSearchResults: ({ searchTerm }) => (
    <EmptyState
      icon={<Search size={32} />}
      title="No results found"
      description={`No items match your search for "${searchTerm}". Try adjusting your search terms or filters.`}
      action={<RefreshCw size={16} />}
      actionLabel="Clear Search"
      onAction={() => console.log('Clear search')}
    />
  ),

  // Error State
  ErrorState: ({ message, onRetry }) => (
    <EmptyState
      icon={<AlertCircle size={32} />}
      title="Something went wrong"
      description={message || "An unexpected error occurred. Please try again."}
      action={<RefreshCw size={16} />}
      actionLabel="Try Again"
      onAction={onRetry}
      type="error"
    />
  ),

  // Loading Error
  LoadingError: ({ onRetry }) => (
    <EmptyState
      icon={<AlertCircle size={32} />}
      title="Failed to load data"
      description="We couldn't load the data. This might be due to a network issue or server problem."
      action={<RefreshCw size={16} />}
      actionLabel="Retry"
      onAction={onRetry}
      type="error"
    />
  ),

  // Settings
  NoSettings: () => (
    <EmptyState
      icon={<Settings size={32} />}
      title="Settings not configured"
      description="System settings haven't been configured yet. Set up your preferences to get started."
      action={<Settings size={16} />}
      actionLabel="Configure Settings"
      onAction={() => console.log('Configure settings')}
    />
  )
};

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          icon={<AlertCircle size={32} />}
          title="Something went wrong"
          description="An unexpected error occurred. Please refresh the page or contact support if the problem persists."
          action={<RefreshCw size={16} />}
          actionLabel="Refresh Page"
          onAction={() => window.location.reload()}
          type="error"
        />
      );
    }

    return this.props.children;
  }
}

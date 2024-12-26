import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  error: Error;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export const ErrorDisplay: React.FC<Props> = ({ 
  error, 
  onRetry, 
  retrying = false,
  className = '' 
}) => {
  return (
    <div className={`bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4" />
        <h3 className="font-medium text-sm">Error Detected</h3>
      </div>
      <p className="text-xs opacity-90 mb-3">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={retrying}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 
                   disabled:cursor-not-allowed text-red-400 px-3 py-1.5 rounded text-xs transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying...' : 'Try Again'}
        </button>
      )}
    </div>
  );
};
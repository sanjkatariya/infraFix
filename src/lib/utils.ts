import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status utility functions
export interface StatusInfo {
  label: string
  class: string
  icon: string
  color: 'yellow' | 'blue' | 'green' | 'gray'
  value: number
}

/**
 * Get status information from numeric or string status
 * 0 = Pending, 1 = In Progress, 2 = Resolved
 */
export function getStatusInfo(status: number | string | undefined): StatusInfo {
  // Handle numeric status codes: 0 = pending, 1 = inprogress, 2 = resolved
  if (typeof status === 'number') {
    switch (status) {
      case 0:
        return {
          label: 'Pending',
          class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          color: 'yellow',
          value: 0
        }
      case 1:
        return {
          label: 'In Progress',
          class: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔄',
          color: 'blue',
          value: 1
        }
      case 2:
        return {
          label: 'Resolved',
          class: 'bg-green-100 text-green-800 border-green-200',
          icon: '✓',
          color: 'green',
          value: 2
        }
      default:
        return {
          label: 'Unknown',
          class: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓',
          color: 'gray',
          value: status
        }
    }
  }
  
  // Handle string statuses (backward compatibility)
  const statusStr = String(status || 'pending').toLowerCase()
  if (statusStr === 'pending') {
    return {
      label: 'Pending',
      class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      color: 'yellow',
      value: 0
    }
  }
  if (statusStr === 'in-progress' || statusStr === 'in progress' || statusStr === 'in_progress' || statusStr === 'inprogress') {
    return {
      label: 'In Progress',
      class: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🔄',
      color: 'blue',
      value: 1
    }
  }
  if (statusStr === 'resolved' || statusStr === 'completed' || statusStr === 'Completed') {
    return {
      label: 'Resolved',
      class: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓',
      color: 'green',
      value: 2
    }
  }
  
  return {
    label: 'Pending',
    class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
    color: 'yellow',
    value: 0
  }
}


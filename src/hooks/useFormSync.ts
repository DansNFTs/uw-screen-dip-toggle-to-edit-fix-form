import { useEffect, useCallback } from 'react';
import { useUnifiedData } from '../contexts/UnifiedDataContext';

interface UseFormSyncOptions {
  formData: Record<string, any>;
  enabled?: boolean;
  debounceMs?: number;
}

export const useFormSync = ({ formData, enabled = true, debounceMs = 300 }: UseFormSyncOptions) => {
  const { syncFromReadOnly, updateField } = useUnifiedData();

  // Sync individual field changes with debouncing
  const syncField = useCallback((field: string, value: string) => {
    if (enabled) {
      updateField(field, value);
    }
  }, [updateField, enabled]);

  // Sync all form data (for save/resubmit operations)
  const syncAllFields = useCallback(() => {
    if (enabled) {
      syncFromReadOnly(formData);
    }
  }, [syncFromReadOnly, formData, enabled]);

  // Listen for beforeGlobalSave event to sync before save/resubmit
  useEffect(() => {
    const handleBeforeSave = () => {
      syncAllFields();
    };
    
    window.addEventListener('beforeGlobalSave', handleBeforeSave);
    return () => {
      window.removeEventListener('beforeGlobalSave', handleBeforeSave);
    };
  }, [syncAllFields]);

  // Live sync with debouncing for individual field updates
  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      syncAllFields();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [formData, syncAllFields, enabled, debounceMs]);

  return {
    syncField,
    syncAllFields
  };
};
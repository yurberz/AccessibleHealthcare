import { useState, useCallback, useEffect } from 'react';
import { FormState } from '../../core/types';
import { validate, ValidationRules } from '../utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Custom hook for form handling with validation
 * 
 * @param options Form configuration options
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const { initialValues, validationRules = {}, onSubmit } = options;
  
  // Initialize form state
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // Validate form when values or touched fields change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validate(values, validationRules);
      setErrors(validationErrors);
      setIsValid(Object.keys(validationErrors).length === 0);
    }
  }, [values, touched, validationRules]);
  
  // Handler for field changes
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  }, []);
  
  // Handler for field blur (marking a field as touched)
  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  }, []);
  
  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialValues]);
  
  // Set all fields as touched (useful for showing all errors on submit)
  const setAllTouched = useCallback(() => {
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((key) => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);
  }, [values]);
  
  // Submit handler
  const handleSubmit = useCallback(async () => {
    setAllTouched();
    
    const validationErrors = validate(values, validationRules);
    setErrors(validationErrors);
    
    const formIsValid = Object.keys(validationErrors).length === 0;
    setIsValid(formIsValid);
    
    if (!formIsValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, setAllTouched, onSubmit]);
  
  // Return the form state and handlers
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue: handleChange,
    setFieldTouched: handleBlur,
    setFieldError: (field: keyof T, error: string) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: error,
      }));
    },
    validateForm: () => {
      const validationErrors = validate(values, validationRules);
      setErrors(validationErrors);
      const formIsValid = Object.keys(validationErrors).length === 0;
      setIsValid(formIsValid);
      return formIsValid;
    },
  };
}

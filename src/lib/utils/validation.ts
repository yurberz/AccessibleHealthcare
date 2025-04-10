/**
 * Validation utilities for form and input validation
 */

// Define validation rules type
export type ValidationRule<T = any> = {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: T, allValues?: any) => string | undefined | boolean;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

/**
 * Validate a single value against validation rules
 * 
 * @param value The value to validate
 * @param rules The validation rules to apply
 * @param allValues All form values (for cross-field validation)
 * @returns Validation error message or undefined if valid
 */
export const validateValue = <T>(
  value: T, 
  rules?: ValidationRule<T>,
  allValues?: any
): string | undefined => {
  if (!rules) return undefined;
  
  // Required validation
  if (rules.required) {
    const isValueEmpty = 
      value === undefined || 
      value === null || 
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);
    
    if (isValueEmpty) {
      return typeof rules.required === 'string' 
        ? rules.required 
        : 'This field is required';
    }
  }
  
  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  // Number validations
  if (typeof value === 'number') {
    // Minimum value validation
    if (rules.min !== undefined) {
      const minValue = typeof rules.min === 'number' ? rules.min : rules.min.value;
      const minMessage = typeof rules.min === 'number' 
        ? `Value must be at least ${minValue}` 
        : rules.min.message;
      
      if (value < minValue) {
        return minMessage;
      }
    }
    
    // Maximum value validation
    if (rules.max !== undefined) {
      const maxValue = typeof rules.max === 'number' ? rules.max : rules.max.value;
      const maxMessage = typeof rules.max === 'number' 
        ? `Value must be at most ${maxValue}` 
        : rules.max.message;
      
      if (value > maxValue) {
        return maxMessage;
      }
    }
  }
  
  // String validations
  if (typeof value === 'string') {
    // Minimum length validation
    if (rules.minLength !== undefined) {
      const minLength = typeof rules.minLength === 'number' 
        ? rules.minLength 
        : rules.minLength.value;
      const minLengthMessage = typeof rules.minLength === 'number' 
        ? `Must be at least ${minLength} characters` 
        : rules.minLength.message;
      
      if (value.length < minLength) {
        return minLengthMessage;
      }
    }
    
    // Maximum length validation
    if (rules.maxLength !== undefined) {
      const maxLength = typeof rules.maxLength === 'number' 
        ? rules.maxLength 
        : rules.maxLength.value;
      const maxLengthMessage = typeof rules.maxLength === 'number' 
        ? `Must be at most ${maxLength} characters` 
        : rules.maxLength.message;
      
      if (value.length > maxLength) {
        return maxLengthMessage;
      }
    }
    
    // Pattern validation
    if (rules.pattern) {
      const pattern = rules.pattern instanceof RegExp 
        ? rules.pattern 
        : rules.pattern.value;
      const patternMessage = rules.pattern instanceof RegExp 
        ? 'Invalid format' 
        : rules.pattern.message;
      
      if (!pattern.test(value)) {
        return patternMessage;
      }
    }
  }
  
  // Custom validation function
  if (rules.validate) {
    const result = rules.validate(value, allValues);
    
    if (typeof result === 'string') {
      return result;
    }
    
    if (result === false) {
      return 'Invalid value';
    }
  }
  
  return undefined;
};

/**
 * Validate an entire form against validation rules
 * 
 * @param values The form values to validate
 * @param rules The validation rules to apply
 * @returns Object containing validation errors
 */
export const validate = <T extends Record<string, any>>(
  values: T, 
  rules: ValidationRules<T>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  Object.keys(rules).forEach((key) => {
    const fieldKey = key as keyof T;
    const fieldRules = rules[fieldKey];
    const value = values[fieldKey];
    
    const error = validateValue(value, fieldRules, values);
    
    if (error) {
      errors[fieldKey] = error;
    }
  });
  
  return errors;
};

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  
  // Password regex that requires at least:
  // - 8 characters
  // - 1 uppercase letter
  // - 1 lowercase letter
  // - 1 number
  // - 1 special character
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // US phone number (formats: (123) 456-7890, 123-456-7890, 1234567890)
  phone: /^(\(\d{3}\)|\d{3})[-. ]?\d{3}[-. ]?\d{4}$/,
  
  // US SSN (format: 123-45-6789)
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  
  // US ZIP code (formats: 12345, 12345-6789)
  zipCode: /^\d{5}(-\d{4})?$/,
  
  // Date in YYYY-MM-DD format
  date: /^\d{4}-\d{2}-\d{2}$/,
  
  // URL pattern
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  
  // Alphanumeric with spaces
  alphanumeric: /^[a-zA-Z0-9 ]*$/,
  
  // Letters only (with spaces)
  letters: /^[a-zA-Z ]*$/,
  
  // Numbers only
  numbers: /^[0-9]*$/,
};

/**
 * Common validation rule sets for reuse
 */
export const validationRuleSets = {
  requiredEmail: {
    required: 'Email is required',
    pattern: {
      value: validationPatterns.email,
      message: 'Please enter a valid email address',
    },
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: validationPatterns.password,
      message: 'Password must include uppercase, lowercase, number and special character',
    },
  },
  
  confirmPassword: (getPassword: () => string) => ({
    required: 'Please confirm your password',
    validate: (value: string) =>
      value === getPassword() || 'Passwords must match',
  }),
  
  requiredField: (fieldName: string) => ({
    required: `${fieldName} is required`,
  }),
  
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: validationPatterns.phone,
      message: 'Please enter a valid phone number',
    },
  },
  
  zipCode: {
    pattern: {
      value: validationPatterns.zipCode,
      message: 'Please enter a valid ZIP code',
    },
  },
};

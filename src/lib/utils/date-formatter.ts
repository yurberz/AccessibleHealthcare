/**
 * Date formatting utilities for the application
 * 
 * This file provides consistent date and time formatting functions across the app,
 * with support for accessibility and internationalization.
 */

import { formatDateForScreenReader, formatTimeForScreenReader } from '../accessibility/screen-reader';

/**
 * Format a date as a readable string (MM/DD/YYYY)
 * 
 * @param date The date to format, as Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date in long format (e.g., "January 1, 2023")
 * 
 * @param date The date to format, as Date object or ISO string
 * @returns Formatted long date string
 */
export const formatLongDate = (date: Date | string): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting long date:', error);
    return '';
  }
};

/**
 * Format a date for a short display context (e.g., "Jan 1")
 * 
 * @param date The date to format, as Date object or ISO string
 * @param includeYear Whether to include the year
 * @returns Formatted short date string
 */
export const formatShortDate = (date: Date | string, includeYear: boolean = false): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    
    if (includeYear) {
      options.year = 'numeric';
    }
    
    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting short date:', error);
    return '';
  }
};

/**
 * Format a time (e.g., "2:30 PM")
 * 
 * @param time The time to format, as Date object or string (ISO or "HH:MM")
 * @returns Formatted time string
 */
export const formatTime = (time: Date | string): string => {
  if (!time) return '';
  
  try {
    let timeObj: Date;
    
    if (typeof time === 'string') {
      // Check if it's in HH:MM format
      if (/^\d{1,2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':').map(Number);
        timeObj = new Date();
        timeObj.setHours(hours, minutes, 0);
      } else {
        // Assume ISO string
        timeObj = new Date(time);
      }
    } else {
      timeObj = time;
    }
    
    // Check if valid date
    if (isNaN(timeObj.getTime())) {
      return '';
    }
    
    return timeObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format a date and time together (e.g., "Jan 1, 2023 at 2:30 PM")
 * 
 * @param dateTime The date and time to format, as Date object or ISO string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateTime: Date | string): string => {
  if (!dateTime) return '';
  
  try {
    const dateTimeObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    
    // Check if valid date
    if (isNaN(dateTimeObj.getTime())) {
      return '';
    }
    
    const dateStr = formatShortDate(dateTimeObj, true);
    const timeStr = formatTime(dateTimeObj);
    
    return `${dateStr} at ${timeStr}`;
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return '';
  }
};

/**
 * Format a date for screen readers
 * 
 * @param date The date to format, as Date object or ISO string
 * @returns Screen reader friendly date string
 */
export const formatDateAccessible = formatDateForScreenReader;

/**
 * Format a time for screen readers
 * 
 * @param time The time to format, as Date object or ISO string
 * @returns Screen reader friendly time string
 */
export const formatTimeAccessible = formatTimeForScreenReader;

/**
 * Calculate age from date of birth
 * 
 * @param dateOfBirth Date of birth as Date object or ISO string
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: Date | string): number => {
  if (!dateOfBirth) return 0;
  
  try {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    
    // Check if valid date
    if (isNaN(dob.getTime())) {
      return 0;
    }
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};

/**
 * Format a date range (e.g., "Jan 1 - Jan 15, 2023")
 * 
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  if (!startDate || !endDate) return '';
  
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Check if valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }
    
    // If dates are in the same year
    if (start.getFullYear() === end.getFullYear()) {
      // If dates are in the same month
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
      }
      
      // Different months, same year
      return `${formatShortDate(start)} - ${formatShortDate(end)}, ${start.getFullYear()}`;
    }
    
    // Different years
    return `${formatShortDate(start, true)} - ${formatShortDate(end, true)}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return '';
  }
};

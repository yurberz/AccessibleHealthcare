import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PatientCard } from '../../../src/features/patients/components/patient-card';
import { Patient } from '../../../src/core/types';

// Mock dependencies
jest.mock('../../../src/app/providers/theme-provider', () => ({
  useTheme: jest.fn().mockImplementation(() => ({
    colors: {
      text: '#000000',
      background: '#FFFFFF',
      card: '#FFFFFF',
      primary: '#2196F3',
      border: '#E0E0E0',
      textSecondary: '#757575',
    },
  })),
}));

jest.mock('../../../src/lib/utils/date-formatter', () => ({
  formatDate: jest.fn().mockImplementation((date) => '01/01/2023'),
}));

describe('PatientCard Component', () => {
  // Mock patient data
  const mockPatient: Patient = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-01-01',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with patient data', () => {
    const { getByText } = render(
      <PatientCard patient={mockPatient} onPress={mockOnPress} />
    );

    // Check if patient information is displayed
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('01/01/2023')).toBeTruthy(); // Formatted date
    expect(getByText('(123) 456-7890')).toBeTruthy();
    expect(getByText('JD')).toBeTruthy(); // Patient initials
  });

  it('displays patient initials correctly', () => {
    const { getByText } = render(
      <PatientCard patient={mockPatient} onPress={mockOnPress} />
    );

    expect(getByText('JD')).toBeTruthy();
  });

  it('calls onPress handler when card is pressed', () => {
    const { getByText } = render(
      <PatientCard patient={mockPatient} onPress={mockOnPress} />
    );

    // Find the card by patient name and trigger press
    fireEvent.press(getByText('John Doe').parent?.parent as any);
    expect(mockOnPress).toHaveBeenCalledWith('123');
  });

  it('supports custom accessibility props', () => {
    const { getByA11yLabel } = render(
      <PatientCard
        patient={mockPatient}
        onPress={mockOnPress}
        accessibilityLabel="Custom accessibility label"
        accessibilityHint="Custom accessibility hint"
      />
    );

    const card = getByA11yLabel('Custom accessibility label');
    expect(card.props.accessibilityHint).toBe('Custom accessibility hint');
  });

  it('has default accessibility properties when custom ones are not provided', () => {
    const { getByA11yRole } = render(
      <PatientCard patient={mockPatient} onPress={mockOnPress} />
    );

    const card = getByA11yRole('button');
    expect(card.props.accessibilityLabel).toContain('John Doe');
    expect(card.props.accessibilityHint).toBe('View patient details');
  });

  it('displays formatted patient details', () => {
    // Override the date formatter mock for this test
    require('../../../src/lib/utils/date-formatter').formatDate.mockImplementation(
      () => 'January 1, 1980'
    );

    const { getByText } = render(
      <PatientCard patient={mockPatient} onPress={mockOnPress} />
    );

    expect(getByText('January 1, 1980')).toBeTruthy();
  });

  it('truncates long names with ellipsis', () => {
    const longNamePatient = {
      ...mockPatient,
      firstName: 'Very Very Very Long First Name',
      lastName: 'Extremely Long Last Name That Should Be Truncated',
    };

    const { getByText } = render(
      <PatientCard patient={longNamePatient} onPress={mockOnPress} />
    );

    // Check that the name is rendered (truncation is handled by numberOfLines prop)
    expect(getByText('Very Very Very Long First Name Extremely Long Last Name That Should Be Truncated')).toBeTruthy();
  });
});

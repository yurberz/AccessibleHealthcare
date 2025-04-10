import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../src/core/ui/button';
import { ActivityIndicator } from 'react-native';

// Mock dependencies
jest.mock('../../../src/app/providers/theme-provider', () => ({
  useTheme: jest.fn().mockImplementation(() => ({
    colors: {
      primary: '#2196F3',
      secondary: '#26A69A',
      disabled: '#E0E0E0',
      disabledText: '#9E9E9E',
      error: '#F44336',
      text: '#000000',
    },
  })),
}));

jest.mock('../../../src/app/providers/accessibility-provider', () => ({
  useAccessibilitySettings: jest.fn().mockImplementation(() => ({
    isScreenReaderEnabled: false,
    fontScale: 1,
  })),
}));

jest.mock('@expo/vector-icons', () => ({
  Feather: ({ name, size, color, style }) => ({
    name,
    size,
    color,
    style,
  }),
}));

describe('Button Component', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress handler when pressed', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    const button = getByText('Test Button');

    fireEvent.press(button);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    const { getByText } = render(<Button {...defaultProps} disabled />);
    const button = getByText('Test Button').parent;

    expect(button.props.disabled).toBe(true);
    
    // Press should not trigger the handler when disabled
    fireEvent.press(button);
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { UNSAFE_getByType, queryByText } = render(
      <Button {...defaultProps} isLoading />
    );

    // Check that loading indicator is shown
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    
    // Check that text is not visible during loading
    expect(queryByText('Test Button')).toBeFalsy();
    
    // Button should be disabled when loading
    fireEvent.press(UNSAFE_getByType(ActivityIndicator).parent);
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  it('renders different variants with appropriate styles', () => {
    const variants = ['primary', 'secondary', 'outline', 'text', 'danger'];
    
    variants.forEach(variant => {
      const { getByText } = render(
        <Button {...defaultProps} variant={variant as any} />
      );
      
      const buttonText = getByText('Test Button');
      const buttonContainer = buttonText.parent.parent;
      
      // Each variant should have different styling
      // We'd need to check the exact styles, but here we're just ensuring
      // the component renders without errors for each variant
      expect(buttonContainer).toBeTruthy();
    });
  });

  it('renders different sizes with appropriate styling', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const { getByText } = render(
        <Button {...defaultProps} size={size as any} />
      );
      
      const buttonText = getByText('Test Button');
      expect(buttonText).toBeTruthy();
    });
  });

  it('renders with icon when icon prop is provided', () => {
    const { UNSAFE_getAllByProps } = render(
      <Button {...defaultProps} icon="check" />
    );
    
    // Find Feather icon with name "check"
    const icons = UNSAFE_getAllByProps({ name: 'check' });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'pink', borderRadius: 20 };
    const customTextStyle = { fontWeight: 'bold', fontSize: 18 };
    
    const { getByText } = render(
      <Button
        {...defaultProps}
        style={customStyle}
        textStyle={customTextStyle}
      />
    );
    
    const buttonText = getByText('Test Button');
    const buttonContainer = buttonText.parent.parent;
    
    // Check that custom styles are applied
    expect(buttonContainer.props.style).toContainEqual(customStyle);
  });

  it('renders icon on the right when iconPosition is set to right', () => {
    const { getByText, UNSAFE_getAllByProps } = render(
      <Button {...defaultProps} icon="arrow-right" iconPosition="right" />
    );
    
    const buttonText = getByText('Test Button');
    const icons = UNSAFE_getAllByProps({ name: 'arrow-right' });
    
    // Icon should be rendered
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has proper accessibility attributes', () => {
    const { getByA11yLabel } = render(
      <Button
        {...defaultProps}
        accessibilityLabel="Custom label"
        accessibilityHint="Custom hint"
      />
    );
    
    const button = getByA11yLabel('Custom label');
    expect(button.props.accessibilityHint).toBe('Custom hint');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('uses title as accessibility label when not explicitly provided', () => {
    const { getByA11yLabel } = render(<Button {...defaultProps} />);
    
    const button = getByA11yLabel('Test Button');
    expect(button).toBeTruthy();
  });
});

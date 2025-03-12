import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface PinInputProps {
  length?: number;
  onChange: (value: string) => void;
  error?: string;
}

const PinContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 20px;
`;

const PinBoxesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const PinBox = styled.input<{ hasValue: boolean }>`
  width: 40px;
  height: 50px;
  border: 2px solid ${props => props.hasValue 
    ? props.theme.colors.primary 
    : props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.primary};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primaryLight};
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  text-align: left;
  display: block;
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: left;
`;

const PinInput: React.FC<PinInputProps> = ({ 
  length = 6, 
  onChange,
  error
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);
  
  // Update parent component when values change
  useEffect(() => {
    onChange(values.join(''));
  }, [values, onChange]);
  
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update the value at the current index
    const newValues = [...values];
    newValues[index] = value.slice(-1); // Only take the last character
    setValues(newValues);
    
    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Only allow numbers
    if (!/^\d*$/.test(pastedData)) return;
    
    const pastedValues = pastedData.slice(0, length).split('');
    const newValues = [...values];
    
    pastedValues.forEach((value, index) => {
      newValues[index] = value;
    });
    
    setValues(newValues);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newValues.findIndex(val => !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };
  
  return (
    <PinContainer>
      <Label>Verification Code</Label>
      <PinBoxesContainer>
        {Array.from({ length }).map((_, index) => (
          <PinBox
            key={index}
            type="text"
            maxLength={1}
            value={values[index]}
            hasValue={!!values[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            aria-label={`Pin digit ${index + 1}`}
          />
        ))}
      </PinBoxesContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </PinContainer>
  );
};

export default PinInput; 
import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask: 'currency' | 'number';
  value: number;
  max?: number;
  onValueChange: React.Dispatch<React.SetStateAction<number>>;
}

const Input: React.FC<InputProps> = ({
  mask,
  value,
  max = Number.MAX_SAFE_INTEGER,
  onValueChange,
  ...rest
}: InputProps) => {
  const VALID_FIRST = /^[1-9]{1}$/;
  const VALID_NEXT = /^[0-9]{1}$/;
  const DELETE_KEY_CODE = 8;

  const valueAbsTrunc = Math.trunc(Math.abs(value));

  if (
    value !== valueAbsTrunc ||
    !Number.isFinite(value) ||
    Number.isNaN(value)
  ) {
    console.log(`invalid value property`);
  }

  const handleInputKeyDown = useCallback(
    e => {
      const { key, keyCode } = e;
      if (
        (value === 0 && !VALID_FIRST.test(key)) ||
        (value !== 0 && !VALID_NEXT.test(key) && keyCode !== DELETE_KEY_CODE)
      ) {
        return;
      }
      const valueString = value.toString();
      let nextValue;
      if (keyCode !== DELETE_KEY_CODE) {
        const nextValueString = value === 0 ? key : `${valueString}${key}`;
        nextValue = Number.parseInt(nextValueString, 10);
      } else {
        const nextValueString = valueString.slice(0, -1);
        nextValue =
          nextValueString === '' ? 0 : Number.parseInt(nextValueString, 10);
      }
      if (nextValue > max) {
        return;
      }
      onValueChange(nextValue);
    },
    [max, onValueChange, value],
  );

  const handleInputChange = useCallback(() => {
    // DUMMY TO AVOID REACT WARNING
  }, []);

  let valueDisplay = '';

  if (mask === 'currency') {
    valueDisplay = (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  } else {
    valueDisplay = (value / 1).toLocaleString('pt-BR');
  }

  return (
    <input
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      value={valueDisplay}
      {...rest}
    />
  );
};

export default Input;

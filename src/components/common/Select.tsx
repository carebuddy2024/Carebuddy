import React from 'react';
import styled, { css } from 'styled-components';

interface StyledSelectProps {
  selectStyle?: 'round' | 'square';
  selectSize?: 'sm' | 'md' | 'bg';
<<<<<<< HEAD
=======
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
>>>>>>> 29492beebc6eb6079b7549453c0ada293b96ee77
}

const selectStyles = {
  round: css`
    border-radius: 30px;
  `,
  square: css`
    border-radius: none;
  `,
};

const selectSizes = {
  sm: css`
    width: 100px;
  `,
  md: css`
    width: 150px;
  `,
  bg: css`
    width: 200px;
  `,
};

const StyledSelect = styled.select<StyledSelectProps>`
  border: 1px solid var(--color-grey-2);
  padding: 8px 12px;
  color: var(--color-grey-1);
  line-height: 1.2;

  ${(props) => props.selectStyle && selectStyles[props.selectStyle]}
  ${(props) => props.selectSize && selectSizes[props.selectSize]}
`;

interface SelectProps extends StyledSelectProps {
  options: { value: string; label: string }[];
  value?: string;  // 추가: 현재 선택된 값
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,       // 추가: 현재 선택된 값
  onChange,
  selectStyle = 'square',
  selectSize = 'md',
  ...props
}) => (
  <StyledSelect
    selectStyle={selectStyle}
    selectSize={selectSize}
    value={value}  // 추가: 현재 선택된 값
    onChange={onChange}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </StyledSelect>
);

export default Select;

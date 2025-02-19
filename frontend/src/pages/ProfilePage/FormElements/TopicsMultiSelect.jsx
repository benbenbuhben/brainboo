import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { topics } from '../../../../constants';

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
    },
  },
};

export default function TopicsMultiSelect({
  value,
  onChange,
  label = "Topics",
  error,
  helperText
}) {
  // Limit selection to 5 topics.
  const handleChange = (event) => {
    const {
      target: { value: selected },
    } = event;
    if (selected.length <= 5) {
      onChange(selected);
    }
  };

  return (
    <FormControl fullWidth variant="outlined" error={error} required>
      <InputLabel id="topics-multi-select-label" required>
        {label}
      </InputLabel>
      <Select
        labelId="topics-multi-select-label"
        id="topics-multi-select"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {selected.map((val) => (
              <Chip key={val} label={val} />
            ))}
          </div>
        )}
        MenuProps={menuProps}
      >
        {topics.map((topic) => (
          <MenuItem key={topic} value={topic}>
            {topic}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { majors } from '../../../../constants';

export default function MajorSelect({ value, onChange, label = "Major" }) {
  return (
    <FormControl fullWidth variant="outlined" required>
      <InputLabel id="major-select-label" required>{label}</InputLabel>
      <Select
        labelId="major-select-label"
        id="major-select"
        value={value}
        label={label}
        onChange={onChange}
      >
        {majors.map((major, index) => (
          <MenuItem key={index} value={major}>
            {major}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

import React from 'react';
import { TextField } from '@mui/material';

export default function NameField({ register, errors }) {
  return (
    <TextField
      label="Name"
      fullWidth
      required
      {...register("name", { required: "Name is required" })}
      error={!!errors.name}
      helperText={errors.name?.message}
    />
  );
}

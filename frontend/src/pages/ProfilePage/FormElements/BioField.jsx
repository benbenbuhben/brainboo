import React from 'react';
import { TextField } from '@mui/material';

export default function BioField({ register, errors }) {
  return (
    <TextField
      label="Bio"
      fullWidth
      multiline
      rows={4}
      {...register("bio")}
      error={!!errors.bio}
      helperText={errors.bio?.message}
    />
  );
}

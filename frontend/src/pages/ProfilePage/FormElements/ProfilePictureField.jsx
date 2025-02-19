import React from 'react';
import { TextField } from '@mui/material';

export default function ProfilePictureField({ register, errors }) {
  return (
    <TextField
      label="Profile Picture URL"
      fullWidth
      {...register("profilePicture")}
      error={!!errors.profilePicture}
      helperText={errors.profilePicture?.message}
    />
  );
}

import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { updateProfile } from '../../api';

export default function ProfileForm({ profile, refetch }) {
  const { getAccessTokenSilently } = useAuth0();

  // Now that profile data is guaranteed to exist, we can safely initialize useForm.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: profile.name || '',
      profilePicture: profile.profilePicture || '',
      major: profile.major || '',
      topics: profile.topics ? profile.topics.join(', ') : '',
      bio: profile.bio || ''
    }
  });

  const onSubmit = async (data) => {
    // Convert topics from a comma-separated string to an array
    const updatedData = {
      ...data,
      topics: data.topics.split(',').map(topic => topic.trim()).filter(Boolean)
    };

    try {
      await updateProfile(getAccessTokenSilently, updatedData);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Your Profile
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Profile Picture URL"
          fullWidth
          margin="normal"
          {...register("profilePicture")}
        />
        <TextField
          label="Major"
          fullWidth
          margin="normal"
          {...register("major")}
        />
        <TextField
          label="Topics (comma separated)"
          fullWidth
          margin="normal"
          {...register("topics")}
        />
        <TextField
          label="Bio"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          {...register("bio")}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </>
  );
}

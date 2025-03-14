import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Typography, Container, Snackbar, Alert, Paper } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { updateProfile } from '../../api';
import {
  MajorSelect,
  TopicsMultiSelect,
  NameField,
  ProfilePictureField,
  BioField,
} from './FormElements';

export default function ProfileEdit({ profile, refetch }) {
  const { getAccessTokenSilently } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: profile.name || '',
      profilePicture: profile.profilePicture || '',
      major: profile.major || '',
      topics: profile.topics || [],
      bio: profile.bio || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(getAccessTokenSilently, data);
      setOpenSnackbar(true); // Show success message
      await refetch();
    } catch (err) {
      console.error(err);
      // Optionally, you might show an error Snackbar here.
    }
  };

  const handleCancel = () => {
    reset({
      name: profile.name || '',
      profilePicture: profile.profilePicture || '',
      major: profile.major || '',
      topics: profile.topics || [],
      bio: profile.bio || ''
    });
  };

  return (
    <Container maxWidth="md" sx={{ my: 4, width: '100%' }}>
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Box sx={{ mt: 2 }}>
            <NameField register={register} errors={errors} />
          </Box>

          <Box sx={{ mt: 2 }}>
            <ProfilePictureField register={register} errors={errors} />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Controller
              name="major"
              control={control}
              rules={{ required: "Major is required" }}
              render={({ field }) => (
                <MajorSelect
                  value={field.value}
                  onChange={field.onChange}
                  label="Major"
                  fullwidth
                />
              )}
            />
            {errors.major && (
              <Typography variant="caption" color="error">
                {errors.major.message}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Controller
              name="topics"
              control={control}
              rules={{
                required: "At least one topic is required",
                validate: (value) => value.length <= 5 || "Select up to 5 topics"
              }}
              render={({ field }) => (
                <TopicsMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  label="Topics (select up to 5)"
                  error={!!errors.topics}
                  helperText={errors.topics ? errors.topics.message : ""}
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <BioField register={register} errors={errors} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant='outlined'
              onClick={handleCancel}
              sx={{
                mt: 2,
                fontSize: '1rem',
                color: '#000000 !important',
                border: '1px solid #000000 !important',
                backgroundColor: '#ffffff !important',
                '&:hover': {
                  backgroundColor: '#f0f0f0 !important',
                  borderColor: '#000000 !important',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

    </Container>
  );
}

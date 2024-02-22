import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMounted } from 'src/hooks/use-mounted';
import { Box, Button, Link, Stack,TextField, Typography } from '@mui/material';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';

const initialValues = {
  email: 'demo@devias.io',
  password: 'Password123!',
  submit: null
};

const validationSchema = Yup.object({
  email: Yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup
    .string()
    .max(255)
    .required('Password is required')
});

const Page = () => {
  const isMounted = useMounted();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (isMounted()) {
          // returnTo could be an absolute path
          // window.location.href = returnTo || paths.dashboard.index;
          window.location.href = paths.dashboard.index;
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <>
      <Seo title="Login" />
      <div>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h5">
            Log in
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Don&apos;t have an account?
            &nbsp;
            <Link
              href="#"
              underline="hover"
              variant="subtitle2"
            >
              Register
            </Link>
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
              autoFocus
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
          </Stack>
          <Button
            fullWidth
            sx={{ mt: 3 }}
            size="large"
            type="submit"
            variant="contained"
          >
            Log In
          </Button>
          <Box sx={{ mt: 3 }}>
            <Link
              href="#"
              underline="hover"
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </Box>
          {/* <AuthIssuer issuer={issuer} /> */}
        </form>
      </div>
    </>
  );
};

export default Page;

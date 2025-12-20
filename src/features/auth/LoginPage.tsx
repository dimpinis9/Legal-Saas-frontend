import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthCredentials } from "../../types/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/common/LanguageSwitcher";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthCredentials>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (values: AuthCredentials) => {
    setError(null);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (e: any) {
      setError(e.message || t("auth.loginFailed"));
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            {t("auth.login")}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label={t("auth.email")}
              fullWidth
              type="email"
              margin="normal"
              {...register("email", { required: t("auth.emailRequired") })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label={t("auth.password")}
              fullWidth
              type={showPassword ? "text" : "password"}
              margin="normal"
              {...register("password", {
                required: t("auth.passwordRequired"),
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

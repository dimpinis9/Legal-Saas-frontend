import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import type { NewClientPayload } from "../../types/client";

interface ClientFormProps {
  onSubmit: (values: NewClientPayload) => void;
  disabled?: boolean;
  initialValues?: Partial<NewClientPayload>;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  disabled,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewClientPayload>({
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="First Name"
        fullWidth
        margin="normal"
        {...register("firstName", { required: "Required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        label="Last Name"
        fullWidth
        margin="normal"
        {...register("lastName", { required: "Required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register("email")}
      />
      <TextField
        label="Phone"
        fullWidth
        margin="normal"
        {...register("phone")}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || isSubmitting}
        sx={{ mt: 2 }}
      >
        Save
      </Button>
    </Box>
  );
};

export default ClientForm;

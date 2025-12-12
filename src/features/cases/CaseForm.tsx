import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import type { NewCasePayload, CaseStatus } from "../../types/case";

interface CaseFormProps {
  onSubmit: (values: NewCasePayload) => void;
  disabled?: boolean;
  initialValues?: Partial<NewCasePayload>;
  clients?: Array<{ id: number; firstName: string; lastName: string }>;
}

const caseStatuses: CaseStatus[] = [
  "OPEN",
  "PENDING_HEARING",
  "UNDER_APPEAL",
  "CLOSED",
];

const CaseForm: React.FC<CaseFormProps> = ({
  onSubmit,
  disabled,
  initialValues,
  clients = [],
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewCasePayload>({
    defaultValues: {
      title: initialValues?.title || "",
      caseNumber: initialValues?.caseNumber || "",
      status: initialValues?.status || "OPEN",
      clientId: initialValues?.clientId || 0,
      court: initialValues?.court || "",
      firstHearingDate: initialValues?.firstHearingDate || "",
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        {...register("title", { required: "Required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        label="Case Number"
        fullWidth
        margin="normal"
        {...register("caseNumber", { required: "Required" })}
        error={!!errors.caseNumber}
        helperText={errors.caseNumber?.message}
      />
      <FormControl fullWidth margin="normal" error={!!errors.clientId}>
        <InputLabel>Client</InputLabel>
        <Controller
          name="clientId"
          control={control}
          rules={{
            required: "Required",
            min: { value: 1, message: "Required" },
          }}
          render={({ field }) => (
            <Select {...field} label="Client">
              <MenuItem value={0}>-- Select Client --</MenuItem>
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.clientId && (
          <FormHelperText>{errors.clientId.message}</FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field} label="Status">
              {caseStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <TextField
        label="Court"
        fullWidth
        margin="normal"
        {...register("court")}
      />
      <TextField
        label="First Hearing Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        {...register("firstHearingDate")}
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

export default CaseForm;

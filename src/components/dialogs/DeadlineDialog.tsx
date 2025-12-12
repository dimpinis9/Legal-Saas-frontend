import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { NewDeadlinePayload, DeadlineType } from "../../types/deadline";

interface DeadlineDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<NewDeadlinePayload, "caseFileId">) => void;
  disabled?: boolean;
}

const deadlineTypes: DeadlineType[] = [
  "COURT_HEARING",
  "FILING",
  "INTERNAL",
  "OTHER",
];

const DeadlineDialog: React.FC<DeadlineDialogProps> = ({
  open,
  onClose,
  onSubmit,
  disabled,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Omit<NewDeadlinePayload, "caseFileId">>();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Deadline</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title", { required: "Required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Controller
              name="type"
              control={control}
              defaultValue="OTHER"
              render={({ field }) => (
                <Select {...field} label="Type">
                  {deadlineTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("dueDate", { required: "Required" })}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={disabled}
            sx={{ mt: 2 }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeadlineDialog;

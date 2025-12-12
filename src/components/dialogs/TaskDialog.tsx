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
import type { NewTaskPayload, TaskStatus } from "../../types/task";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<NewTaskPayload, "caseFileId">) => void;
  disabled?: boolean;
}

const taskStatuses: TaskStatus[] = ["OPEN", "IN_PROGRESS", "DONE"];

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onClose,
  onSubmit,
  disabled,
}) => {
  const { register, handleSubmit, control, reset } =
    useForm<Omit<NewTaskPayload, "caseFileId">>();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title", { required: "Required" })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            {...register("description")}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              defaultValue="OPEN"
              render={({ field }) => (
                <Select {...field} label="Status">
                  {taskStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
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
            {...register("dueDate")}
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

export default TaskDialog;

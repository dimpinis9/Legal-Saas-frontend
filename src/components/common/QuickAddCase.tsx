import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi } from "../../api/casesApi";
import { clientsApi } from "../../api/clientsApi";
import type { CaseStatus } from "../../types/case";

interface QuickAddCaseProps {
  open: boolean;
  onClose: () => void;
}

const GREEK_COURTS = [
  "Ειρηνοδικείο Αθηνών",
  "Πρωτοδικείο Αθηνών",
  "Εφετείο Αθηνών",
  "Άρειος Πάγος",
  "Ειρηνοδικείο Θεσσαλονίκης",
  "Πρωτοδικείο Θεσσαλονίκης",
  "Εφετείο Θεσσαλονίκης",
  "Διοικητικό Πρωτοδικείο Αθηνών",
  "Διοικητικό Εφετείο Αθηνών",
  "Συμβούλιο της Επικρατείας",
];

const QuickAddCase: React.FC<QuickAddCaseProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);
  const [court, setCourt] = useState("");
  const [status, setStatus] = useState<CaseStatus>("OPEN");

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.getClients(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      casesApi.createCase({
        title,
        caseNumber,
        clientId: clientId!,
        status,
        court: court || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setTitle("");
    setCaseNumber("");
    setClientId(null);
    setCourt("");
    setStatus("OPEN");
  };

  const handleSubmit = () => {
    if (!title.trim() || !caseNumber.trim() || !clientId) return;
    createMutation.mutate();
  };

  const clients = clientsQuery.data || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Γρήγορη Προσθήκη Υπόθεσης</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Τίτλος Υπόθεσης *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Αριθμός Υπόθεσης *"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Πελάτης *</InputLabel>
            <Select
              value={clientId || ""}
              onChange={(e) => setClientId(Number(e.target.value))}
              label="Πελάτης *"
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            freeSolo
            options={GREEK_COURTS}
            value={court}
            onChange={(_, newValue) => setCourt(newValue || "")}
            onInputChange={(_, newInputValue) => setCourt(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="Δικαστήριο" fullWidth />
            )}
          />
          <FormControl fullWidth>
            <InputLabel>Κατάσταση</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              label="Κατάσταση"
            >
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="PENDING_HEARING">PENDING HEARING</MenuItem>
              <MenuItem value="UNDER_APPEAL">UNDER APPEAL</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ακύρωση</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !title.trim() ||
            !caseNumber.trim() ||
            !clientId ||
            createMutation.isPending
          }
        >
          Δημιουργία
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddCase;

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi } from "../../api/casesApi";
import { clientsApi } from "../../api/clientsApi";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { useNavigate } from "react-router-dom";
import CaseForm from "./CaseForm";
import type { NewCasePayload, CaseStatus } from "../../types/case";

const CasesListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<CaseStatus | "ALL">(
    "ALL"
  );

  const casesQuery = useQuery({
    queryKey: ["cases", statusFilter === "ALL" ? {} : { status: statusFilter }],
    queryFn: () =>
      casesApi.getCases(statusFilter === "ALL" ? {} : { status: statusFilter }),
  });

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.getClients(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: NewCasePayload) => casesApi.createCase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      setOpen(false);
    },
  });

  if (casesQuery.isLoading) return <LoadingState />;
  if (casesQuery.isError) return <ErrorState message="Failed to load cases" />;

  const cases = casesQuery.data || [];
  const clients = clientsQuery.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Cases</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CaseStatus | "ALL")
              }
              label="Status"
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="OPEN">OPEN</MenuItem>
              <MenuItem value="PENDING_HEARING">PENDING HEARING</MenuItem>
              <MenuItem value="UNDER_APPEAL">UNDER APPEAL</MenuItem>
              <MenuItem value="CLOSED">CLOSED</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Case
          </Button>
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Case Number</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>First Hearing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((c) => {
            const client = clients.find((cl) => cl.id === c.clientId);
            return (
              <TableRow
                key={c.id}
                hover
                onClick={() => navigate(`/cases/${c.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.caseNumber}</TableCell>
                <TableCell>
                  {client ? `${client.firstName} ${client.lastName}` : "-"}
                </TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  {c.firstHearingDate
                    ? new Date(c.firstHearingDate).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Case</DialogTitle>
        <DialogContent>
          <CaseForm
            disabled={createMutation.isPending}
            onSubmit={(values) => createMutation.mutate(values)}
            clients={clients}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CasesListPage;

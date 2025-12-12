import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "../../api/clientsApi.ts";
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
} from "@mui/material";
import LoadingState from "../../components/common/LoadingState.tsx";
import ErrorState from "../../components/common/ErrorState.tsx";
import { useNavigate } from "react-router-dom";
import ClientForm from "./ClientForm.tsx";
import type { NewClientPayload } from "../../types/client.ts";

const ClientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.getClients(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: NewClientPayload) => clientsApi.createClient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
    },
  });

  if (clientsQuery.isLoading) return <LoadingState />;
  if (clientsQuery.isError)
    return <ErrorState message="Failed to load clients" />;

  const clients = clientsQuery.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Clients</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Client
        </Button>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((c) => (
            <TableRow
              key={c.id}
              hover
              onClick={() => navigate(`/clients/${c.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>
                {c.firstName} {c.lastName}
              </TableCell>
              <TableCell>{c.email || "-"}</TableCell>
              <TableCell>{c.phone || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Client</DialogTitle>
        <DialogContent>
          <ClientForm
            disabled={createMutation.isPending}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientsListPage;

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { clientsApi } from "../../api/clientsApi";
import { casesApi } from "../../api/casesApi";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams();
  const clientId = Number(id);

  const clientQuery = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => clientsApi.getClient(clientId),
    enabled: !!clientId,
  });

  const casesQuery = useQuery({
    queryKey: ["cases", { clientId }],
    queryFn: () => casesApi.getCases({ clientId }),
    enabled: !!clientId,
  });

  if (clientQuery.isLoading || casesQuery.isLoading) return <LoadingState />;
  if (clientQuery.isError)
    return <ErrorState message="Failed to load client" />;
  if (casesQuery.isError) return <ErrorState message="Failed to load cases" />;

  const client = clientQuery.data;
  const cases = casesQuery.data || [];

  if (!client) return <ErrorState message="Client not found" />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {client.firstName} {client.lastName}
      </Typography>
      <Typography variant="body2" mb={2}>
        Email: {client.email || "-"}
      </Typography>
      <Typography variant="body2" mb={3}>
        Phone: {client.phone || "-"}
      </Typography>

      <Typography variant="h6" mb={1}>
        Case Files
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>First Hearing</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((cf) => (
            <TableRow key={cf.id}>
              <TableCell>{cf.title}</TableCell>
              <TableCell>{cf.status}</TableCell>
              <TableCell>
                {cf.firstHearingDate
                  ? new Date(cf.firstHearingDate).toLocaleDateString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
          {cases.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No cases.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ClientDetailsPage;

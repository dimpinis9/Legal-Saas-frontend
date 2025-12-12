import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { casesApi } from "../../api/casesApi";
import { clientsApi } from "../../api/clientsApi";
import { useNavigate } from "react-router-dom";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const casesQuery = useQuery({
    queryKey: ["cases"],
    queryFn: () => casesApi.getCases(),
    enabled: debouncedSearch.length > 0,
  });

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsApi.getClients(),
    enabled: debouncedSearch.length > 0,
  });

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearch]);

  const cases = casesQuery.data || [];
  const clients = clientsQuery.data || [];

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.court?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const filteredClients = clients.filter(
    (c) =>
      c.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.phone?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleCaseClick = (caseId: number) => {
    navigate(`/cases/${caseId}`);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleClientClick = (clientId: number) => {
    navigate(`/clients/${clientId}`);
    setSearchTerm("");
    setShowResults(false);
  };

  const isLoading = casesQuery.isLoading || clientsQuery.isLoading;
  const hasResults = filteredCases.length > 0 || filteredClients.length > 0;

  return (
    <Box sx={{ position: "relative", width: 400 }}>
      <TextField
        size="small"
        placeholder="Αναζήτηση υποθέσεων, πελατών..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onFocus={() => searchTerm && setShowResults(true)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: isLoading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: "white", borderRadius: 1 }}
      />

      {showResults && debouncedSearch.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: "auto",
            zIndex: 1000,
          }}
        >
          {!hasResults && !isLoading && (
            <Box py={3} textAlign="center">
              <Typography color="text.secondary">
                Δεν βρέθηκαν αποτελέσματα
              </Typography>
            </Box>
          )}

          {filteredCases.length > 0 && (
            <>
              <Box px={2} py={1} bgcolor="#f5f5f5">
                <Typography variant="caption" fontWeight="bold">
                  ΥΠΟΘΕΣΕΙΣ ({filteredCases.length})
                </Typography>
              </Box>
              <List>
                {filteredCases.slice(0, 5).map((caseItem) => (
                  <ListItemButton
                    key={caseItem.id}
                    onClick={() => handleCaseClick(caseItem.id)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {caseItem.title}
                          </Typography>
                          <Chip
                            label={caseItem.status}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={`${caseItem.caseNumber} • ${
                        caseItem.court || "—"
                      }`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {filteredCases.length > 0 && filteredClients.length > 0 && (
            <Divider />
          )}

          {filteredClients.length > 0 && (
            <>
              <Box px={2} py={1} bgcolor="#f5f5f5">
                <Typography variant="caption" fontWeight="bold">
                  ΠΕΛΑΤΕΣ ({filteredClients.length})
                </Typography>
              </Box>
              <List>
                {filteredClients.slice(0, 5).map((client) => (
                  <ListItemButton
                    key={client.id}
                    onClick={() => handleClientClick(client.id)}
                  >
                    <ListItemText
                      primary={`${client.firstName} ${client.lastName}`}
                      secondary={`${client.email || ""} ${client.phone || ""}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default GlobalSearch;

import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Download,
  Description,
  PictureAsPdf,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "../../api/documentsApi";
import type { Document, DocumentCategory } from "../../types/document";
interface DocumentsTabProps {
  caseFileId: number;
}

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  PETITION: "Αίτηση/Αγωγή",
  DECISION: "Απόφαση",
  CONTRACT: "Συμβόλαιο",
  EVIDENCE: "Αποδεικτικό",
  CORRESPONDENCE: "Αλληλογραφία",
  OTHER: "Άλλο",
};

const DocumentsTab: React.FC<DocumentsTabProps> = ({ caseFileId }) => {
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("OTHER");
  const [notes, setNotes] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  const documentsQuery = useQuery({
    queryKey: ["documents", { caseFileId }],
    queryFn: () => documentsApi.getDocuments({ caseFileId }),
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => documentsApi.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { category?: DocumentCategory; notes?: string };
    }) => documentsApi.updateDocument(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setEditingDoc(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploadError(null);

      Array.from(files).forEach((file) => {
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          setUploadError(`Μη υποστηριζόμενος τύπος αρχείου: ${file.name}`);
          return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          setUploadError(
            `Το αρχείο ${file.name} είναι πολύ μεγάλο (μέγιστο 10MB)`
          );
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("caseFileId", String(caseFileId));
        formData.append("category", category);
        formData.append("uploadedBy", "1"); // TODO: Get from auth context
        if (notes) formData.append("notes", notes);

        uploadMutation.mutate(formData);
      });

      setCategory("OTHER");
      setNotes("");
    },
    [caseFileId, category, notes, uploadMutation, ALLOWED_TYPES, MAX_FILE_SIZE]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const documents = Array.isArray(documentsQuery.data)
    ? documentsQuery.data
    : [];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf")
      return <PictureAsPdf sx={{ mr: 2, color: "#d32f2f", fontSize: 32 }} />;
    if (["jpg", "jpeg", "png"].includes(ext || ""))
      return <ImageIcon sx={{ mr: 2, color: "#1976d2", fontSize: 32 }} />;
    return (
      <Description sx={{ mr: 2, color: "text.secondary", fontSize: 32 }} />
    );
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Έγγραφα
      </Typography>

      {/* Error State */}
      {documentsQuery.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Αποτυχία φόρτωσης εγγράφων. Παρακαλώ δοκιμάστε ξανά.
        </Alert>
      )}

      {/* Upload Area */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          border: isDragging ? "3px dashed #1976d2" : "3px dashed #ccc",
          backgroundColor: isDragging ? "#e3f2fd" : "#fafafa",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            borderColor: "#1976d2",
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUpload
          sx={{
            fontSize: 64,
            color: isDragging ? "primary.main" : "text.secondary",
            mb: 2,
            transition: "all 0.3s",
          }}
        />
        <Typography
          variant="h6"
          mb={1}
          color={isDragging ? "primary" : "textPrimary"}
        >
          {isDragging ? "Αφήστε τα αρχεία εδώ!" : "Σύρετε & Αφήστε αρχεία εδώ"}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          ή κάντε κλικ για επιλογή από τον υπολογιστή σας
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" mb={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Κατηγορία</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              label="Κατηγορία"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Σημειώσεις (προαιρετικό)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ minWidth: 250 }}
          />
        </Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
        >
          Επιλογή Αρχείων
          <input
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </Button>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Επιτρεπόμενα: PDF, DOC, DOCX, JPG, PNG (μέγιστο 10MB)
        </Typography>
      </Paper>

      {/* Upload Progress */}
      {uploadMutation.isPending && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={20} />
            <Typography>Μεταφόρτωση σε εξέλιξη...</Typography>
          </Box>
        </Alert>
      )}

      {/* Upload Error */}
      {uploadError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setUploadError(null)}
        >
          {uploadError}
        </Alert>
      )}

      {/* Documents List */}
      {documentsQuery.isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          Δεν υπάρχουν έγγραφα
        </Typography>
      ) : (
        <List>
          {documents.map((doc) => (
            <ListItem
              key={doc.id}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                mb: 1,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              {getFileIcon(doc.fileName)}
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">{doc.fileName}</Typography>
                    <Chip
                      label={CATEGORY_LABELS[doc.category]}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(doc.fileSize)} •{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString("el-GR")}
                    </Typography>
                    {doc.notes && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        📝 {doc.notes}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => setEditingDoc(doc)}
                  sx={{ mr: 1 }}
                >
                  <Description />
                </IconButton>
                <IconButton
                  edge="end"
                  href={documentsApi.downloadDocument(doc.id)}
                  target="_blank"
                  sx={{ mr: 1 }}
                >
                  <Download />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => {
                    if (confirm(`Διαγραφή του "${doc.fileName}";`)) {
                      deleteMutation.mutate(doc.id);
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Edit Document Dialog */}
      <Dialog
        open={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Επεξεργασία Εγγράφου</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Όνομα Αρχείου"
              value={editingDoc?.fileName || ""}
              disabled
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Κατηγορία</InputLabel>
              <Select
                value={editingDoc?.category || "OTHER"}
                onChange={(e) =>
                  setEditingDoc((prev) =>
                    prev
                      ? {
                          ...prev,
                          category: e.target.value as DocumentCategory,
                        }
                      : null
                  )
                }
                label="Κατηγορία"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Σημειώσεις"
              value={editingDoc?.notes || ""}
              onChange={(e) =>
                setEditingDoc((prev) =>
                  prev ? { ...prev, notes: e.target.value } : null
                )
              }
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingDoc(null)}>Ακύρωση</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editingDoc) {
                updateMutation.mutate({
                  id: editingDoc.id,
                  payload: {
                    category: editingDoc.category,
                    notes: editingDoc.notes,
                  },
                });
              }
            }}
          >
            Αποθήκευση
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsTab;

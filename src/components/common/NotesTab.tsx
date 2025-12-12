import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Edit, LocalOffer } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "../../api/notesApi";
import type { Note } from "../../types/note";
import LoadingState from "./LoadingState";

interface NotesTabProps {
  caseFileId: number;
}

const NotesTab: React.FC<NotesTabProps> = ({ caseFileId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const notesQuery = useQuery({
    queryKey: ["notes", { caseFileId }],
    queryFn: () => notesApi.getNotes({ caseFileId }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      notesApi.createNote({
        caseFileId,
        content,
        tags,
        createdBy: 1, // TODO: Get from auth context
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      resetForm();
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: number) => notesApi.updateNote(id, { content, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      resetForm();
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notesApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const resetForm = () => {
    setContent("");
    setTags([]);
    setTagInput("");
    setEditingNote(null);
  };

  const handleOpen = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setContent(note.content);
      setTags(note.tags);
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (editingNote) {
      updateMutation.mutate(editingNote.id);
    } else {
      createMutation.mutate();
    }
  };

  if (notesQuery.isLoading) return <LoadingState />;

  if (notesQuery.isError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Σφάλμα κατά τη φόρτωση σημειώσεων. Παρακαλώ δοκιμάστε ξανά.
        </Alert>
      </Box>
    );
  }

  const notes = Array.isArray(notesQuery.data) ? notesQuery.data : [];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Σημειώσεις</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Νέα Σημείωση
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          Δεν υπάρχουν σημειώσεις
        </Typography>
      ) : (
        <List>
          {notes.map((note) => (
            <Paper key={note.id} sx={{ mb: 2, p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box flex={1}>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                  >
                    {note.content}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                    {note.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        icon={<LocalOffer />}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(note.createdAt).toLocaleString("el-GR")}
                    {note.updatedAt && " (επεξεργασμένο)"}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleOpen(note)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (confirm("Διαγραφή αυτής της σημείωσης;")) {
                        deleteMutation.mutate(note.id);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </List>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingNote ? "Επεξεργασία Σημείωσης" : "Νέα Σημείωση"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Περιεχόμενο"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={6}
              fullWidth
              autoFocus
            />
            <Box>
              <Typography variant="body2" mb={1}>
                Tags (π.χ. Δικάσιμος, Συμβόλαιο, Ευρώπη)
              </Typography>
              <Box display="flex" gap={1} mb={1}>
                <TextField
                  size="small"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Προσθήκη tag..."
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  Προσθήκη
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Ακύρωση</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            Αποθήκευση
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotesTab;

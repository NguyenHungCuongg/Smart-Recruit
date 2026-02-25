import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "error" | "warning" | "success" | "info";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmationDialogProps) => {
  const confirmBgByColor: Record<NonNullable<ConfirmationDialogProps["confirmColor"]>, string> = {
    primary: "var(--primary)",
    error: "var(--destructive)",
    warning: "#f59e0b",
    success: "#22c55e",
    info: "#3b82f6",
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "var(--radius)",
          bgcolor: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "var(--foreground)" }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: "var(--muted-foreground)" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "var(--foreground)",
            borderColor: "var(--border)",
            textTransform: "none",
          }}
          variant="outlined"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: confirmBgByColor[confirmColor],
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              opacity: 0.92,
            },
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth.ts";
import NotificationsMenu from "../common/NotificationsMenu.tsx";
import GlobalSearch from "../common/GlobalSearch.tsx";
import QuickAddCase from "../common/QuickAddCase.tsx";
import { LanguageSwitcher } from "../common/LanguageSwitcher.tsx";
import { useTranslation } from "react-i18next";

const Topbar: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Legal SaaS
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <GlobalSearch />
            <Tooltip title={t("dashboard.addCase")}>
              <IconButton
                color="inherit"
                onClick={() => setQuickAddOpen(true)}
                size="large"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <NotificationsMenu />
            <LanguageSwitcher />
            <Button color="inherit" onClick={logout}>
              {t("auth.logout")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <QuickAddCase
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </>
  );
};

export default Topbar;

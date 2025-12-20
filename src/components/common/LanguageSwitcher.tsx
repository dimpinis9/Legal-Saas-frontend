import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Language } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Language />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => changeLanguage("el")}
          selected={i18n.language === "el"}
        >
          Ελληνικά
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage("en")}
          selected={i18n.language === "en"}
        >
          English
        </MenuItem>
      </Menu>
    </>
  );
};

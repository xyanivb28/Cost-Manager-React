import LightModeTwoToneIcon from "@mui/icons-material/LightModeTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import {IconButton} from "@mui/material";

// eslint-disable-next-line react/prop-types
export function ModeSwitchButton({isDarkMode, onClick}) {

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        fontSize: 28,
        backgroundColor: 'primary.main',
        borderRadius: '20%',
        padding: 2,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        },
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {isDarkMode ? <LightModeTwoToneIcon sx={{ fontSize: 'inherit' }} /> : <DarkModeTwoToneIcon sx={{ fontSize: 'inherit' }} />}
    </IconButton>
  )
}
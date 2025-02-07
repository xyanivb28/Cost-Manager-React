import {Card, IconButton, Stack, Typography, useTheme} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

// eslint-disable-next-line react/prop-types
export default function ReportCard({id, description, category, quantity, date, sum, onDelete}) {
  const theme = useTheme();

  function handleDeleteReportCard() {
    onDelete(id);
  }

  return (
    <Card
      color="primary"
      sx={{
        width: "100%",
        backgroundColor: "background.default",
        transition: "0.3s",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >

      <Stack sx={{display: "flex", flexDirection: "row"}}>
        {/* info */}
        <Stack sx={{display: "flex", flexDirection: "column", width: "100%", p: 1}}>
          <Typography color={"primary"}>{description} - {quantity}X</Typography>
          <Typography color={"primary"}>{category}</Typography>
          <Typography>{new Date(date).toLocaleDateString()}</Typography>
        </Stack>

        <Stack sx={{display: "flex", flexDirection: "row", p: 1}}>
          {/* Sum */}
          <Typography sx={{alignSelf: "center", p: 1}}>{sum}$</Typography>

          {/* Delete icon button */}
          <IconButton
            onClick={handleDeleteReportCard}
            aria-label="delete"
            sx={{
              alignSelf: "center",
              color: "error.main",
              transition: "0.2s",
              "&:hover": {
                color: "error.dark",
                backgroundColor: "rgba(255, 0, 0, 0.1)" // Light red background on hover
              }
            }}
          >
            <DeleteIcon/>
          </IconButton>
        </Stack>

      </Stack>
    </Card>
  );
}
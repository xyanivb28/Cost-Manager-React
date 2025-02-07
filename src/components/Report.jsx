import {useState} from 'react';
import {Alert, Box, Divider, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo/index.js';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import ReportCard from "./ReportCard.jsx";
import {db} from "../idb.js";

export default function Report() {
  const [loading, setLoading] = useState(true);
  const [costItemsData, setCostItemsData] = useState([]);

  async function handleDate(event) {
    const month = event.$M;
    const year = event.$y;

    try {
      const costItems = await db.getAllCostItemsByMonthAndYear(month, year);

      if (costItems.length > 0) {
        setLoading(false);
        setCostItemsData(costItems);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching cost items:", error);
    }
  }

  async function onDeleteReportCard(costItemId) {
    try {
      await db.deleteCostItem(costItemId); // Assuming you have a function to delete from IndexedDB
      setCostItemsData(prevItems => prevItems.filter(item => item.id !== costItemId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting cost item:", error);
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{width: 800}}>
      <Typography variant="h4" color="secondary" sx={{mb: 2}}>
        Report
      </Typography>
      <Paper elevation={6} sx={{width: "100%", p: 3}}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={5}
          divider={<Divider orientation="horizontal" flexItem/>}
        >
          {/* Month and Year Selection */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                onChange={handleDate}
                disableFuture
                sx={{width: 260}}
                label={'Select Year and Month'}
                views={['month', 'year']}
              />
            </DemoContainer>
          </LocalizationProvider>

          {loading ? (
            <Stack direction="column" alignItems="center" spacing={1.5} sx={{width: "100%"}}>
              <Alert severity="info">No data available, Select different Date.</Alert>
              <Skeleton variant="rounded" sx={{height: 60, width: "100%"}}/>
              <Skeleton variant="rounded" sx={{height: 60, width: "100%"}}/>
              <Skeleton variant="rounded" sx={{height: 60, width: "100%"}}/>
              <Skeleton variant="rounded" sx={{height: 60, width: "100%"}}/>
              <Skeleton variant="rounded" sx={{height: 60, width: "100%"}}/>
            </Stack>
          ) : (
            <Stack sx={{display: "flex", flexDirection: "column", width:"100%"}} spacing={1}>
              {costItemsData.map((item) => (
              <ReportCard
                key={item.id}
                id={item.id}
                description={item.description}
                category={item.category}
                quantity={item.quantity}
                date={item.date}
                sum={item.sum}
                onDelete={onDeleteReportCard}
              />))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
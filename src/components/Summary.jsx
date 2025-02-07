import {
  Paper,
  Typography,
  Box, Stack, Divider, Alert,
} from "@mui/material";
import {PieChart} from "@mui/x-charts";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Skeleton} from "@mui/material";
import {useState} from "react";
import { db } from '../idb_modules.js';

export default function Summary() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  async function handleDate(value) {
    if (!value) return; // Ensure value is valid before proceeding

    const month = value.$M; // Month is 0-based, adjust to 1-based
    const year = value.$y;

    try {
      const costItems = await db.getAllCostItemsByMonthAndYear(month, year);

      if (costItems.length > 0) {
        updatePieChart(costItems);
      } else {
        setLoading(true);
        setChartData([]);
        setTotalSum(0);
      }
    } catch (error) {
      console.error("Error fetching cost items:", error);
    }
  }

  function updatePieChart(costItems) {
    setLoading(false);

    // Group costs by category and sum values
    const categoryMap = {};
    let sumTotal = 0; // Temporary variable for correct sum calculation

    costItems.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = 0;
      }
      const sum = parseFloat(item.sum);
      categoryMap[item.category] += sum;
      sumTotal += sum; // Correctly summing all values
    });

    // Convert to PieChart data format
    const pieChartData = Object.entries(categoryMap)
      .map(([label, value], index) => ({
        id: index,
        value, // Correctly sums up category values
        label,
      }));

    setChartData(pieChartData);
    setTotalSum(sumTotal); // Set the correct sum in state
  }



  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{width: 680}}>
      <Typography variant="h4" color="secondary" sx={{mb: 2}}>
        Summary
      </Typography>

      <Paper elevation={6} sx={{width: "100%", p: 3, maxHeight: 510}}>
        <Stack
          direction="column"
          alignItems="center"
          spacing={5}
          divider={<Divider orientation="horizontal" flexItem/>}
        >
          {/* Month and Year Selection */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer sx={{mt: 2}} components={['DatePicker']}>
              <DatePicker
                onChange={handleDate}
                disableFuture
                sx={{width: 260}}
                label={'Select Year and Month'}
                views={['month', 'year']}
              />
            </DemoContainer>
          </LocalizationProvider>

          {/* Pie Chart */}
          {loading ? (
            <Stack direction="column" alignItems="center" spacing={2}>
              <Alert severity="info">No data available, Select different Date.</Alert>
              <Skeleton variant="circular" width={250} height={250}/>
            </Stack>
          ) : (
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}$`,
                  data: chartData,
                  highlightScope: {fade: 'global', highlight: 'item'},
                  faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                },
              ]}
              height={200}
            />
          )}

          {/* Display total sum for month */}
          {totalSum > 0 ? (
            <Typography variant="h4" color="primary">
              Total: {totalSum}$
            </Typography>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
}

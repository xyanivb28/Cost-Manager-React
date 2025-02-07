import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button, Snackbar, Alert,
} from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { db } from "../idb.js";

export default function AddCost() {
  const MAX_CHAR_LIMIT = 100;
  const categories = [
    "food",
    "health",
    "housing",
    "sport",
    "education",
    "transportation",
    "entertainment",
  ];

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sum, setSum] = useState(0);
  const [date, setDate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Error state for each field
  const [errors, setErrors] = useState({
    description: false,
    category: false,
    quantity: false,
    sum: false,
    date: false,
  });

  function handleDescription(event) {
    const inputValue = event.target.value;
    if (inputValue.length <= MAX_CHAR_LIMIT) {
      setDescription(inputValue);
    }
  }

  function handleCategory(event) {
    setCategory(event.target.value);
  }

  function handleQuantity(event) {
    setQuantity(event.target.value.replace(/\D/g, ""));
  }

  function handleSum(event) {
    let inputValue = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      setSum(inputValue);
    }
  }

  // handle Date (have default current date)
  function handleDate(event) {
    if (event) {
      const day = event.$D;
      const month = event.$M;
      const year = event.$y;
      setDate(new Date(year, month, day));
    }
  }

  function handleClose(event, reason){
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  }

  // handle Add Cost
  async function handleAddCost() {
    // Validate required fields and set error states
    const newErrors = {
      description: description === "",
      category: category === "",
      quantity: quantity <= 0,
      sum: sum <= 0,
      date: !date,
    };

    setErrors(newErrors);

    // Check if any field has an error, and do not proceed if there is an error
    if (!Object.values(newErrors).includes(true)) {
      const costItem = {
        description: description,
        category: category,
        quantity: quantity,
        date: date,
        sum: sum,
      };

      try {
        await db.addCost(costItem);
        setSnackbarOpen(true);
        // Reset all fields
        setDescription("");
        setCategory("");
        setQuantity(1);
        setSum(0);
        setDate(new Date());

        console.log("Cost item added successfully.");
      } catch (error) {
        console.log("Error adding cost", error.message);
      }
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{width: 680}}>
      <Typography variant="h4" color="secondary" sx={{ mb: 2 }}>
        Add Cost Item
      </Typography>

      <Paper elevation={6} sx={{width:"100%", p: 3 }}>
        <form>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Description Field */}
            <TextField
              onChange={handleDescription}
              value={description}
              helperText={errors.description ? "Description is required" : `${MAX_CHAR_LIMIT - description.length} characters left`}
              label="Description"
              variant="outlined"
              required
              inputProps={{ maxLength: MAX_CHAR_LIMIT }}
              error={errors.description}
            />

            {/* Category Select */}
            <FormControl variant="outlined" error={errors.category}>
              <InputLabel required>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategory}
                label="Category"
                variant="outlined"
                required
                sx={{ mb: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography color="error" variant="body2">
                  Category is required
                </Typography>
              )}
            </FormControl>

            {/* Quantity Field */}
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={handleQuantity}
              inputProps={{ min: 1, step: "1" }}
              sx={{ mb: 2 }}
              error={errors.quantity}
              helperText={errors.quantity ? "Quantity must be greater than 0" : ""}
            />

            {/* Sum Field */}
            <FormControl fullWidth error={errors.sum}>
              <InputLabel required htmlFor="outlined-adornment-amount">
                Sum
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Sum"
                required
                value={sum}
                onChange={handleSum}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "[0-9]*[.,]?[0-9]{0,2}",
                }}
              />
              {errors.sum && (
                <Typography color="error" variant="body2">
                  Sum must be greater than 0
                </Typography>
              )}
            </FormControl>

            {/* Date Field */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  onChange={handleDate}
                  disableFuture
                  label="Select date"
                  sx={{ width: 260 }}
                />
              </DemoContainer>
            </LocalizationProvider>

            {/* Add Cost Button */}
            <Button
              onClick={handleAddCost}
              variant="contained"
              startIcon={<AddBoxOutlinedIcon />}
              sx={{ width: 140, alignSelf: "flex-end" }}
            >
              Add Cost
            </Button>

            {/* Snackbar to inform successful cost item added */}
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
              >
                Cost Item added successfully!
              </Alert>
            </Snackbar>

          </Box>
        </form>
      </Paper>
    </Box>
  );
}

import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Grid,
  CardHeader,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TextField,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { apiUrl } from "src/config";
import axios from "axios";
import { useTheme } from "@mui/system";
import dayjs from "dayjs";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const userId = parseInt(
  sessionStorage.getItem("user") || localStorage.getItem("user")
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const currentMonth = new Date().toLocaleString("default", { month: "long" });
const currentYear = new Date().getFullYear().toString();

export const QuotationChart = (props) => {
  const theme = useTheme();

  const [list, setList] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    dayjs(`${currentMonth} ${currentYear}`)
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const monthYear = date?.format("MMMM/YYYY").toLowerCase();
    const [month, year] = monthYear.split("/");

    axios
      .get(
        apiUrl +
          `groupByBasedOnStatus/${userId}/${
            month || currentMonth?.toLowerCase()
          }/${year || currentYear}`
      )
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    axios
      .get(
        apiUrl +
          `groupByBasedOnStatus/${userId}/${currentMonth?.toLowerCase()}/${currentYear}`
      )
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [currentYear, currentMonth]);
  

  const quotationListObject = {
    delivered: 0,
    cancelled: 0,
    waitingForApproval: 0,
    draft: 0,
    approved: 0,
  };

  list?.quotationList?.forEach(([count, status]) => {
    if (status === "Delivered") {
      quotationListObject.delivered = count;
    } else if (status === "Cancelled") {
      quotationListObject.cancelled = count;
    } else if (status === "Waiting for Approval") {
      quotationListObject.waitingForApproval = count;
    } else if (status === "Draft") {
      quotationListObject.draft = count;
    } else if (status === "Approved") {
      quotationListObject.approved = count;
    }
  });

  const data = {
    labels: [
      "Cancelled",
      "Approved",
      "Waiting for approval",
      "Delivered",
      "Draft",
    ],
    datasets: [
      {
        data: [
          quotationListObject?.cancelled,
          quotationListObject?.approved,
          quotationListObject?.waitingForApproval,
          quotationListObject?.delivered,
          quotationListObject?.draft,
        ],
        backgroundColor: [
          "#f3ab33",
          "#ea707f",
          "#c168a8",
          "#5b63a2",
          "#1b4e6b",
        ],
        borderColor: ["#f3ab33", "#ea707f", "#c168a8", "#5b63a2", "#1b4e6b"],
        borderWidth: 0,
        borderRadius: {
          topLeft: 10,
          topRight: 10,
        },
      },
    ],
  };

  const maxDataValue = Math.max(...data.datasets[0].data);
  const padding = 1;

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    hover: {
      mode: null, // Disable color change on hover
    },
    indexAxis: "x",
    barPercentage: 0.4,
    scales: {
      y: {
        grid: {
          display: false,
        },
        max: maxDataValue + padding,
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize - 2,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize - 2,
          },
        },
      },
    },
  };

  console.log(new Date());

  return (
    <Card>
      <CardHeader
        title="Quotation Status"
        subheader="Based on the selected period"
        action={
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  variant="filled"
                  label={"Month and Year"}
                  views={["month", "year"]}
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </DemoContainer>
            </LocalizationProvider>
            {/* <TextField
              id="filled-basic"
              label="Year"
              variant="filled"
              placeholder="YYYY"
              value={selectedYear}
              onChange={handleYear}
              sx={{ width: 100, mr: 3, mb: 1 }}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Month
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedMonth}
                onChange={handleChange}
                label="Month"
              >
                <MenuItem value="january">January</MenuItem>
                <MenuItem value="february">February</MenuItem>
                <MenuItem value="march">March</MenuItem>
                <MenuItem value="april">April</MenuItem>
                <MenuItem value="may">May</MenuItem>
                <MenuItem value="june">June</MenuItem>
                <MenuItem value="july">July</MenuItem>
                <MenuItem value="august">August</MenuItem>
                <MenuItem value="september">September</MenuItem>
                <MenuItem value="october">October</MenuItem>
                <MenuItem value="november">November</MenuItem>
                <MenuItem value="december">December</MenuItem>
              </Select>
            </FormControl> */}
          </>
        }
      />

      <Divider />
      <Grid container spacing={5} padding={2}>
        <Grid item xs={12} sm={3}>
          <Grid container direction="column" spacing={1}>
            <Grid
              item
              sx={{
                borderLeft: "7px solid #f3ab33",
                paddingLeft: 2,
                marginTop: 1,
                ml: 2,
              }}
            >
              <Typography variant="subtitle2">
                Cancelled: {quotationListObject?.cancelled}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                borderLeft: "7px solid #ea707f",
                paddingLeft: 2,
                marginTop: 1,
                ml: 2,
              }}
            >
              <Typography variant="subtitle2">
                Approved: {quotationListObject?.approved}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                borderLeft: "7px solid #c168a8",
                paddingLeft: 2,
                marginTop: 1,
                ml: 2,
              }}
            >
              <Typography variant="subtitle2">
                Waiting for Approval: {quotationListObject?.waitingForApproval}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                borderLeft: "7px solid #5b63a2",
                paddingLeft: 2,
                marginTop: 1,
                ml: 2,
              }}
            >
              <Typography variant="subtitle2">
                Delivered: {quotationListObject?.delivered}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                borderLeft: "7px solid #1b4e6b",
                paddingLeft: 2,
                marginTop: 1,
                ml: 2,
              }}
            >
              <Typography variant="subtitle2">
                Draft: {quotationListObject?.draft}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={9}>
          <div style={{ width: "95%" }}>
            <Bar data={data} options={chartOptions} height={80} />
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

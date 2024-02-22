import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import IconWithPopup from "../user/user-icon";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import {
  fetchAccessToken,
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchIndianStates,
} from "src/utils/api-service";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const customerType = [

  {
    label: "Distributor",
    value: "Distributor",
  },
  {
    label: "Retailer",
    value: "Retailer",
  },
  {
    label: "Manufacturer",
    value: "Manufacturer",
  },
];

const CreateCompany = () => {
  // country, state, city API access token
  const [accessToken, setAccessToken] = useState(null);

  //state management for countries,states and cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("India");
  const [currentState, setCurrentState] = useState("");
  const [currentCity, setCurrentCity] = useState("");

  //form state handling

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [gstn, setGstn] = useState("");
  const [touched, setTouched] = useState(false);
  const [pan, setPan] = useState("");

  const [userData, setUserData] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  ////

  const handleBlur = () => {
    setTouched(true);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasError = touched && !emailRegex.test(email);

  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    setUploadFile(file);

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      // Perform necessary operations with the file, such as saving or previewing

    } else {
      // Display an error message or perform any other error handling
      alert("Invalid file format. Please select a PNG or JPEG file.");
    }
  };

  //delete uploaded files from state
  const handleDeleteFile = (fileType) => {
    switch (fileType) {
      case "upload":
        setUploadFile(null);
        document.getElementById("upload").value = "";
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "firstname":
        setFirstName(value);
        break;
      case "lastname":
        setLastName(value);
        break;
      case "username":
        setUserName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "type":
        setType(value);
        break;
      case "pan":
        setPan(value);
        break;
      case "company":
        setCompany(value);
        break;
      case "gstn":
        setGstn(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "zipcode":
        setZipcode(value);
        break;
      default:
        break;
    }
  };
  ////
  //getting current date
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}/${month}/${day}`;
    setCurrentDate(formattedDate);
  }, []);

  //get access token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await fetchAccessToken();
        setAccessToken(accessToken);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  //fetches country list for dropdown and pushesh it to state which is later mapped
  const fetchCountriesData = useCallback(async () => {
    try {
      if (accessToken) {
        const countries = await fetchCountries(accessToken);
        setCountries(countries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, [accessToken]);

  //fetches states list for dropdown and pushesh it to setStates which is later mapped
  const handleCountry = async (event) => {
    try {
      setCurrentCountry(event.target.value);
      if (accessToken) {
        const states = await fetchStates(accessToken, event.target.value);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  //fetches cities list for dropdown and pushesh it to setCities which is later mapped
  const handleState = async (event) => {
    try {
      setCurrentState(event.target.value);
      if (accessToken) {
        const cities = await fetchCities(accessToken, event.target.value);
        setCities(cities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  //sets default country to India and fetches state list for India and is pushed to setStates
  const handleDefaultState = useCallback(async () => {
    try {
      if (currentCountry === "India" && accessToken) {
        const states = await fetchIndianStates(accessToken);
        setStates(states);
      }
    } catch (error) {
      console.error("Error fetching Indian states:", error);
    }
  }, [accessToken, currentCountry]);

  //useeffect fetch request being called on componet mount
  useEffect(() => {
    if (accessToken) {
      fetchCountriesData();
      handleDefaultState();
    }
  }, [accessToken, fetchCountriesData, handleDefaultState]);

  //sets current city value in MUI select field onchange event
  const handleCities = async (event) => {
    setCurrentCity(event.target.value);
  };

  //mapping countries to MUI select input field
  const userOptionsCountry = useMemo(() => {
    return countries?.map((country) => ({
      label: country.country_name,
      value: country.country_name,
    }));
  }, [countries]);

  //mapping states to MUI select input field
  const userOptionsState = useMemo(() => {
    return states?.map((state) => ({
      label: state.state_name,
      value: state.state_name,
    }));
  }, [states]);

  //mapping cities to MUI select input field
  const userOptionsCities = useMemo(() => {
    return cities?.map((city) => ({
      label: city.city_name,
      value: city.city_name,
    }));
  }, [cities]);
  //for sending response body via route
  const navigate = useNavigate();



  const handleClick = async (event) => {
    event.preventDefault();

    if (
      type &&
      company &&
      currentCountry &&
      currentState &&
      address &&
      currentCity &&
      zipcode &&
      pan &&
      gstn
    ) {
      try {
        const formData = new FormData();

        let jsonBodyData = {};

        let file = uploadFile;

        jsonBodyData.name = company;
        jsonBodyData.category = type;
        jsonBodyData.gstnumber = gstn;
        jsonBodyData.zipcode = zipcode;
        jsonBodyData.city = currentCity;
        jsonBodyData.state = currentState;
        jsonBodyData.country = currentCountry;
        jsonBodyData.pandcard = pan;
        jsonBodyData.address = address;
        jsonBodyData.createddate = new Date();
        jsonBodyData.logotype = uploadFile?.type;
        // jsonBodyData.createdByUser = { id: userId };
        // jsonBodyData.createdDate = new Date();

        formData.append("logo", file);
        formData.append("companywrapper", JSON.stringify(jsonBodyData));

        const response = await fetch(apiUrl + "createUpdateCompany", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Redirect to home page upon successful submission

          response.json().then((data) => {
            console.log(data);

            navigate("/dashboard/company/viewDetail", { state: data });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  return (
    <div style={{ minWidth: "100%", marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Create Company</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>
      <form>
        <Card>
          <CardHeader title="New Company" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company"
                  required
                  value={company}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="type"
                  required
                  onChange={handleInputChange}
                  value={type}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {customerType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PAN Card"
                  name="pan"
                  required
                  value={pan}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  name="gstn"
                  required
                  value={gstn}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  required
                  minRows={3}
                  name="address"
                  value={address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid />
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  defaultValue=""
                  value={currentCountry}
                  onChange={handleCountry}
                >
                  {userOptionsCountry?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  defaultValue=""
                  value={currentState}
                  onChange={handleState}
                  onFocus={handleDefaultState}
                >
                  {userOptionsState?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  required
                  defaultValue=""
                  value={currentCity}
                  onChange={handleCities}
                >
                  {userOptionsCities?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ZipCode"
                  name="zipcode"
                  required
                  value={zipcode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <div>
                  <div style={{ display: "inline-block" }}>
                    <Button
                      color="primary"
                      variant="contained"
                      align="right"
                      onClick={() =>
                        document.getElementById("upload").click()
                      }
                    >
                      Upload Company Logo
                    </Button>
                    {uploadFile && (
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteFile("upload")}
                        startIcon={<Delete />}
                        sx={{ color: "grey" }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    id="upload"
                    onChange={handleUploadChange}
                    style={{ display: "none" }}
                  />
                </div>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  File must be in PNG/JPEG format
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
      <Grid xs={12} md={6}>
        <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            variant="contained"
            align="right"
            onClick={handleClick}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

export default CreateCompany;

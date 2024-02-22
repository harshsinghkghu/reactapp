import PropTypes from "prop-types";

import {
  Card,
  CardHeader,
  Divider,
  Typography,
  Link,
  SvgIcon,
  Container,
  Stack,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { primaryColor } from "src/primaryColor";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useLocation } from "react-router-dom";
import User from "src/sections/dashboard/user/user-icon";
import Logo from "src/sections/dashboard/logo/logo";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import { apiUrl } from "src/config";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useEffect } from "react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

const Page = (props) => {
  const location = useLocation();
  const [logo1, setLogo1] = useState();
  const [state, setState] = useState(location.state);
  const [logoPreview, setLogoPreview] = useState(null);

  const [checked, setChecked] = useState(state?.isactive);
  const [editMode, setEditMode] = useState(false);
  //handle file uploads
  const [uploadFile, setUploadFile] = useState(null);
  const [modifiedValues, setModifiedValues] = useState({
    id: state?.id,
    password: state?.password,
    companyName: state?.companyName,
    userName: state?.emailId,
    firstName: state?.firstName,
    lastName: state?.lastName,
    emailId: state?.emailId,
    mobile: state?.mobile,
    address: state?.address,
    city: state?.city,
    state: state?.state,
    country: state?.country,
    type: state?.type,
    issuperuser: state?.issuperuser,
    isactive: state?.isactive,
    gstNumber: state?.gstNumber,
    pandcard: state?.pandcard,
    createdDate: state?.createdDate,
    pincode: state?.pincode,
    updatedDate: new Date(),
  });
  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    // Reset modified values to original state values
    setModifiedValues({
      id: state?.id,
      password: state?.password,
      companyName: state?.companyName,
      userName: state?.emailId,
      firstName: state?.firstName,
      lastName: state?.lastName,
      emailId: state?.emailId,
      mobile: state?.mobile,
      address: state?.address,
      city: state?.city,
      state: state?.state,
      country: state?.country,
      type: state?.type,
      isactive: checked,
      issuperuser: state?.issuperuser,
      gstNumber: state?.gstNumber,
      pandcard: state?.pandcard,
      createdDate: state?.createdDate,
      pincode: state?.pincode,
      updatedDate: new Date(),
    });
  };

    useEffect(() => {
      axios
        .get(apiUrl + `getUserLogo/${state?.id}`)
        .then((response) => {
          setLogo1(response.data[0]);
          console.log(response.data[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  const handleSaveClick = async () => {
    if (state?.id) {
      try {
        const response = await fetch(apiUrl + "addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedValues),
        });

        if (response.ok) {
          setEditMode(false);

          response.json().then(async (data) => {
            setState(data);

            if (uploadFile) {
              const formData = new FormData();

              let jsonBodyData = {};

              let file = uploadFile;

              jsonBodyData.fileName = "companylogo";
              jsonBodyData.fileType = uploadFile?.type;
              jsonBodyData.createdbyid = data.id;
              jsonBodyData.lastmodifybyid = null;
              jsonBodyData.createdDate = data.createdDate;
              jsonBodyData.lastModifiedDate = new Date();
              if (logo1?.id) {
                    jsonBodyData.fileId = logo1.id;
                  }


              formData.append("file", file);
              formData.append("fileWrapper", JSON.stringify(jsonBodyData));

              try {
                const uploadResponse = await fetch(apiUrl + "upload", {
                  method: "POST",
                  body: formData,
                });

                if (uploadResponse.ok) {
       
                  window.location.reload()
                } else {
                  console.error("Logo upload failed");
                }
              } catch (error) {
                console.error(error);
              }
            }
          });
          alert("userdata update success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUploadChange = (event) => {
    const file = event.target.files[0];

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setUploadFile(file);
      // Perform necessary operations with the file, such as saving or previewing
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
        setLogoPreview(null);
        document.getElementById("upload").value = "";
        break;
      default:
        break;
    }
  };

  //handle switch
  const handleChange = (event) => {
    const { checked } = event.target;
    setChecked(checked);

    setModifiedValues((prevValues) => ({
      ...prevValues,
      isactive: checked,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setModifiedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const align = "horizontal";

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <div style={{ minWidth: "100%", marginTop: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.logistics.adminView}
                    sx={{
                      alignItems: "center",
                      display: "inline-flex",
                    }}
                    underline="none"
                  >
                    <SvgIcon
                      sx={{
                        mr: 1,
                        width: 38,
                        height: 38,
                        transition: "color 0.5s",
                        "&:hover": { color: `${primaryColor}` },
                      }}
                    >
                      <ArrowCircleLeftOutlinedIcon />
                    </SvgIcon>
                    <Typography variant="subtitle2">
                      Back To{" "}
                      <span
                        style={{ color: `${primaryColor}`, fontWeight: 600 }}
                      >
                        admin list
                      </span>
                    </Typography>
                  </Link>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <Logo />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <User />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Admin Detail</h2>
                <Box
                  sx={{ mt: 3, mb: 2 }}
                  display="flex"
                  justifyContent="flex-end"
                  marginRight="12px"
                >
                  {editMode && (
                    <Button
                      color="primary"
                      variant="contained"
                      align="right"
                      onClick={handleCancelClick}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    align="right"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                </Box>
              </div>
              <Card style={{ marginBottom: "12px" }}>
                <PropertyList>
                  <PropertyListItem>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {editMode ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                          }}
                        >
                          <Box
                            component="img"
                            sx={{
                              height: 70,
                              width: "auto",
                              ml: 0,
                              mt: 0,
                              mb: 0,
                              mr: 3,
                            }}
                            alt="logo"
                            src={
                              logoPreview
                                ? `${logoPreview}`
                                : `data:${logo1?.fileType};base64, ${logo1?.fileData}`
                            }
                          />
                          <Grid>
                            <div>
                              <div style={{ display: "inline-block" }}>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  align="right"
                                  sx={{
                                    borderRadius: "50%",
                                    minWidth: 40,
                                    minHeight: 40,
                                    width: 40,
                                    height: 40,
                                    p: 0,
                                  }}
                                  onClick={() =>
                                    document.getElementById("upload").click()
                                  }
                                >
                                  <FileUploadRoundedIcon />
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
                          </Grid>
                        </div>
                      ) : (
                        <Box
                          component="img"
                          sx={{
                            height: 70,
                            width: "auto",
                            ml: 0,
                            mt: 0,
                            mb: 0,
                            mr: 2,
                          }}
                          alt="logo"
                          src={`data:${logo1?.fileType};base64, ${logo1?.fileData}`}
                        />
                      )}
                      <Box>
                        {editMode && (
                          <>
                            <Typography variant="h6" component="span">
                              Account Status:
                            </Typography>
                            <Switch
                              checked={checked}
                              onChange={handleChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </>
                        )}
                      </Box>
                    </Box>
                  </PropertyListItem>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <PropertyListItem align={align} label="First name">
                        {editMode ? (
                          <TextField
                            name="firstName"
                            value={modifiedValues.firstName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="subtitle2">
                            {state?.firstName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Email"
                        value={state?.emailId}
                      >
                        {editMode ? (
                          <TextField
                            name="emailId"
                            value={modifiedValues.emailId}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.emailId}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Company"
                        value={state?.companyName}
                      >
                        {editMode ? (
                          <TextField
                            name="companyName"
                            value={modifiedValues.companyName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.companyName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="GSTN NO"
                        value={state?.gstNumber}
                      >
                        {editMode ? (
                          <TextField
                            name="gstNumber"
                            value={modifiedValues.gstNumber}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.gstNumber}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Type"
                        value={state?.type}
                      >
                        {editMode ? (
                          <TextField
                            name="type"
                            value={modifiedValues.type}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">{state?.type}</Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Address"
                        value={state?.address}
                      >
                        {editMode ? (
                          <TextField
                            name="address"
                            value={modifiedValues.address}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.address}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="State"
                        value={state?.state}
                      >
                        {editMode ? (
                          <TextField
                            name="state"
                            value={modifiedValues.state}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.state}
                          </Typography>
                        )}
                      </PropertyListItem>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PropertyListItem
                        align={align}
                        label="Last name"
                        value={state?.lastName}
                      >
                        {editMode ? (
                          <TextField
                            name="lastName"
                            value={modifiedValues.lastName}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.lastName}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Phone"
                        value={state?.mobile}
                      >
                        {editMode ? (
                          <TextField
                            name="mobile"
                            value={modifiedValues.mobile}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.mobile}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="PAN"
                        value={state?.pandcard}
                      >
                        {editMode ? (
                          <TextField
                            name="pandcard"
                            value={modifiedValues.pandcard}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.pandcard}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="City"
                        value={state?.city}
                      >
                        {editMode ? (
                          <TextField
                            name="city"
                            value={modifiedValues.city}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">{state?.city}</Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Country"
                        value={state?.country}
                      >
                        {editMode ? (
                          <TextField
                            name="country"
                            value={modifiedValues.country}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.country}
                          </Typography>
                        )}
                      </PropertyListItem>
                      <Divider />
                      <PropertyListItem
                        align={align}
                        label="Pincode"
                        value={state?.pincode}
                      >
                        {editMode ? (
                          <TextField
                            name="pincode"
                            value={modifiedValues.pincode}
                            onChange={handleInputChange}
                            variant="standard"
                          />
                        ) : (
                          <Typography variant="body2">
                            {state?.pincode}
                          </Typography>
                        )}
                      </PropertyListItem>
                      {/* <Grid xs={12} md={6}>
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
                      </Grid> */}
                    </Grid>
                  </Grid>

                  <Divider />
                  {editMode && (
                    <Box
                      sx={{ mt: 3, mb: 2 }}
                      display="flex"
                      justifyContent="flex-end"
                      marginRight="12px"
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        align="right"
                        onClick={handleSaveClick}
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </PropertyList>
              </Card>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;

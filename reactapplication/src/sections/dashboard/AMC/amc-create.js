import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Icon,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  MenuItem,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { DatePicker } from "antd";
import "./purchase-order.css";
import IconWithPopup from "../user/user-icon";
import { useState, useEffect } from "react";
import axios from "axios";
import { primaryColor } from "src/primaryColor";
import EditIcon from "@mui/icons-material/Edit";
import { Scrollbar } from "src/components/scrollbar";
import React from "react";
import { Delete } from "@mui/icons-material";
import "./customTable.css";
import { useNavigate } from "react-router-dom";
import "moment-timezone";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";

//get userId
const userId = parseInt(
  sessionStorage.getItem("user") || localStorage.getItem("user")
);

//set customer type
const customerType = [
  {
    label: "Distributor",
    value: "distributor",
  },
  {
    label: "Retailer",
    value: "retailer",
  },
  {
    label: "Manufacturer",
    value: "manufacturer",
  },
];

//set status type
const userOptions = [
  {
    label: "Draft",
    value: "Draft",
  },
  {
    label: "Waiting for Approval",
    value: "Waiting for Approval",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Approved",
    value: "Approved",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
];

//parts row dimensions
const tableHeader = [
  {
    id: "product_name",
    name: "Product / Service Description",
    width: 200,
  },
  {
    id: "cost",
    name: "Unit Price",
    width: 150,
  },

  {
    id: "igst",
    name: "GST %",
    width: 150,
  },
  {
    id: "amount",
    name: "Net Amount",
    width: 150,
  },
  {
    id: "add",
    name: "",
    width: 50,
  },
  {
    id: "delete",
    name: "",
    width: 50,
  },
];

export const AmcCreateForm = (props) => {
  const [userData, setUserData] = useState([]);

  //react router haldle state transfer
  const navigate = useNavigate();
  //form state handeling
  const [userName, setUserName] = useState("");
  const [type, setType] = useState("");
  const [assignmentStart, setAssignmentStart] = useState("");
  const [assignmentEnd, setAssignmentEnd] = useState("");
  const [status, setStatus] = useState("");
  const [contactName, setContactName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [inchargeEmail, setInchargeEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tempId, setTempId] = useState();
  const [userState, setUserState] = useState();
  const [terms, setTerms] = useState("");
  const [comment, setComment] = useState("");
  const [technician, setTechnician] = useState("");
  const [technicianData, setTechnicianData] = useState([]);

  //add product state
  const [productName, setProductName] = useState("");
  const [workstation, setWorkstation] = useState();
  const [igst, setIgst] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [netAmount, setNetAmount] = useState();
  const [discount, setDiscount] = useState();
  //state related to parts row edit, delete, update
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [userData2, setUserData2] = useState([]);
  const [productId, setProductId] = useState();

  const [totalAmount, setTotalAmount] = useState(0);
  const [touched, setTouched] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "user":
        setUserName(value);
        break;
      case "contactName":
        setContactName(value);
        break;
      case "adminname":
        setAdminName(value);
        break;
      case "adminemail":
        setAdminEmail(value);
        break;
      case "adminphone":
        setAdminPhone(value);
        break;
      case "inchargeemail":
        setInchargeEmail(value);
        break;
      case "mobileno":
        setPhone(value);
        break;
      case "technician":
        setTechnician(value);
        break;
      case "type":
        setType(value);
        break;
      case "status":
        setStatus(value);
        break;
      default:
        break;
    }
  };

  //email validation
  const handleBlur = () => {
    setTouched(true);
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasError = touched && !emailRegex.test(adminEmail);
  const hasError2 = touched && !emailRegex.test(inchargeEmail);

  //assignment start and end
  const handleDateStart = (date) => {
    setAssignmentStart(date);
  };
  const handleDateEnd = (date) => {
    setAssignmentEnd(date);
  };

  //get temp user
  useEffect(() => {
    axios
      .get(apiUrl + `getAllTempUsers/${userId}`)
      .then((response) => {

        setTechnicianData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(apiUrl + `getAllUsersByType/${userId}/${type}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [type]);

  //convert assignment start date to iso string
  const deliveryDateAntd = assignmentStart;
  const deliveryDateJS = deliveryDateAntd ? deliveryDateAntd.toDate() : null;
  const deliveryIST = deliveryDateJS;
  //convert assignment  end date to iso string
  const deliveryDateAntd2 = assignmentEnd;
  const deliveryDateJS2 = deliveryDateAntd2 ? deliveryDateAntd2.toDate() : null;
  const deliveryIST2 = deliveryDateJS2;

  const filteredData = technicianData?.filter(
    (item) => item.type === "Technician"
  );

  //handles row delete
  const handleRemoveRow = (idx) => () => {
    const updatedRows = rows.filter((_, index) => index !== idx);
    setRows(updatedRows);

    const calculatedTotalAmount = updatedRows.reduce(
      (total, row) => total + row.netAmount,
      0
    );

    setTotalAmount(calculatedTotalAmount);
  };

  //show/hide popup form
  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
    setEditIndex(null);
    clearFormFields();
  };

  const handleModalClick = (event) => {
    if (event.target.classList.contains("modal")) {
      toggleForm();
    }
  };
  useEffect(() => {
    const calculatedNetAmount =
      workstation * price + (workstation * price * igst) / 100;
    const discountedAmount =
      calculatedNetAmount - (calculatedNetAmount * discount) / 100;
    setNetAmount(discountedAmount.toFixed(2));
  }, [workstation, price, igst, discount]);
  //handle parts submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (price && productName && description) {
      const newRow = {
        product: { id: productId },
        productName,
        unitPrice: parseFloat(price),
        discountpercent: parseFloat(discount),
        netAmount: parseFloat(netAmount),
        description,
        workstationcount: parseFloat(workstation),
        igst: parseFloat(igst),
        comment: comment,
      };

      let updatedRows;

      if (editIndex !== null) {
        updatedRows = [...rows];
        updatedRows[editIndex] = newRow;
        setRows(updatedRows);
      } else {
        updatedRows = [...rows, newRow];
        setRows(updatedRows);
      }

      clearFormFields();
      setShowForm(false);
      setEditIndex(null);

      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) => total + row.netAmount,
        0
      );

      setTotalAmount(calculatedTotalAmount);
    }
  };

  //handle row edit
  const handleEditRow = (idx, row) => {
    setProductName(row.productName);
    setPrice(row.unitPrice);
    setIgst(row.igst);
    setWorkstation(row.workstationcount);
    setDescription(row.description);
    setEditIndex(idx);
    setShowForm(true);
    setDiscount(row.discountpercent);
    setNetAmount(row.netAmount);
  };

  //handle clear form on save/close
  const clearFormFields = () => {
    setProductName("");
    setPrice("");
    setIgst("");
    setWorkstation("");
    setDescription("");
    setDiscount("");
    setNetAmount("");
  };

  //get parts
  useEffect(() => {
    axios
      .get(apiUrl + `getAllItem/${userId}`)
      .then((response) => {
        setUserData2(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //exclude product name from rows and include comments
  const updatedRows = rows.map(({ productName, netAmount, ...rest }) => ({
    ...rest,
    comment: comment,
  }));

  //handle work order submission
  const handleClick = async (event) => {
    let finalAmount = totalAmount.toFixed(2);

    event.preventDefault();

    if (
      contactName &&
      userId &&
      phone &&
      status &&
      comment &&
      terms &&
      updatedRows &&
      tempId
    ) {
      try {
        const response = await fetch(apiUrl + "addWorkOrderWithItems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workorder: {
              contactPersonName: contactName,
              contactPhoneNumber: phone,
              contactEmail: inchargeEmail,
              adminPersonName: adminName,
              adminPhoneNumber: adminPhone,
              adminEmail: adminEmail,
              status: status,
              type: type,
              category: "amc",
              startdate: deliveryIST,
              enddate: deliveryIST2,
              createdByUser: { id: userId },
              createdDate: new Date(),
              lastModifiedDate: new Date(),
              comments: comment,
              lastModifiedByUser: { id: userId },
              termsAndCondition: terms,
              //totalAmount: finalAmount,
              technicianInfo: { id: technician },
              noncompany: { id: tempId },
              paidamount: 0,
              //company: {id: userState},
            },
            workOrderItems: updatedRows,
            deleteWorkOrderItems: [],
          }),
        });

        if (response.ok) {
          // Redirect to home page upon successful submission

          response.json().then((data) => {
      const updatedData = { ...data, showpaid: true };
      navigate("/dashboard/services/amcDetail", { state: updatedData });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    } else if (
      contactName &&
      userId &&
      phone &&
      status &&
      updatedRows &&
      userState
    ) {
      try {
        const response = await fetch(apiUrl + "addWorkOrderWithItems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workorder: {
              contactPersonName: contactName,
              contactPhoneNumber: phone,
              contactEmail: inchargeEmail,
              adminPersonName: adminName,
              adminPhoneNumber: adminPhone,
              adminEmail: adminEmail,
              status: status,
              type: type,
              category: "amc",
              startdate: deliveryIST,
              enddate: deliveryIST2,
              createdByUser: { id: userId },
              createdDate: new Date(),
              lastModifiedDate: new Date(),
              comments: comment,
              lastModifiedByUser: { id: userId },
              termsAndCondition: terms,
              //totalAmount: finalAmount,
              technicianInfo: { id: technician },
              company: { id: userState },
            },
            workOrderItems: updatedRows,
            deleteWorkOrderItems: [],
          }),
        });

        if (response.ok) {
          // Redirect to home page upon successful submission

          response.json().then((data) => {
         const updatedData = { ...data, showpaid: true };
         navigate("/dashboard/services/amcDetail", { state: updatedData });
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  return (
    <div style={{ minWidth: "100%" }}>
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
          <h2 style={{ margin: 0 }}>Create AMC</h2>
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
          <CardHeader title="Product Order Detail" />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  required
                  value={type}
                  onChange={handleInputChange}
                >
                  {customerType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <DatePicker
                  placeholder="Assignment Start Date"
                  onChange={handleDateStart}
                  className="css-dev-only-do-not-override-htwhyh"
                  style={{ height: "58px", width: "250px", color: "red" }}
                  height="50px"
                />
              </Grid>
              <Grid xs={12} md={4}>
                <DatePicker
                  placeholder="Assignment End Date"
                  onChange={handleDateEnd}
                  className="css-dev-only-do-not-override-htwhyh"
                  style={{ height: "58px", width: "250px", color: "red" }}
                  height="50px"
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="user"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={userName}
                  onChange={(e) => {
                    const selectedOption = userData.find(
                      (option) => option.id === e.target.value
                    );
                    if (selectedOption) {
                      if (selectedOption.hasOwnProperty("isactive")) {
                        setUserState(selectedOption.id || "");
                        setTempId(null);
                      } else {
                        setTempId(selectedOption.id || "");
                        setUserState(null);
                      }
                    }
                    setUserName(e.target.value);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  {userData
                    .filter((option) => {
                      const capitalizedType =
                        type.charAt(0).toUpperCase() + type.slice(1);
                      return option.type === capitalizedType;
                    })
                    .map(
                      (option) =>
                        option.companyName && (
                          <MenuItem key={option.id} value={option.id}>
                            {option.companyName}
                          </MenuItem>
                        )
                    )}
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  required
                >
                  {userOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Resource"
                  name="technician"
                  required
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={technician}
                  onChange={handleInputChange}
                >
                  {filteredData?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.userName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Name"
                  name="adminname"
                  required
                  value={adminName}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Email"
                  name="adminemail"
                  required
                  value={adminEmail}
                  helperText={hasError && "Please enter a valid email."}
                  onBlur={handleBlur}
                  error={hasError}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Phone"
                  name="adminphone"
                  type="number"
                  required
                  value={adminPhone}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Name"
                  name="contactName"
                  required
                  value={contactName}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Email"
                  name="inchargeemail"
                  required
                  value={inchargeEmail}
                  helperText={hasError2 && "Please enter a valid email."}
                  onBlur={handleBlur}
                  error={hasError2}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Phone"
                  name="mobileno"
                  type="number"
                  required
                  value={phone}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
      <>
        <Box sx={{ position: "relative", overflowX: "auto" }}>
          <div className="purchase-popup">
            <Grid xs={12} md={6}>
              <Box
                sx={{ mt: 2, mb: 2 }}
                display="flex"
                justifyContent="flex-end"
                marginRight="12px"
              >
                <Button
                  color="primary"
                  variant="contained"
                  align="right"
                  onClick={toggleForm}
                >
                  Add Services
                </Button>
              </Box>
            </Grid>
            {showForm && (
              <div className="modal" onClick={handleModalClick}>
                <div className="modal-content-service">
                  <h5 className="product-detail-heading">
                    Add Product / Service Details
                  </h5>
                  <form className="form">
                    {/* Form fields */}
                    <div className="form-row">
                      <div className="popup-left">
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Product / Service"
                            name="name"
                            select
                            SelectProps={{
                              MenuProps: {
                                style: {
                                  maxHeight: 300,
                                },
                              },
                            }}
                            required
                            value={productName}
                            onChange={(e) => {
                              const selectedOption = userData2.find(
                                (option) =>
                                  option.productName === e.target.value
                              );
                              setProductId(selectedOption.id);
                              setProductName(e.target.value);
                              setDescription(selectedOption.description);
                              setDiscount(0);
                              setWorkstation(1);
                              setIgst(selectedOption.gstpercent);
                            }}
                            style={{ marginBottom: 10 }}
                          >
                            {userData2?.map((option) => (
                              <MenuItem
                                key={option.id}
                                value={option.productName}
                              >
                                {option.productName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Discount in %"
                            required
                            name="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="GST %"
                            name="igst"
                            required
                            type="number"
                            value={igst}
                            onChange={(e) => setIgst(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                      </div>
                      <div className="popup-right">
                        <Grid xs={12} md={6}></Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Unit Price"
                            name="cost"
                            required
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{ marginBottom: 10, marginTop: 68 }}
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Net Amount"
                            required
                            name="netamount"
                            type="number"
                            value={netAmount}
                            onChange={(e) => setNetAmount(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                      </div>
                    </div>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        required
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ marginBottom: 10 }}
                      />
                    </Grid>
                    <div className="submit-purchase">
                      <button
                        style={{
                          background: `${primaryColor}`,
                          marginRight: "20px",
                        }}
                        className="submit"
                        onClick={toggleForm}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ background: `${primaryColor}` }}
                        className="submit"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
          <Scrollbar>
            <Table sx={{ minWidth: 800, overflowX: "auto" }}>
              <TableHead>
                <TableRow>
                  {tableHeader.map((item, idx) => (
                    <TableCell sx={{ width: item.width }} key={idx}>
                      {item.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow hover key={idx}>
                    <TableCell>
                      <div>{row.description}</div>
                    </TableCell>
                    <TableCell>
                      <div>{row.unitPrice}</div>
                    </TableCell>

                    <TableCell>
                      <div>{row.igst}</div>
                    </TableCell>
                    <TableCell>
                      <div>{row.netAmount}</div>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditRow(idx, row)}>
                        <Icon>
                          <EditIcon />
                        </Icon>
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={handleRemoveRow(idx)}>
                        <Icon>
                          <Delete />
                        </Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>
        <br></br>
        <Grid xs={12} md={6}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Total Amount : {totalAmount.toFixed(2)}
          </label>
        </Grid>
        <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Terms &Conditions :
          </label>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6} style={{ marginTop: "20px" }}>
          <label
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "14px",
              marginRight: "6px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Comments :
          </label>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Grid>
      </>
      <Grid xs={12} md={6}>
        <Box
          sx={{ mt: 2, mb: 2 }}
          display="flex"
          justifyContent="flex-end"
          marginRight="12px"
        >
          <Button
            color="primary"
            variant="contained"
            align="right"
            onClick={handleClick}
          >
            Create AMC
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

AmcCreateForm.propTypes = {
  customer: PropTypes.object.isRequired,
};

import PropTypes from 'prop-types';
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
  Unstable_Grid2 as Grid
} from '@mui/material';
import { DatePicker } from 'antd';
import './purchase-order.css'
import IconWithPopup from '../user/user-icon';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import { primaryColor } from 'src/primaryColor';
import EditIcon from '@mui/icons-material/Edit';
import { Scrollbar } from 'src/components/scrollbar';
import React from 'react';
import { Delete } from '@mui/icons-material';
import './customTable.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import './customTable.css'
import 'moment-timezone';
import { apiUrl } from 'src/config';
import Logo from '../logo/logo';

const userId = parseInt(sessionStorage.getItem('user')|| localStorage.getItem('user'))
const dateFormat = 'M/D/YYYY, h:mm:ss A';


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
  {
    label: "Customer",
    value: "customer",
  },
];



const userOptions = [
  {
    label: 'Draft',
    value: 'Draft'
  },
  {
    label: 'Waiting for Approval',
    value: 'Waiting for Approval'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  },
  {
    label: 'Approved',
    value: 'Approved'
  },
  {
    label: 'Delivered',
    value: 'Delivered'
  },
  
 
];

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


export const QuotationServiceEditForm = (props) => {

  const location = useLocation();
  const state = location.state;
console.log(state)



  const [userData, setUserData]= useState([])
  const navigate = useNavigate();
//form state handeling

const [type, setType] = useState(state?.type||"");

const [deliveryDate, setDeliveryDate] = useState(dayjs(state?.startdate|| ''));
const [assignmentEnd, setAssignmentEnd]= useState(dayjs(state?.enddate|| ''))
const [status, setStatus] = useState(state?.status || "");
const [contactName,setContactName] = useState(state?.contactPersonName ||'')
const [adminName,setAdminName] = useState(state?.adminPersonName ||'')
const [adminEmail, setAdminEmail] = useState(state?.adminEmail ||'');
const [adminPhone, setAdminPhone] = useState(state?.adminPhoneNumber ||'');
const [inchargeEmail, setInchargeEmail] = useState(state?.contactEmail ||'');
const [phone, setPhone] = useState(state?.contactPhoneNumber ||'');
const [address, setAddress] = useState(state?.deliveryAddress || "");
const [tempId, setTempId] = useState(state?.tempUser?.id);
const [userState, setUserState] = useState(state?.companyuser?.id);
const [user, setUser] = useState(state?.tempUser?.id ||state?.companyuser?.id ||'')
const [terms, setTerms] = useState(state?.termsAndCondition || '');
const [comment, setComment] = useState(state?.comments||'');
const [category, setCategory] = useState('Service Quotation');


const [currentDate, setCurrentDate] = useState('');

//add product state
const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState('');
  const [sgst, setSgst] = useState();
  const [igst, setIgst] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [cgst, setCgst] = useState();
  const [size, setSize] = useState();
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [workstation, setWorkstation] = useState();

  const [userData2, setUserData2] = useState([])
  const [productId, setProductId] = useState()

  const [totalAmount, setTotalAmount] = useState(0);

  const [rowData, setRowData] =useState()
  const [dDate, setDDate] =useState(state?.deliveryDate)

  const [Id, setId] = useState()
  const [touched, setTouched] = useState(false);


      //deleted row
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    axios.get(apiUrl +`getAllQuotationDetails/${state?.id || state?.quotation?.id}`)
      .then(response => {
        const updatedData = response.data.map(obj => {
          let parsedProductId;
          let parsedProductName;
          try {
            const parsedProduct = obj.product;
            parsedProductId = parsedProduct.id;
            parsedProductName = parsedProduct.productName
          } catch (error) {
            console.error("Error parsing product JSON for object:", obj, error);
            parsedProductId = null;
            parsedProductName= null
          }
  
          return {
            ...obj,
            productName: parsedProductName,
            productId: parsedProductId ,
            product:{id: parsedProductId}
          };
        });

       setRowData(updatedData)
       setTotalAmount(state?.totalAmount)
      
      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.id, state?.quotation?.id , state?.totalAmount]);

  //currentdate
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleInputChange = (event) => {
  const { name, value } = event.target;

  switch (name) {
  
      case 'user':
        setUser(value);
          break;
      case 'contactName':
        setContactName(value);
        break;
      case 'adminname':
        setAdminName(value);
        break;
      case 'adminemail':
        setAdminEmail(value);
        break;
      case 'adminphone':
        setAdminPhone(value);
        break;
      case 'inchargeemail':
        setInchargeEmail(value);
        break;
      case 'mobileno':
        setPhone(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'status':
        setStatus(value);
        break;
    case 'address':
      setAddress(value);
        break;
    default:
      break;
  }
};

const handleBlur = () => {
  setTouched(true);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasError = touched && !emailRegex.test(adminEmail);
const hasError2 = touched && !emailRegex.test(inchargeEmail);
   //get temp user
   useEffect(() => {
    const request1 = axios.get(apiUrl +`getAllTempUsers/${userId}`);
    const request2 =  axios.get(apiUrl + `getAllUsersByType/${userId}/${type}`)
  
    Promise.all([request1, request2])
      .then(([response1, response2]) => {
        const tempUsersData = response1.data;
        const usersData = response2.data;
        const combinedData = usersData;
        setUserData(combinedData);
  
        const selecteduserId = combinedData.find((option) => (option.id !== 0 && option.id === state?.tempUserId) || option.id === state?.userId);
        const selecteduser = selecteduserId ? selecteduserId.companyName : '';

      })
      .catch(error => {
        console.error(error);
      });
  }, [state?.tempUserId, state?.userId, type]);

 
  const deliveryDateAntd = deliveryDate;
  const deliveryDateJS = deliveryDateAntd ? deliveryDateAntd.toDate() : null;
  const deliveryIST = deliveryDateJS;

 
  const deliveryDateAntd2 = assignmentEnd;
  const deliveryDateJS2 = deliveryDateAntd2 ? deliveryDateAntd2.toDate() : null;
  const deliveryIST2 = deliveryDateJS2;


 //assignment start and end
 const handleDateChange = (date) => {
  setDeliveryDate(date);
};

const handleDateEnd = (date) => {
  setAssignmentEnd(date)
};

  //////////////
  //add product//
  /////////////



  const handleRemoveRow = (idx, row) => () => {

    const deletedRow = { ...row }; 
    setDeletedRows((prevDeletedRows) => [...prevDeletedRows, deletedRow]);
  
      const updatedRows = rowData?.filter((_, index) => index !== idx);
      setRowData(updatedRows);
    
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
        total +
        row.workstationCount * row.price +
          (row.workstationCount * row.price * row.igst) / 100,
      0
      );
    
      setTotalAmount(calculatedTotalAmount);
    };

  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
    setEditIndex(null);
    clearFormFields();
  };

  const handleModalClick = (event) => {
    if (event.target.classList.contains('modal')) {
      toggleForm();
    }
  };

  const handleSubmit = (e) => {

    e.preventDefault();
  
    if (
     
      productName &&
   

      description
    ) {
      const newRow = {
        id: Id,
        product: {id : productId},
        productName,
        price: parseFloat(price),
        description,
        workstationCount: parseFloat(workstation),
        createdBy: userId,
        igst: parseFloat(igst),
        comments: comment,
        createdDate: new Date(),
        lastModifiedDate: new Date()
   
      };
  
      let updatedRows;
  
      if (editIndex !== null) {
        updatedRows = [...rowData];
        updatedRows[editIndex] = newRow;
        setRowData(updatedRows);
      } else {
        updatedRows = [...rowData, newRow];
        setRowData(updatedRows);
      }
  
      clearFormFields();
      setShowForm(false);
      setEditIndex(null);
  
      const calculatedTotalAmount = updatedRows.reduce(
        (total, row) =>
        total +
        row.workstationCount * row.price +
          (row.workstationCount * row.price * row.igst) / 100,
      0
      );
  
      setTotalAmount(calculatedTotalAmount);
    }
  };

  


  const handleEditRow = (idx, row) => {

console.log(idx, row)

    const selectedOption = userData2.find((option) => option.productName === row.productName);
    const selectedProductId = selectedOption ? selectedOption.id : '';

  setId(row.id)
  setProductId(selectedProductId);
  setProductName(row.productName);
  setWeight(row.weight);
  setQuantity(row.quantity);
  setWorkstation(row.workstationCount)
  setPrice(row.price);
  setCgst(row.cgst);
  setIgst(row.igst)
  setSgst(row.sgst)
  setSize(row.size)
  setDescription(row.description);
  setEditIndex(idx);
  setShowForm(true);
};
  

  const clearFormFields = () => {
    setProductName('');
    setWeight('');
    setQuantity('');
    setPrice('');
    setCgst('');
    setSize('')
    setIgst('')
    setSgst('')
    setDescription('');
    setWorkstation('')
  };

  //
  useEffect(() => {
    axios.get(apiUrl +`getAllItem/${userId}`)
      .then(response => {
        setUserData2(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  
  const updatedRows = rowData?.map(({ productName, inventory, productId,  ...rest }) => rest);
  const deleteRows= deletedRows?.map(({ productName, inventory, productId, ...rest }) => rest);

  //post request
  const handleClick = async (event) => {
    let finalAmount = parseFloat(totalAmount.toFixed(2))

    event.preventDefault();

      if (contactName && userId && phone && status && comment && terms && updatedRows) {
        try {
          const response = await fetch(apiUrl +'addQuoatation', {
            method: 'POST',
            headers: {
    
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quotation:{
                  id: state?.id,
                  createdBy: userId,
                  ...(tempId && { tempUser: { id: tempId } }),
                  ...(userState && { companyuser: { id: userState } }),
                  contactPersonName: contactName,
                  contactPhoneNumber: phone,    
                  contactEmail: inchargeEmail,
                  adminPersonName: adminName,
                  adminPhoneNumber: adminPhone,
                  adminEmail: adminEmail,   
                  status: status,
                  category: state?.category ,
                  type: type,
                  startdate: deliveryIST,
                  enddate: deliveryIST2,
                  lastModifiedDate: new Date(),
                  lastModifiedByUser: {id: userId},
                  createdDate: state?.originalcreatedDate,
                  comments : comment,
                  termsAndCondition: terms,
                  totalAmount: finalAmount,
              },
                  quotationDetails: updatedRows,
                  deletedQuotationDetails: deleteRows
          })
          });
          
          if (response.ok) {
            // Redirect to home page upon successful submission
        
           response.json().then(data => {
            navigate('/dashboard/quotation/viewDetail', { state: data });
            console.log(data)
      
    });
          } 
        } catch (error) {
          console.error('API call failed:', error);
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
          <h2 style={{ margin: 0 }}>Edit Quotation Order</h2>
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
          <CardHeader title="Order Detail" />
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
                  onChange={handleDateChange}
                  defaultValue={deliveryDate}
                  format="YYYY/MM/DD"
                  className="css-dev-only-do-not-override-htwhyh"
                  style={{ height: "58px", width: "250px", color: "red" }}
                  height="50px"
                />
              </Grid>
              <Grid xs={12} md={4}>
                <DatePicker
                  placeholder="Assignment End Date"
                  onChange={handleDateEnd}
                  defaultValue={assignmentEnd}
                  format="YYYY/MM/DD"
                  className="css-dev-only-do-not-override-htwhyh"
                  style={{ height: "58px", width: "250px", color: "red" }}
                  height="50px"
                />
              </Grid>
              <Grid xs={12} md={4}>
                {" "}
                <TextField
                  fullWidth
                  label="Company Name"
                  name="user"
                  select
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  value={user}
                  onChange={(e) => {
                    const selectedOption = userData?.find(
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
                    setUser(e.target.value);
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
                  label="Category"
                  name="category"
                  value={category}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Name"
                  name="adminname"
                  value={adminName}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Email"
                  name="adminemail"
                  helperText={hasError && "Please enter a valid email."}
                  onBlur={handleBlur}
                  error={hasError}
                  value={adminEmail}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="TechMaadhyam Project Manager Phone"
                  type="number"
                  name="adminphone"
                  value={adminPhone}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Name"
                  name="contactName"
                  value={contactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Email"
                  name="inchargeemail"
                  helperText={hasError2 && "Please enter a valid email."}
                  onBlur={handleBlur}
                  error={hasError2}
                  value={inchargeEmail}
                  onChange={handleInputChange}
                ></TextField>
              </Grid>
              <Grid xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Contact Person Phone"
                  type="number"
                  name="mobileno"
                  value={phone}
                  onChange={handleInputChange}
                />
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
                            value={productName}
                            onChange={(e) => {
                              const selectedOption = userData2.find(
                                (option) =>
                                  option.productName === e.target.value
                              );
                              setProductId(selectedOption.id);
                              setProductName(e.target.value);
                              setDescription(selectedOption.description);
                              setIgst(selectedOption.gstpercent);
                              setWorkstation(1);
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
                            label="Unit Price"
                            name="cost"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{ marginBottom: 10 }}
                          />
                        </Grid>
                      </div>
                      <div className="popup-right">
                        <Grid xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="GST %"
                            name="igst"
                            type="number"
                            value={igst}
                            onChange={(e) => setIgst(e.target.value)}
                            style={{ marginBottom: 10, marginTop: 68 }}
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
                        rows={4}
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
                {rowData?.map((row, idx) => (
                  <TableRow hover key={idx?.id}>
                    <TableCell>
                      <div>{row.description}</div>
                    </TableCell>
                    <TableCell>
                      <div>{row.price}</div>
                    </TableCell>

                    <TableCell>
                      <div>{row.igst}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {(
                          row.workstationCount * row.price +
                          (row.workstationCount * row.price * row.igst) / 100
                        ).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditRow(idx, row)}>
                        <Icon>
                          <EditIcon />
                        </Icon>
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={handleRemoveRow(idx, row)}>
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
            maxRows={8}
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
            maxRows={4}
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
            Create Quotation
          </Button>
        </Box>
      </Grid>
    </div>
  );
};

QuotationServiceEditForm.propTypes = {
  customer: PropTypes.object.isRequired
};
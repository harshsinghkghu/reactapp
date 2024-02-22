import {
  Unstable_Grid2 as Grid,
  Typography,
  IconButton,
  Icon,
  Link,
} from "@mui/material";
import { Table } from "antd";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import IconWithPopup from "../user/user-icon";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./product.css";
import { apiUrl } from "src/config";
import Logo from "../logo/logo";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputBase,
} from "@mui/material";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const typeDropdown = [
  {
    label: "Parts",
    value: "Parts",
  },
  {
    label: "Spare Parts",
    value: "Spare Parts",
  },
];

const ViewProduct = () => {
  const [userData, setUserData] = useState([]);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  //product
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  //warehouse
  const [isSearchingWarehouse, setIsSearchingWarehouse] = useState(false);
  const [warehouseText, setWarehouseText] = useState("");
  //category
  const [isSearchingCategory, setIsSearchingCategory] = useState(false);
  const [categoryText, setCategoryText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(apiUrl + `getAllItem/${userId}`)
      .then((response) => {
        setUserData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));

  const filteredData = selectedCategory
    ? dataWithKeys.filter((item) => item.type === selectedCategory)
    : dataWithKeys;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //toast notification from toastify library
  const notify = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleRemoveRow = async () => {
    try {
      await axios.delete(apiUrl + `deleteItemById/${selectedProductId}`);
      const updatedRows = userData.filter(
        (item) => item.id !== selectedProductId
      );
      setUserData(updatedRows);
      notify("success", `Successfully deleted product row.`);
    } catch (error) {
      console.error("Error deleting row:", error.message);
      notify("error", `This record is linked with Quotation Order or AMC.`);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = (productId) => {
    setSelectedProductId(productId);
    setOpen(true);
  };

  const handleEditRecord = (record) => {
    setEditRecord(record);
    setPopupVisible(true);
  };

  const handleSaveRecord = async (editedRecord) => {
    console.log("Saving edited record:", editedRecord);

    if (currentDate) {
      try {
        const response = await fetch(apiUrl + "addProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: {
              id: editedRecord.id,
              productName: editedRecord.productName,
              partnumber: editedRecord.partnumber,
              type: editedRecord.type,
              description: editedRecord.description,
              createdBy: editedRecord.createdBy,
              lastModifiedDate: new Date(),
              lastModifiedByUser: { id: userId },
            },
            category: {
              id: editedRecord.category.id,
            },
          }),
        });

        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
  };

  console.log(selectedCategory);
  //Get date
  useEffect(() => {
    const today = new Date();
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const formattedDate = today.toLocaleDateString("IN", options);
    setCurrentDate(formattedDate);
  }, []);

  //product search
  const handleProductClick = () => {
    setIsSearching(true);
  };

  const handleProductInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleProductCancel = () => {
    setIsSearching(false);
    setSearchText("");
  };

  const filteredProducts = filteredData.filter((product) => {
    const productNameMatch = product.productName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    return searchText === "" || productNameMatch;
  });

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center" }}>
          {!isSearching ? (
            <>
              <Typography variant="subtitle2">Product Name</Typography>
              <IconButton onClick={handleProductClick}>
                <SearchIcon />
              </IconButton>
            </>
          ) : (
            <>
              <InputBase
                value={searchText}
                onChange={handleProductInputChange}
                placeholder="Search Name..."
              />
              <IconButton onClick={handleProductCancel}>
                <Icon>
                  <HighlightOffIcon />
                </Icon>
              </IconButton>
            </>
          )}
        </div>
      ),
      dataIndex: "productName",
      key: "productName",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate(`/dashboard/products/viewDetail/${record.id}`, {
            state: record,
          });
        };

        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: "center",
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      dataIndex: "actionEdit",
      key: "actionEdit",
      render: (_, record) => (
        <Link>
          <IconButton onClick={() => handleEditRecord(record)}>
            <Icon>
              <EditIcon />
            </Icon>
          </IconButton>
        </Link>
      ),
    },
    {
      dataIndex: "actionDelete",
      key: "actionDelete",
      render: (_, row) => (
        <IconButton onClick={() => handleConfirmDelete(row.id)}>
          <Icon>
            <Delete />
          </Icon>
        </IconButton>
      ),
    },
  ];

  const PopupComponent = ({ record, onClose, onSave }) => {
    const [editedRecord, setEditedRecord] = useState(record);

    const handleChange = (event) => {
      const { name, value } = event.target;

      if (name === "category") {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          category: {
            ...prevRecord.category,
            name: value,
          },
        }));
      } else if (name === "description") {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          category: {
            ...prevRecord.category,
            description: value,
          },
        }));
      } else {
        setEditedRecord((prevRecord) => ({
          ...prevRecord,
          [name]: value,
        }));
      }
    };

    const handleSave = () => {
      onSave(editedRecord);
      onClose();
    };

    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={12}>
              <TextField
                label="Product Name"
                name="productName"
                fullWidth
                value={editedRecord.productName}
                onChange={handleChange}
              />
            </Grid>

            {/* <Grid
              xs={6}
              md={6}
            >
          <TextField
            label="Type"
            name="type"
            select
            value={editedRecord.type}
            onChange={handleChange}
            style={{ marginBottom: 10 }}
          >
             {typeDropdown.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
          </TextField>
          </Grid> */}
            <Grid xs={12} md={12}>
              <TextField
                label="Product description"
                name="description"
                value={editedRecord.description}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
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
          <h2 style={{ margin: 0 }}>View Products / Services</h2>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Logo />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <IconWithPopup />
        </div>
      </div>

      {/* <TextField

      label="Type"
      name="type"
      sx={{ minWidth: 250 }}
      value={selectedCategory}
      onChange={handleCategoryChange}
      select
      >
     <MenuItem value="">All</MenuItem>
        {typeDropdown.map((option) => (
          <MenuItem key={option.value} 
          value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}
      <Box sx={{ position: "relative", overflowX: "auto", marginTop: "30px" }}>
        {loading === false ? (
          <Scrollbar>
            <Table
              sx={{ minWidth: 800, overflowX: "auto" }}
              columns={columns}
              dataSource={filteredProducts}
              rowClassName={() => "table-data-row"}
            ></Table>
          </Scrollbar>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <CircularProgress />
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Box>
      {open && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRemoveRow} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isPopupVisible && editRecord && (
        <PopupComponent
          record={editRecord}
          onClose={() => setPopupVisible(false)}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default ViewProduct;

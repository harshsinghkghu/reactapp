import {
    Unstable_Grid2 as Grid,
    Typography,
    IconButton,
    Icon,
    Link,
    InputBase,
} from "@mui/material";
import { Table } from "antd";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import IconWithPopup from "src/sections/dashboard/user/user-icon";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { apiUrl } from "src/config";
import Logo from "src/sections/dashboard/logo/logo";
import CircularProgress from "@mui/material/CircularProgress";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    CardContent,
} from "@mui/material";

//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const ViewAppUser = () => {
    const [userData, setUserData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(apiUrl + `getAllAppUser`)
            .then((response) => {
                setUserData(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const dataWithKeys = userData.map((item) => ({ ...item, key: item.id }));

    const filteredList = dataWithKeys?.filter((product) => {
        const companyMatch = product.company.name
            .toLowerCase()
            .includes(searchText.toLowerCase());

        return companyMatch;
    });
    ;

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
            await axios.delete(
              apiUrl + `deleteAppUserById/${selectedProductId}`
            );
            const updatedRows = userData.filter(
                (item) => item.id !== selectedProductId
            );
            setUserData(updatedRows);
            notify("success", `Sucessfully deleted app user row.`);
        } catch (error) {
            console.error("Error deleting row:", error.message);
            notify(
              "error",
              `Data is linked to another section, unable to delete.`
            );
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



  const handleNavigation = (record) => {
   
      navigate("/dashboard/appUser/edit", { state: record });
    
  };

    //company search
    const handleNameClick = () => {
        setIsSearching(true);
    };

    const handleNameInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleNameCancel = () => {
        setIsSearching(false);
        setSearchText("");
    };

    const columns = [
      {
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!isSearching ? (
              <>
                <Typography variant="subtitle2">Company Name</Typography>
                <IconButton onClick={handleNameClick}>
                  <SearchIcon />
                </IconButton>
              </>
            ) : (
              <>
                <InputBase
                  value={searchText}
                  onChange={handleNameInputChange}
                  placeholder="Search user..."
                />
                <IconButton onClick={handleNameCancel}>
                  <Icon>
                    <HighlightOffIcon />
                  </Icon>
                </IconButton>
              </>
            )}
          </div>
        ),
        key: "company",
        dataIndex: "company",
        // render: (name) => name.name,
        render: (name, record) => {
          const handleNavigation = () => {
            navigate("/dashboard/appUser/viewDetail", {
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
              <Typography variant="subtitle1">{name.name}</Typography>
            </Link>
          );
        },
      },
      {
        title: "User Name",
        key: "username",
        dataIndex: "username",
      },
      {
        title: "GSTN",
        key: "gstnumber",
        dataIndex: "gstnumber",
      },
      {
        title: "PAN",
        key: "pandcard",
        dataIndex: "pandcard",
      },
      {
        title: "Category",
        key: "category",
        dataIndex: "category",
      },

      {
        dataIndex: "actionEdit",
        key: "actionEdit",
        render: (_, record) => (
          <Link>
            <IconButton onClick={() => handleNavigation(record)}>
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
                    <h2 style={{ margin: 0 }}>View App Users</h2>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <Logo />
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <IconWithPopup />
                </div>
            </div>
            <Box sx={{ position: "relative", overflowX: "auto" }}>
                {loading === false ? (
                    <Scrollbar>
                        <Table
                            sx={{ minWidth: 800, overflowX: "auto" }}
                            columns={columns}
                            dataSource={filteredList}
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
                        Are you sure you want to delete this app user?
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
         
        </div>
    );
};

export default ViewAppUser;

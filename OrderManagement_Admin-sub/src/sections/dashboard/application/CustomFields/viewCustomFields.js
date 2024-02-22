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

const fieldType = [
  {
    label: "Textfield",
    value: "Textfield",
  },
  {
    label: "Dropdown",
    value: "Dropdown",
  },
  {
    label: "TabField",
    value: "TabField",
  }
];
//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const ViewCustomFields = () => {
  const [userData, setUserData] = useState([]);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedType, setSelectedType] = useState("Technician");
  const [login, setLogin] = useState([]);
  const [tabsData, setTabsData] = useState([]);
  const [breakpoint, setBreakpoint] = useState(0);
  const email = sessionStorage.getItem("mail") || localStorage.getItem("mail");
  const password = sessionStorage.getItem("password") || localStorage.getItem("password");
  useEffect(() => {
    axios
      .get(apiUrl + `getAppUser/${email}/${password}`)
      .then((response) => {
        setLogin(response.data[0]);
        // console.log(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [email, password]);

  if (login.company
    && login.profile
    && login.company.id
    && login.profile.id
    && breakpoint === 0) {
    axios
      .get(apiUrl + `getSchemaTabs/${login.company.id}/${login.profile.id}`)
      .then((response) => {
        setTabsData(response.data);
        console.log(response.data);
        setBreakpoint(1);
      })
      .catch((error) => {
        console.error("tabs is not working");
      });
  }

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(apiUrl + `getAllFields`)
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
    const companyMatch = product.fieldname
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return companyMatch;
  });
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
      await axios.delete(apiUrl + `deleteAppObjFieldById/${selectedProductId}`);
      const updatedRows = userData.filter(
        (item) => item.id !== selectedProductId
      );
      setUserData(updatedRows);
      notify("success", `Sucessfully deleted field row.`);
    } catch (error) {
      console.error("Error deleting row:", error.message);
      notify("error", `Data is linked to another section, unable to delete.`);
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
    if (editedRecord) {
      try {
        const response = await fetch(apiUrl + "createUpdateAppObjField", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editedRecord.id,
            fieldname: editedRecord.fieldname,
            fieldlabel: editedRecord.fieldlabel,
            fieldtype: editedRecord.fieldtype,
            description: editedRecord.description,
            createddate: editedRecord.createddate,
            dropdownlovs: editedRecord.dropdownlovs,
            tabid: editedRecord.tabid,
            lastmodifieddate: new Date(),
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
              <Typography variant="subtitle2">Field Name</Typography>
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
      key: "fieldname",
      dataIndex: "fieldname",
      render: (name, record) => {
        const handleNavigation = () => {
          navigate("/dashboard/application/field/detail", { state: record });
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
      title: "Field Label",
      key: "fieldlabel",
      dataIndex: "fieldlabel",
    },
    {
      title: "Field Type",
      key: "fieldtype",
      dataIndex: "fieldtype",
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
      setEditedRecord((prevRecord) => ({
        ...prevRecord,
        [name]: value,
      }));
    };

    const handleSave = () => {
      onSave(editedRecord);
      onClose();
    };

    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Edit Custom Field</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                label="Field Name"
                name="fieldname"
                fullWidth
                value={editedRecord.fieldname}
                onChange={handleChange}
              />
            </Grid>
            <Grid />
            <Grid xs={12} md={6}>
              <TextField
                label="Field Label"
                name="fieldlabel"
                fullWidth
                value={editedRecord.fieldlabel}
                onChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                label="Field Type"
                name="fieldtype"
                fullWidth
                value={editedRecord?.fieldtype}
                onChange={handleChange}
                select
                SelectProps={{
                  MenuProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {fieldType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid xs={12} md={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={2}
                value={editedRecord.description}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {
              editedRecord.fieldtype === "TabField" ? (
                <Grid xs={12} md={6}>
                  <TextField
                    label="Tab Id"
                    name="tabid"
                    fullWidth
                    value={editedRecord?.tabid}
                    onChange={handleChange}
                    select
                    SelectProps={{
                      MenuProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {tabsData.map((option) => (
                      <MenuItem key={option.tabid} value={option.tabid}>
                        {option.tabname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : null}
            {
              editedRecord.fieldtype === "Dropdown" ? (
                <Grid xs={12} md={12}>
                  <TextField
                    label="Dropdown Values"
                    name="dropdownlovs"
                    multiline
                    rows={2}
                    value={editedRecord.dropdownlovs}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>) : null}
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
          <h2 style={{ margin: 0 }}>View Custom Fields</h2>
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
            Are you sure you want to delete this field?
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

export default ViewCustomFields;

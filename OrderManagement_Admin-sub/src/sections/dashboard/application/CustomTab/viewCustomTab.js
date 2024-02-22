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

// Add icon options imports here
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import StoreMallDirectoryTwoToneIcon from "@mui/icons-material/StoreMallDirectoryTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import ProductionQuantityLimitsTwoToneIcon from "@mui/icons-material/ProductionQuantityLimitsTwoTone";
import AddchartIcon from '@mui/icons-material/Addchart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const iconOptions = [
    {
        label: "Home",
        value: "HomeIcon",
        icon: <HomeIcon />,
    },
    {
        label: "Accouting 1",
        value: "BusinessTwoToneIcon",
        icon: <BusinessTwoToneIcon />,
    },
    {
        label: "Accouting 2",
        value: "AddchartIcon",
        icon: <AddchartIcon />,
    },
    {
        label: "Accouting 3",
        value: "AccountBalanceIcon",
        icon: <AccountBalanceIcon />,
    },
    {
        label: "Warehouse 1",
        value: "WarehouseOutlinedIcon",
        icon: <WarehouseOutlinedIcon />,
    },
    {
        label: "Warehouse 2",
        value: "StorefrontTwoToneIcon",
        icon: <StorefrontTwoToneIcon />,
    },
    {
        label: "Warehouse 3",
        value: "StoreMallDirectoryTwoToneIcon",
        icon: <StoreMallDirectoryTwoToneIcon />,
    },
    {
        label: "Warehouse 4",
        value: "FactoryTwoToneIcon",
        icon: <FactoryTwoToneIcon />,
    },
    {
        label: "Product 1",
        value: "AddTwoToneIcon",
        icon: <AddTwoToneIcon />,
    },
    {
        label: "Product 2",
        value: "ProductionQuantityLimitsTwoToneIcon",
        icon: <ProductionQuantityLimitsTwoToneIcon />,
    },
    {
        label: "Sell",
        value: "StorefrontIcon",
        icon: <StorefrontIcon />,
    },
    {
        label: "User1",
        value: "GroupIcon",
        icon: <GroupIcon />,
    },
    {
        label: "User2",
        value: "ManageAccountsIcon",
        icon: <ManageAccountsIcon />,
    },
    {
        label: "Company1",
        value: "AddBusinessIcon",
        icon: <AddBusinessIcon />,
    },
    {
        label: "Company2",
        value: "BusinessIcon",
        icon: <BusinessIcon />,
    },
    {
        label: "Company3",
        value: "ApartmentIcon",
        icon: <ApartmentIcon />,
    },
    {
        label: "Service1",
        value: "HomeRepairServiceIcon",
        icon: <HomeRepairServiceIcon />,
    },
    {
        label: "Service2",
        value: "MiscellaneousServicesIcon",
        icon: <MiscellaneousServicesIcon />,
    },
    {
        label: "Service3",
        value: "SupportAgentIcon",
        icon: <SupportAgentIcon />,
    }
];

const fieldType = [
    {
        label: "Textfield",
        value: "Textfield",
    },
    {
        label: "Dropdown",
        value: "Dropdown",
    },
];
//get userid
const userId = sessionStorage.getItem("user") || localStorage.getItem("user");

const ViewCustomTab = () => {
    const [userData, setUserData] = useState([]);

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedType, setSelectedType] = useState("Technician");

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(apiUrl + `getAllObjects`)
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
        const companyMatch = product.tablename
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
            await axios.delete(apiUrl + `deleteAppObjectById/${selectedProductId}`);
            const updatedRows = userData.filter(
                (item) => item.id !== selectedProductId
            );
            setUserData(updatedRows);
            notify("success", `Sucessfully deleted tab row.`);
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
                const response = await fetch(apiUrl + "createUpdateAppObject", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editedRecord.id,
                        tablename: editedRecord.tablename,
                        tablelabel: editedRecord.tablelabel,
                        isvisible: editedRecord.isvisible,
                        logo: editedRecord.logo,
                        description: editedRecord.description,
                        createddate: editedRecord.createddate,
                        tablekey: editedRecord.tablekey,
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
                            <Typography variant="subtitle2">Table Name</Typography>
                            <IconButton onClick={handleNameClick}>
                                <SearchIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <InputBase
                                value={searchText}
                                onChange={handleNameInputChange}
                                placeholder="Search table..."
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
            key: "tablename",
            dataIndex: "tablename",
            render: (name, record) => {
                const handleNavigation = () => {
                    navigate("/dashboard/application/tab/detail", { state: record });
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
            title: "Table Label",
            key: "tablelabel",
            dataIndex: "tablelabel",
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
                <DialogTitle>Edit Custom Tab</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                            <TextField
                                label="Table Name"
                                name="tablename"
                                fullWidth
                                value={editedRecord.tablename}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <TextField
                                label="Table Label"
                                name="tablelabel"
                                fullWidth
                                value={editedRecord.tablelabel}
                                onChange={handleChange}
                            />
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
                        <Grid xs={12} md={6}>
                            <TextField
                                label="Table Key"
                                name="tablekey"
                                fullWidth
                                value={editedRecord.tablekey}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <TextField
                                value={editedRecord.logo}
                                name="logo"
                                onChange={handleChange}
                                label="Choose icon"
                                fullWidth
                                select
                                SelectProps={{
                                    MenuProps: {
                                        style: {
                                            maxHeight: 250,
                                        },
                                    },
                                }}
                            >
                                {iconOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Icon
                                            style={{
                                                marginRight: 8,
                                                verticalAlign: "middle",
                                                lineHeight: "normal",
                                            }}
                                        >
                                            {option.icon}
                                        </Icon>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                    <h2 style={{ margin: 0 }}>View Custom Tabs</h2>
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
                        Are you sure you want to delete this tab?
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

export default ViewCustomTab;

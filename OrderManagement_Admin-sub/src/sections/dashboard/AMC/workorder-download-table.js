
import {
  Typography,
  IconButton,
  Icon,
  Link,
  MenuItem,
  TextField,
  InputBase
} from '@mui/material';
import { Table } from 'antd';
import './purchase-order.css'
import { Box, border } from '@mui/system';
import React from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import EditIcon from '@mui/icons-material/Edit';
import {  Delete } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import IconWithPopup from '../user/user-icon';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { apiUrl } from 'src/config';
import imgUrl from '../pdfAssets/imageDataUrl';
import pdfFonts from '../pdfAssets/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Inter: {
    normal: 'Inter-Regular.ttf',
    bold: 'Inter-Bold.ttf',
    light: 'Inter-Light.ttf',
    medium: 'Inter-Medium.ttf',
  }
}
const userId = sessionStorage.getItem('user');


const WorkOrderDownloadTable = () => {
  const [userData, setUserData]= useState([])
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);

  const navigate = useNavigate();
  
 
  useEffect(() => {
    axios.get(apiUrl +`getAllWorkOrders/${userId}`)
      .then(response => {
        setUserData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const updatedData = userData?.map((item) => {
    return {
      ...item,
      companyName: item.noncompany.companyName
    };
  });


  function formatDate(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const formattedArray = updatedData?.map((item) => {
    const formattedItem = { ...item }; 
  
    if (formattedItem.createdDate) {
      formattedItem.createdDate = formatDate(formattedItem.createdDate);
    }
  
    if (formattedItem.lastModifiedDate) {
      formattedItem.lastModifiedDate = formatDate(formattedItem.lastModifiedDate);
    }
  
    if (formattedItem.startdate) {
      formattedItem.originalstartdate =formattedItem.startdate
      formattedItem.startdate = formatDate(formattedItem.startdate);
    }
    if (formattedItem.enddate) {
      formattedItem.originalenddate =formattedItem.enddate
      formattedItem.enddate = formatDate(formattedItem.enddate);
    }
  
  
    return formattedItem;
  });

  const dataWithKeys = formattedArray?.map((item) => ({ ...item, key: item.id }));


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
 //delete row
  const handleRemoveRow = (id) => async () => {
    try {
      await axios.delete(apiUrl +`deleteWorkOrderById/${id}`);
      const updatedRows = userData.filter(item => item.id !== id);
      setUserData(updatedRows);
      notify(
        "success",
        `Sucessfully deleted row with work order number: ${id}.`
      );
    } catch (error) {
      console.error('Error deleting row:', error.message);
    }
  };

  const handleNavigation = record => {

    navigate('/dashboard/services/workorderedit', { state: record });
 
  };
  //company search
const handleCompanyClick = () => {
  setIsSearching(true);
};

const handleCompanyInputChange = event => {
  setSearchText(event.target.value);
};

const handleCompanyCancel = () => {
  setIsSearching(false);
  setSearchText('');
};

  
const filteredList = dataWithKeys.filter(product => {
  const companyMatch = product.companyName?.toLowerCase().includes(searchText.toLowerCase());
 
  return companyMatch
});
const numberToWords = require('number-to-words');
const convertAmountToWords = (amount) => {
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);

  const rupeesInWords = numberToWords.toWords(rupees); // Convert rupees to words
  const paisaInWords = numberToWords.toWords(paisa); // Convert paisa to words

  let result = '';

  if (rupees > 0) {
    result += `${rupeesInWords} rupees`;
  }

  if (paisa > 0) {
    if (rupees > 0) {
      result += ' and ';
    }
    result += `${paisaInWords} paisa`;
  }

  return result;
};
console.log(filteredList);

const handleWorkInvoice = async (record) => {
  console.log(record);
  try{
        const response = await axios.get(apiUrl +`getAllWorkOrderItems/${record.id}`)
          setInvoiceData(response.data);
          console.log(response.data)
          const rowData = response.data.map((item,index) => {
            let subTotal = item.unitPrice * item.workstationcount;
            let igst = item.igst;
            let igstAmount = (subTotal * igst) / 100;
            let total = subTotal + igstAmount;
            return [index+1, item.product.productName, item.unitPrice,`${item.workstationcount} WORK STATIONS`,subTotal,item.igst,total];
          })
          const totalAmount = response.data.map((item)=>{
            let subTotal = item.unitPrice * item.workstationcount;
            let igst = item.igst;
            let igstAmount = (subTotal * igst) / 100;
            let total = subTotal + igstAmount;
            return total;
          }) 
          const docDefinition = {
              pageOrientation: 'landscape',
              defaultStyle: {
                font: 'Inter'},
              content: [
                {
                  columns: [
                    {
                      image: imgUrl,
                      width: 100,
                      alignment: 'left',
                    },
                    {stack: [
                      {text: `${record.createdByUser.companyName}`, style: 'header'},
                      { text: `${record.createdByUser.address}, ${record.createdByUser.city}, ${record.createdByUser.pincode}, ${record.createdByUser.state}, ${record.createdByUser.country}`, style: 'subheader' },
                { text: `GSTIN: ${record.createdByUser.gstNumber}`, style: 'subheader'},
                { text: 'PAN: AAGFT5872R', style: 'subheader'},
                  ],
                  margin: [20, 0, 0, 0],
                },
                { text: "ANNUAL MAINTENANCE CONTRACT", style: 'header', alignment: 'right' },
                  ],margin: [0, 0, 0, 20],},
                {
                  columns:[
                      {stack: [
                        {text: 'Customer Name', style: 'workDetails'},
                        {text: 'Customer Address', style: 'workDetails'},
                      ],alignment: 'left'},
                      {stack: [
                        {text: `${record.noncompany.companyName}`, style: 'workDetails'},
                        {stack: [
                          {text: `${record.noncompany.address}, ${record.noncompany.city}`, style: 'workDetails'},
                          {text: `${record.noncompany.state}, ${record.noncompany.pincode}`, style: 'workDetails'},
                          {text: `${record.noncompany.country}`, style: 'workDetails'},
                        ]},
                      ]},
                    {
                        stack: [
                          {text: 'Engineer Name', style: 'workDetails'},
                          {text: 'Contact No.', style: 'workDetails'},
                          {text: 'Email', style: 'workDetails'},
                        ],alignment: 'right', margin: [40, 0, 0, 0],},
                        {stack: [
                          {text: `${record.technicianInfo.firstName} ${record.technicianInfo.lastName}`, style: 'workDetails'},
                          {text: `${record.technicianInfo.mobile}`, style: 'workDetails'},
                          {text: `${record.technicianInfo.emailId} `, style: 'workDetails'},
                        ], alignment: 'right'},
                  ],margin: [0, 0, 0, 20],},
                {
                  columns:[
                    {
                      table:{
                        body: [
                          [{text: 'Admin Incharge', style: 'workDetails',border: [false, false, false, false],},{text: `Mr. ${record.adminPersonName}`, style: 'workDetails',border: [false, false, false, false],}],
                          [{text: 'Equipment Incharge', style: 'workDetails',border: [false, false, false, false],},{text: `Mr. ${record.contactPersonName}`, style: 'workDetails',border: [false, false, false, false],}]
                        ],
                        
                      }
                    },
                    {
                      table:{
                        body: [
                          [{text: 'Email', style: 'workDetails',border: [false, false, false, false],},{text: `${record.adminEmail}`, style: 'workDetails',border: [false, false, false, false],}],
                          [{text: 'Email', style: 'workDetails',border: [false, false, false, false],},{text: `${record.contactEmail}`, style: 'workDetails',border: [false, false, false, false],}]
                        ],
                        
                      }
                    },
                    {
                      table:{
                        body: [
                          [{text: 'Contact No', style: 'workDetails',border: [false, false, false, false],},{text: `${record.adminPhoneNumber}`, style: 'workDetails',border: [false, false, false, false],}],
                          [{text: 'Contact No', style: 'workDetails',border: [false, false, false, false],},{text: `${record.contactPhoneNumber}`, style: 'workDetails',border: [false, false, false, false],}]
                        ],
                        
                      }
                    },
                  ], margin: [0, 0, 0, 20],
                },
                {
                  columns:[
                    {
                      table:{
                        body: [
                          [{text: 'STATUS', style: 'workDetails',border: [false, false, false, false],},{text: `${record.status}`, style: 'workDetails',border: [false, false, false, false],}],
                          [{text: 'Date of stating', style: 'workDetails',border: [false, false, false, false],},{text: `  ${record.startdate}`, style: 'workDetails',border: [false, false, false, false],}]
                        ],
                        
                      }
                    },
                    {
                      table:{
                        body: [
                          [{text: 'OLD', style: 'workDetails',border: [false, false, false, false],}]
                        ],
                      
                      }
                    },
                    {
                      table:{
                        body: [
                          [{text: 'Existing Date of Expiry', style: 'workDetails',border: [false, false, false, false],},{text: ``, style: 'workDetails',border: [false, false, false, false],}],
                          [{text: 'Date of Expiry', style: 'workDetails',border: [false, false, false, false],},{text: `${record.enddate}`, style: 'workDetails',border: [false, false, false, false],}]
                        ],
                        
                      }
                    },
                  ], margin: [0, 0, 0, 20],
                },
                {
                  table:{
                    widths: [ 30, "*", "*", "*", "*", 50, 100 ],
                    body: [
                      ['S.No.', 'MODEL', 'Unit Price', 'NO OF WORKSTATIONS','SUB T0TAL','IGST', 'TOTAL'],
                      ...rowData,
                    ],
                  }
                },
                {
                  stack: [
                    { text: `Total INR: ${totalAmount}`, style: 'workDetails', bold: true },
                    { text: `Total in words: ${convertAmountToWords(totalAmount)}`, style: 'workDetails', bold: true },
                  ],
                  margin: [350, 20, 0, 0], alignment: 'right'
                },
                {
                  columns:[
                    {
                      text: 'Signed By On Behalf Of\nCustomer With Seal And Date', alignment: 'center'
                    },
                    {
                      text: `Signed By On Behalf Of\n${record.createdByUser.companyName}`, alignment: 'center'
                    }
                  ], alignment: 'justify', margin: [0, 50, 0, 0]
                }

              ],
              styles: {
                  header: {
                    fontSize: 16,
                    font: 'Inter',
                    bold: true,
                    margin: [0, 0, 0, 5],
                  },
                  subheader: {
                    font: 'Inter',
                      fontSize: 12,
                      marginBottom: 5,
                      },
                  workDetails:{
                    font: 'Inter',
                    fontSize: 14,
                    alignment: 'left',
                    border: [false, false, false, false],
                  },
                  tableLabel: {
                    font: 'Inter',
                    bold: true,
                    border: [false, false, false, true],
                  },
                  tableCell: {
                    font: 'Inter',
                    fillColor: '#ffffff',
                  },
                  tableHeader: {
                    font: 'Inter',
                    fillColor: '#eeeeee',
                    bold: true,
                  },
                },
               
              };
        
            pdfMake.createPdf(docDefinition).download('work-order.pdf');
  }
  catch(error){
      console.log(error)
  }
}
  const columns = [
    {
      title: 'Work Order Number',
      dataIndex: 'id',
      key: 'id',
      render: (name, record) => {
        const handleNavigation = () => {
          navigate('/dashboard/services/workorderDetail', { state: record });
        };
        
        return (
          <Link
            color="primary"
            onClick={handleNavigation}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
            }}
            underline="hover"
          >
            <Typography variant="subtitle1">{name}</Typography>
          </Link>
        );
      },
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isSearching ? (
            <>
              <Typography variant="subtitle2">Company Name</Typography>
              <IconButton onClick={handleCompanyClick}>
                <SearchIcon />
              </IconButton>
            </>
          ) : (
            <>
              <InputBase
                value={searchText}
                onChange={handleCompanyInputChange}
                placeholder="Search company..."
              />
              <IconButton onClick={handleCompanyCancel}>
                <Icon>
                  <HighlightOffIcon />
                </Icon>
              </IconButton>
            </>
          )}
        </div>
    ),
      key: 'companyName',
      dataIndex: 'companyName',
    },
    {
      title: 'Order Modified Date',
      key: 'lastModifiedDate',
      dataIndex: 'lastModifiedDate',
    },
    {
      title: 'Order Date',
      key: 'createdDate',
      dataIndex: 'createdDate',
    },
    {
      title: 'Assignment Start Date',
      key: 'startdate',
      dataIndex: 'startdate',
    },
    {
      title: 'Assignment End Date',
      key: 'enddate',
      dataIndex: 'enddate',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type',
    },
    {
      dataIndex: 'actionEdit',
      key: 'actionEdit',
       render: (_, record) => (
        <IconButton onClick={() => handleNavigation(record)}>
          <Icon>
            <EditIcon />
          </Icon>
        </IconButton>
      ),
    },
    {
      dataIndex: 'actionDelete',
      key: 'actionDelete',
      render: (_, row) => (
        <IconButton onClick={handleRemoveRow(row.id)}>
          <Icon>
            <Delete />
          </Icon>
        </IconButton>
      ),
    },
    {
      title: 'AMC Download',
      dataIndex: 'actionDownload',
      key: 'actionDownload',
      render: (_, record) => (
        <IconButton onClick={() => handleWorkInvoice(record)}>
          <Icon>
            <DownloadIcon />
          </Icon>
        </IconButton>
      ),
    },
  ];


   

  return (
    <div style={{ minWidth: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Download AMC</h2>
        <IconWithPopup/>
      </div>
      
    
      <Box sx={{  position: 'relative' , overflowX: "auto", marginTop:'30px'}}>
 
           
        <Scrollbar>
          <Table
            sx={{ minWidth: 800, overflowX: 'auto'}}
            columns={columns}
            dataSource={filteredList}
            rowClassName={() => 'table-data-row'}
            ></Table>
            </Scrollbar>
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
                     theme="light"/>
          </Box>
        </div>
      );
    };
    
    export default  WorkOrderDownloadTable;
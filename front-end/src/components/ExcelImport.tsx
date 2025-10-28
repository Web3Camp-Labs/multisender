import React, { ChangeEvent, useRef } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { FileEarmarkSpreadsheet } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';

const UploadButton = styled(Button)`
  margin-bottom: 15px;
  
  svg {
    margin-right: 8px;
  }
`;

interface Props {
  getChildrenMsg: (data: any[]) => void;
}

const ExcelImport: React.FC<Props> = ({ getChildrenMsg }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        // Process data to ensure it has the correct format
        const processedData = processExcelData(data);
        
        // Pass data to parent component
        getChildrenMsg(processedData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please make sure it has the correct format.');
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  const processExcelData = (data: any[]): any[] => {
    return data.map(row => {
      // Extract address and amount from the row
      // This assumes the Excel has columns named 'address' and 'amount'
      // or the first column is address and second is amount
      const keys = Object.keys(row);
      
      let address = '';
      let amount = '';
      
      if (keys.includes('address') && keys.includes('amount')) {
        address = row.address;
        amount = row.amount;
      } else if (keys.includes('Address') && keys.includes('Amount')) {
        address = row.Address;
        amount = row.Amount;
      } else {
        // Fallback to first two columns
        address = row[keys[0]];
        amount = row[keys[1]];
      }
      
      return {
        address: address?.toString().trim(),
        amount: amount?.toString().trim()
      };
    }).filter(item => item.address && item.amount); // Filter out invalid entries
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <UploadButton 
        variant="outline-secondary" 
        className="upload" 
        onClick={handleClick}
      >
        <FileEarmarkSpreadsheet /> Import from Excel
      </UploadButton>
    </div>
  );
};

export default ExcelImport;

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
    const fileName = file.name.toLowerCase();
    const isCsv = fileName.endsWith('.csv');

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        let processedData: any[] = [];

        if (isCsv) {
          // Handle CSV files as plain text to preserve addresses
          const text = event.target?.result as string;
          processedData = parseCSV(text);
        } else {
          // Handle Excel files with XLSX library
          const binaryStr = event.target?.result;
          const workbook = XLSX.read(binaryStr, {
            type: 'binary',
            raw: false,
            cellText: false,
            cellDates: false
          });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          const data = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ''
          });

          processedData = processExcelData(data);
        }

        // Pass data to parent component
        getChildrenMsg(processedData);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please make sure it has the correct format.');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    if (isCsv) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const parseCSV = (text: string): any[] => {
    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');

    // Split by lines
    const lines = cleanText.split(/\r?\n/).filter(line => line.trim());

    if (lines.length === 0) {
      return [];
    }

    // Skip header line (first line)
    const dataLines = lines.slice(1);

    return dataLines.map(line => {
      // Split by comma, handling quoted values if necessary
      const values = line.split(',').map(v => v.trim());

      if (values.length < 2) {
        return null;
      }

      return {
        address: values[0],
        amount: values[1]
      };
    }).filter(item => item && item.address && item.amount);
  };

  const processExcelData = (data: any[]): any[] => {
    return data.map(row => {
      // Extract address and amount from the row
      // This assumes the Excel has columns named 'address' and 'amount'
      // or the first column is address and second is amount
      const keys = Object.keys(row);

      let address = '';
      let amount = '';

      // Helper function to find key case-insensitively and remove BOM
      const findKey = (targetKey: string): string | undefined => {
        return keys.find(key => {
          // Remove BOM and other invisible characters, then compare case-insensitively
          const cleanKey = key.replace(/^\uFEFF/, '').trim().toLowerCase();
          return cleanKey === targetKey.toLowerCase();
        });
      };

      const addressKey = findKey('address');
      const amountKey = findKey('amount');

      if (addressKey && amountKey) {
        address = row[addressKey];
        amount = row[amountKey];
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

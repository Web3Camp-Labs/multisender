import React, {ChangeEvent, Component} from 'react';
import { Button} from 'react-bootstrap';
import * as XLSX from 'xlsx';
import styled from "styled-components";
import {BoxArrowUp} from "react-bootstrap-icons";

const Box = styled.div`
  display: flex;
  align-items: center;

  .file {
    position: relative;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    width: 200px;
    height: 40px;
    svg{
      margin-right: 10px;
    }
   input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
      width: 200px;
      height: 40px;
    }
  }
`

const Tips = styled.div`
    margin-left: 20px;
  opacity: 0.6;
  a{
    color: #000;
    font-weight: bolder;
  }
`

interface Excelprops{
    getChildrenMsg: Function
}

export default function Excel(props:Excelprops){
    const onImportExcel = (file:ChangeEvent) => {
        const { files } = file.target as any;
        const fileReader = new FileReader();
        (fileReader as any).onload = (event:ChangeEvent) => {
            try {
                const { result } = event.target as any;
                const workbook = XLSX.read(result, { type: 'binary' });
                let data:any[] = [];
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{raw:false}));
                    }
                }
                console.log('Upload file successful!')
                props.getChildrenMsg(data);
            } catch (e) {
                console.error('Unsupported file type!');
            }
        };
        fileReader.readAsBinaryString(files[0]);
    }

    return (
        <Box>
            <Button variant="flat" className="file">
                <BoxArrowUp />
                <span>Import Addresses</span>
                <input type='file' accept='.xlsx, .xls, .csv' onChange={onImportExcel} />
            </Button>
            <Tips>
                Supported file formats: .xlsx, .xls, .csv, <a href="/multisender/Book1.csv" target="_blank">Example</a>
            </Tips>
        </Box >
    );

}

import React, {ChangeEvent, Component} from 'react';
import { Button} from 'react-bootstrap';
import * as XLSX from 'xlsx';
import styled from "styled-components";
import {BoxArrowUp} from "react-bootstrap-icons";

const Box = styled.div`
  .upload{
    .file-uploader{
    }
 
  }

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
            <div>
                <Button variant="flat" className="file">
                    <BoxArrowUp />
                    <span>Import Addresses</span>
                    <input type='file' accept='.xlsx, .xls, .csv' onChange={onImportExcel} />
                </Button>
            </div>

        </Box >
    );

}

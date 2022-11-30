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
`

interface Excelprops{
    getChildrenMsg: Function
}

export default function Excel(props:Excelprops){
    const onImportExcel = (evt:ChangeEvent) => {
        const { files } = evt.target as any;

        const file = files[0];

        const fileName = file?.name;
        const fileExt = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);

        const fileReader = new FileReader();
        fileReader.readAsBinaryString(files[0]);

        (fileReader as any).onload = (event:ChangeEvent) => {
            try {
                const { result } = event.target as any;
                const workbook = XLSX.read(result, { type: 'binary' });
                let data:any[] = [];

                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        if (/^xls/.test(fileExt)) {
                            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false }));
                        }

                        if (fileExt == "csv") {
                            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]);

                            const arrs = csvData.split("\n")
                            let jsonObj = []

                            for (const item of arrs) {
                                const vals = item.split(",");
                                const _address = vals[0];
                                const _amount = vals[1];
                                const _hash = { address: _address, amount: _amount };
                                jsonObj.push(_hash);
                            }

                            data = jsonObj;

                        }

                    }
                }
                console.log('Upload file successful!')
                props.getChildrenMsg(data);
            } catch (e) {
                console.error('Unsupported file type!');
            }
        };
    }

    const exampleFunc = () => {
        const exampleData = [
            { address: "<addresss>", amount: "<amount>"},
            { address: "0x0000000000000000000000000000000000000000", amount: "1"},
            { address: "0x0000000000000000000000000000000000000001", amount: "2"},
        ]

        props.getChildrenMsg(exampleData);
    }

    return (
        <Box>
            <Button variant="flat" className="file">
                <BoxArrowUp />
                <span>Import Addresses</span>
                <input type='file' accept='.xlsx, .xls, .csv' onChange={onImportExcel} />
            </Button>
            <Tips>
                Supported file formats: .xlsx, .xls, .csv,
            </Tips>

            <strong
                onClick={exampleFunc}
                >Example</strong>
        </Box >
    );

}

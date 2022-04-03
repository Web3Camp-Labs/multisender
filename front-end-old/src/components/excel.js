import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import * as XLSX from 'xlsx';

class Excel extends Component {
    onImportExcel = file => {
        const { files } = file.target;
        const fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                const { result } = event.target;
                const workbook = XLSX.read(result, { type: 'binary' });
                let data = [];
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                console.log('Upload file successful!')
                this.props.getChildrenMsg(data);
            } catch (e) {
                console.error('Unsupported file type!');
            }
        };
        fileReader.readAsBinaryString(files[0]);
    }
    render() {
        return (
            <div>
                <Button className="upload-wrap">
                    <input className="file-uploader" type='file' accept='.xlsx, .xls' onChange={this.onImportExcel} />
                    <span className="upload-text">Upload file</span>
                </Button>
            </div >
        );
    }
}

export default Excel;

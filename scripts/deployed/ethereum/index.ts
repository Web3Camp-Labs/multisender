import * as fs from 'fs';
import * as path from 'path';

const contractsPath = path.join(__dirname, 'contracts.json');
var contractJSON = JSON.parse(fs.readFileSync(contractsPath).toString());

export default {
    reload: function () {
        var data = fs.readFileSync(contractsPath, 'utf-8');
        return JSON.parse(data);
    },

    contracts: contractJSON,

    saveAddress: function (name: string, addr: string) {
        // not allowed invoke concurrently
        contractJSON[name] = addr;
        syncSave();
    }
}

function syncSave() {
    const data = JSON.stringify(contractJSON, null, 4);
    try {
        fs.writeFileSync(contractsPath, data);
    } catch (error) {
        console.error(error);
    }
}


import styled from "styled-components";
import {useState} from "react";

const Box = styled.div`
  h5{
    padding:10px 0 5px;
    color: #000000;
  }
  .transaction{
    padding: 20px 0 40px;
  }
`

export default function Step1(){
    const [txHash, setTxHash] = useState(["fafdas"]);
    const [txHashList, setTxHashList] = useState(["fafdas"]);
    const [txURL, setTxURL] = useState('');

    return <Box>

        <div>
            <h5>Approval history</h5>
            <ul className='transaction'>
                {
                    txHash && <li><a href={`${txURL}/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></li>
                }
            </ul>
            <h5>Transactions history</h5>
            <ul className='transaction'>
                {
                    txHashList && txHashList.map(i => (<li key={i}><a href={`${txURL}/${i}`} target="_blank" rel="noopener noreferrer">{i}</a></li>))
                }
            </ul>
        </div>


    </Box>
}

import styled from "styled-components";
import {useEffect, useState} from "react";
import {useWeb3} from "../api/connect";
import UrlJson from "../config/url.json";

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
    const { state } = useWeb3();
    const { txHash, txHashList, web3Provider } = state;
    // const [txHash, setTxHash] = useState([]);
    // const [txHashList, setTxHashList] = useState([""]);
    const [txURL, setTxURL] = useState('');

    useEffect(()=>{
       const  getId = async() =>{
           let url = "";
           const { chainId } = await web3Provider.getNetwork();
           const urlArr = UrlJson.filter(item=>item.id === chainId);
           url = urlArr[0]?.url;
           setTxURL(url)
       }
        getId()

    },[])

    return <Box>

        <div>
            {
                txHash!=null &&
                    <>
                    <h5>Approval history</h5>
                    <ul className='transaction'>
                        <li><a href={`${txURL}/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></li>

                    </ul>
                    </>
            }
            <h5>Transactions history</h5>
            <ul className='transaction'>
                {
                    txHashList && txHashList.map((i:any) => (<li key={i}><a href={`${txURL}/${i}`} target="_blank" rel="noopener noreferrer">{i}</a></li>))
                }
            </ul>
        </div>


    </Box>
}
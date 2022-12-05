import {Row, Col, Form, FloatingLabel, Button, Alert} from 'react-bootstrap';
import styled from "styled-components";
import {ChangeEvent, useState, useEffect} from "react";
import {useWeb3} from "../api/connect";
import Excel from "./excel";
import {ActionType} from "../api/types";
import {ethers} from "ethers";
import TokenAbi from "../abi/ERC20.json";
// import {type} from "os";
// import UrlJson from "../config/url.json";
// import mainnetConfig from "../config/mainnet.json";
// import bscConfig from "../config/bsc.json";
// import polygonConfig from "../config/polygon.json";
// import bsctestConfig from "../config/bsctest.json";
import ConfigJson from "../config/config.json";

const Box = styled.div`
    .height50{
      height: 200px;
    }
  .upload{
    svg{
      margin-right: 10px;
    }
  }
  label[for="Addresses"]{
    background: #fff;
    height: 33px;
    width: 99%;
    line-height: 4px;
    margin: 7.5px 0 0 1px;
    opacity: 1!important;
    color: #aaa;
  }
`

const TipsBox = styled.div`
  margin-bottom: 20px;
`


interface Props{
    handleNext: Function
}


export default function Step1(props:Props){

    const { dispatch,state } = useWeb3();
    const { account, web3Provider } = state;

    const [tokenAddress, settokenAddress] = useState<string>('0x000000000000000000000000000000000000bEEF'); // 0xbEEF as Ether
    const [decimals, setdecimals] = useState<number>(18);
    const [amounts, setamounts] = useState<string>('');
    const [btndisabled, setbtndisabled] = useState(true);
    const [errorTips, setErrorTips] = useState<string>('');
    const [support, setSupport] = useState<boolean | null>(null);

    useEffect(() => {
        if (!account || account === "" || !amounts || !tokenAddress) {
            setbtndisabled(true)

        } else {
            setbtndisabled(false)
        }
    }, [account, amounts, tokenAddress, decimals]);


    useEffect(()=>{
        if(web3Provider == null) return;

        const getDecimals = async() =>{
            if(tokenAddress === "0x000000000000000000000000000000000000bEEF") return;
            const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, web3Provider);
            try{
                const decimals = await tokenContract?.decimals();
                setdecimals(decimals);
                setErrorTips('')
            }catch (err:any){
                setErrorTips(err.data?.message || err.message)
            }
        }
        getDecimals()

    },[tokenAddress,web3Provider])

    useEffect(()=>{
        initMultiSenderAddress()
    },[])

    const initMultiSenderAddress = async () => {
        const { chainId } = await web3Provider.getNetwork();
        const chainArr = ConfigJson.filter(item=>item.chainId === chainId);
        if(chainArr.length){
            setSupport(true)
        }else{
            setErrorTips('Unsupported network!!!!')
            setSupport(false)
        }

    };

    const handleInput = (e:ChangeEvent) => {
        const { name, value } = e.target as HTMLInputElement;

        switch (name) {
            case 'token':
                settokenAddress(value)
                break;
            case 'amounts':
                setamounts(value)
                break;
            default: break;
        }
    }
    const nextPage = async () => {

        let arr = amounts.split('\n');
        let data:any[]= [];
        let amountStr = '';
        arr.map((item)=>{
            let address = item.split(",")[0];
            let amount = item.split(",")[1];
            data.push({
                address,
                amount
            })
            let isAddress = ethers.utils.isAddress(address);
            console.log(isNaN(parseFloat(amount)))
            if(isAddress && !isNaN(parseFloat(amount))){
                amountStr += `${address},${parseFloat(amount)} \n`;
            }
        })
        dispatch({type: ActionType.STORE_IMPORT,payload:data});
        props.handleNext(2);
        const obj = {
             amounts:amountStr, tokenAddress, decimals
        }
        dispatch({type: ActionType.STORE_FIRST,payload:obj});
    }

    const getChildrenMsg = (data:any[]) => {
        let str = '';
        for (let ele of data) {
            let eleStr =[];
            for(let key in ele){
               eleStr.push(ele[key]);
            }
            str += eleStr.join(",");
            str += "\n";
          }

        setamounts(str)

    }

    return <Box>
            <Row>
                <Col md={9}>
                    <FloatingLabel
                        controlId="Token"
                        label="Token"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            name='token'
                            placeholder="Token"
                            value={tokenAddress}
                            onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>
                </Col>
                <Col md={3}>

                    <FloatingLabel
                        controlId="Decimals"
                        label="Decimals"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            name='decimals'
                            placeholder="Decimals"
                            value={decimals}
                            readOnly={true}
                            // onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <div className="mb-3">
                <Excel getChildrenMsg={getChildrenMsg} />
            </div>
            <Row>
                <Col md={12}>
                    <FloatingLabel
                        controlId="Addresses"
                        label="Addresses with Amounts"
                        className="mb-3 addressLabel"
                    >
                        <Form.Control
                            placeholder="Addresses with Amounts"
                            as="textarea"
                            name='amounts'
                            className="height50"
                            value={amounts}
                             onChange={(e)=>handleInput(e)}
                        />
                    </FloatingLabel>

                </Col>
            </Row>
        <TipsBox>
            {
                !!errorTips.length &&<Alert  variant='danger'>{errorTips}</Alert>
            }

        </TipsBox>
            <div>
                <Button
                    variant="flat"
                    onClick={()=>nextPage()}
                    disabled={!support || btndisabled}
                >Next</Button>
            </div>

    </Box>
}
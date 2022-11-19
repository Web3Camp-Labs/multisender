import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import {ActionType} from "../api/types";
import ChainJson from "../api/chain.json";
import {X} from "react-bootstrap-icons"
import Accounts from '../api/Account';
import {useWeb3} from "../api/connect";
import styled from "styled-components";

const ContainerBox = styled(Container)`
  .logo{
    margin-right: 20px;
  }
`

const Box = styled.div`
  display: flex;
  justify-content: flex-end;

`

const AddressBox = styled.span`
    border: 1px solid #000;
    font-size: 16px;
    height: 40px;
  padding: 0 20px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  .close{
    margin-left: 20px;
    cursor: pointer;
  }
`

const ChainBox = styled.div`
  border: 1px solid #000;
  font-size: 16px;
  padding: 0 20px;
  height: 40px;
  display: inline-block;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  margin-right: 20px;
`

export default function HeaderTop() {
    const {dispatch,state} = useWeb3();
    const { web3Provider,account } = state;

    // const [accountAddress, setaccountAddress] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const [chainName ,setChainName] = useState('');
    const [avaliable ,setAvaliable] = useState(true);


    useEffect(()=>{
        const getChain =  async() =>{
            const { chainId } = await web3Provider.getNetwork();
            const ChainArr = ChainJson.filter(item=>item.chainId === chainId);
            setChainName(ChainArr[0]?.name);
        }
        getChain();
    },[ web3Provider])

    useEffect(()=>{
        initMultiSenderAddress()
    },[])

    const initMultiSenderAddress = async () => {

        const { chainId } = await web3Provider.getNetwork();
        console.log('chainId', chainId);


        if (!(chainId === 1 || chainId === 137 || chainId === 56 || chainId === 97)) {
            setAvaliable(false);
        }
    };

    const connectWallet = async () => {
        if(!avaliable)return;
        await Accounts.accountList().then(data => {
            if (data.type === 'success') {
                // setaccountAddress(data?.data);
                sessionStorage.setItem("account", data?.data);
                dispatch({type: ActionType.SET_ACCOUNT,payload:data?.data});
            } else {
                setShow(true)
            }
        });
    }
    const AddressToShow = (address: string) => {
        if (!address) return "...";

        let frontStr = address.substring(0, 4);

        let afterStr = address.substring(address.length - 4, address.length);

        return `${frontStr}...${afterStr}`;
    };


    useEffect(() => {
        const { ethereum} = window as any;
        ethereum.on('chainChanged', () => {
            window.location.reload();

        });

        ethereum.on('accountsChanged', () => {
            sessionStorage.removeItem('account');
            window.location.reload();

        });

        const logInfo = sessionStorage.getItem('account');
        if(account == null){
            dispatch({type: ActionType.SET_ACCOUNT,payload:logInfo});
        }
    }, []);

    const logout = () =>{
        dispatch({type: ActionType.SET_ACCOUNT,payload:null});
        sessionStorage.removeItem('account');
        window.location.reload();
    }


    return <div className="header">
        <ContainerBox>
            <Row>
                <Col className="headerTxt" md={4} xs={12}>
                    <img src="/multisender/multisender.png" alt="" className="logo"/>
                    {/*Multisender*/}
                </Col>
                <Col className="headetRht" md={8} xs={12}> <Box>
                    {
                        !!chainName.length &&<ChainBox>
                            {chainName}
                        </ChainBox>
                    }

                    {
                        !account && <Button variant="flat" onClick={connectWallet} disabled={!avaliable}>connect Wallet</Button>
                    }

                    {
                        account && <AddressBox>{AddressToShow(account)}
                            <div className="close" onClick={()=>logout()}>
                                <X />
                            </div></AddressBox>
                    }
                </Box></Col>
            </Row>
        </ContainerBox>
    </div>
}

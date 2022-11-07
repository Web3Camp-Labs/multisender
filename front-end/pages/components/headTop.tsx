import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import {ActionType} from "../api/types";
import ChainJson from "../api/chain.json";
import {X} from "react-bootstrap-icons"
import Accounts from '../api/Account';
import {useWeb3} from "../api/connect";
import styled from "styled-components";

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
    const { web3Provider } = state;

    const [account, setaccount] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const [chainName ,setChainName] = useState('');


    useEffect(()=>{
        const getChain =  async() =>{
            const { chainId } = await web3Provider.getNetwork();
            const ChainArr = ChainJson.filter(item=>item.chainId === chainId);
            setChainName(ChainArr[0]?.name);
        }
        getChain();
    },[ web3Provider])

    const connectWallet = async () => {
        await Accounts.accountList().then(data => {
            if (data.type === 'success') {
                setaccount(data.data)
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
            window.location.reload();
        });
    }, []);

    const logout = () =>{
        dispatch({type: ActionType.SET_ACCOUNT,payload:null});
        window.location.reload();
    }


    return <div className="header">
        <Container>
            <Row>
                <Col className="headerTxt" md={4} xs={12}>Batch Sender</Col>
                <Col className="headetRht" md={8} xs={12}> <Box>
                    {
                        !!chainName.length &&<ChainBox>
                            {chainName}
                        </ChainBox>
                    }

                    {
                        !account && <Button variant="flat" onClick={connectWallet}>connect Wallet</Button>
                    }

                    {
                        account && <AddressBox>{AddressToShow(account)}
                            <div className="close" onClick={()=>logout()}>
                                <X />
                            </div></AddressBox>
                    }
                </Box></Col>
            </Row>
        </Container>
    </div>
}

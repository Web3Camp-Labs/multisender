import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button,Dropdown } from 'react-bootstrap';
import {ActionType} from "../api/types";
import ChainJson from "../api/chain.json";
import {X} from "react-bootstrap-icons"
import Accounts from '../api/Account';
import {useWeb3} from "../api/connect";
import styled from "styled-components";
import ConfigJson from "../config/config.json";

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

const ChainBox = styled(Dropdown)`
  margin-right: 20px;
  button{
    height: 42px;
    &:after{
     margin-left: 10px;
    }
  }
`

const BoxRht = styled.div`
  position: relative;
`
interface obj{
    name:string;
    chain:string;
    icon:string;
    rpc: string[];
    faucets: any[];
    nativeCurrency:any;
    infoURL:string;
    shortName:string;
    chainId:number;
    networkId:number;
    slip44:number;
    ens:{
        registry:string
    }
    explorers:any[];
}

export default function HeaderTop() {
    const {dispatch,state} = useWeb3();
    const { web3Provider,account } = state;

    // const [accountAddress, setaccountAddress] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const [chainName ,setChainName] = useState('');
    const [avaliable ,setAvaliable] = useState(true);
    const [chainList ,setChainList] = useState<obj[]>([]);

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
        FormatChain()

    },[])

    const FormatChain = () =>{
        let arr:obj[]=[];
        ConfigJson.map((item)=>{
           let objArr:any = ChainJson.filter((obj)=>obj.chainId === item.chainId);
           if(objArr?.length){
               arr = arr.concat(objArr);
           }
        });
        setChainList(arr)
    }

    const initMultiSenderAddress = async () => {

        const { chainId } = await web3Provider.getNetwork();
        const chainArr = ConfigJson.filter(item=>item.chainId === chainId);
        if(!chainArr.length){
            setAvaliable(false);
        }else{
            setAvaliable(true);
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

    const chainChange = async(item:obj) =>{
        const { ethereum } = window as any;
        const {name, chainId,chain,nativeCurrency:{symbol,decimals},rpc,explorers} = item;
        console.log(name, chainId,chain,symbol,decimals,rpc,explorers[0].url);
        let blkArr:string[] = [];
        explorers.map( ex => {
            blkArr.push(ex.url);
        })
        if(chainId === 1){
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            })
        }else{
            ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId:`0x${chainId.toString(16)}`,
                    chainName:chain,
                    nativeCurrency: {
                        name,
                        symbol,
                        decimals
                    },
                    rpcUrls:rpc,
                    blockExplorerUrls:blkArr
                }]
            })
                .catch((error:any) => {
                    console.log(error)
                })
        }

    }


    return <div className="header">
        <ContainerBox>
            <Row>
                <Col className="headerTxt" md={4} xs={12}>
                    <img src="/multisender/multisender.png" alt="" className="logo"/>
                    {/*Multisender*/}
                </Col>
                <Col className="headetRht" md={8} xs={12}>
                    <BoxRht>
                        <Box>
                            {
                                !!chainName.length && <ChainBox>
                                    <Dropdown.Toggle variant="flat" id="dropdown-basic">
                                        {chainName}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            chainList.map((item,index)=>(<Dropdown.Item key={index} onClick={()=>chainChange(item)}>
                                                <span>{item.name}</span>
                                          </Dropdown.Item>))
                                        }

                                    </Dropdown.Menu>
                                </ChainBox>
                            }

                            {
                                !account && <Button variant="flat" onClick={connectWallet} disabled={!avaliable}>Connect Wallet</Button>
                            }

                            {
                                account && <AddressBox>{AddressToShow(account)}
                                    <div className="close" onClick={()=>logout()}>
                                        <X />
                                    </div></AddressBox>
                            }

                        </Box>
                    </BoxRht>
                </Col>
            </Row>
        </ContainerBox>
    </div>
}

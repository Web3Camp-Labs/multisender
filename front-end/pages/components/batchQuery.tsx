// import {Button, Table, Spinner,Form,FloatingLabel,Alert} from 'react-bootstrap';
// import {useEffect, useState,ChangeEvent} from "react";
// // import { useCSVReader } from 'react-papaparse';
// import styled from "styled-components";
// import { ethers } from 'ethers';
// // import CsvDownloader from 'react-csv-downloader';
// import Erc20ABI from "../abi/erc20.abi.json";
// // import { Contract, Provider } from 'ethers-multicall';

// const ButtonBox = styled("div")`
//     display: flex;
//     align-items: center;
//     flex-wrap: wrap;
//     .example{
//       margin: 0 20px;
//     }
//     .rht{
//       margin-right: 20px;
     
//       button{
//         white-space: nowrap!important;
//       }
//     }
//   .querybtn,.query{
//     margin-right: 20px;
//   }
//   @media(max-width: 1000px){
//     .query,.example,.switchBox{
//       margin-top: 20px;
//     }
//     .example{
//       margin-left: 0;
//     }
//   }
// `
// const TableBox = styled.div`
//     margin-top: 40px;
//   .tableStyle{
//     border-top: 1px solid #eee;
//     color: #666666;
//     th{
//       height: 60px;
//       line-height: 60px;
//     }
//     .first{
//       display: flex;
//       justify-content: center;
//       align-items: stretch;
//       .form-check-inline{
//         margin-right: 0;
//         display: flex;
//         margin-top: 13px;
//       }
//     }
//     td{
//       line-height: 50px;
//       word-break: break-all;
//       &:nth-child(4){
//        width: 30%;
//       }
//     }
//     tr:nth-child(2n+1) td{
//       background:rgba(255,255,255,0.3)!important;
//       color: #666666!important;
//     }
//     tr:hover td{
//       background:rgba(0,0,0,0.01)!important;
//     }
//   }
// `

// const FloatBox = styled(FloatingLabel)`
//   width: 100%;
//   margin-top: 20px;
// `

// const AlertBox = styled(Alert)`
//   margin-top: 20px;
// `

// interface listObj {
//     address:string
//     index:number
//     amount?:string
//     checked?:boolean
// }

// export default function BatchQuery(){

//     const { CSVReader } = useCSVReader();
//     const [list,setList] = useState<listObj[]>([]);
//     const [web3,setWeb3] = useState<any>();
//     const [loading,setLoading] = useState<boolean[]>([])
//     const [checkArr,setCheckArr] = useState<listObj[]>([])
//     const [downloadArr,setDownloadArr] = useState<listObj[]>([])
//     const [show,setShow] = useState<boolean>(false);
//     const [showType,setShowType] = useState<boolean>(false);
//     const [showErr,setShowErr] = useState<boolean>(false);
//     const [TokenAddress,setTokenAddress] = useState<string>('');
//     const [Tips,setTips] = useState<string>('');

//     useEffect(()=>{
//         if((window as any)?.ethereum){
//             const provider = new ethers.providers.Web3Provider((window as any).ethereum)
//             setWeb3(provider)
//         }
//     },[])

//     useEffect(()=>{
//         const mapArr = list.filter(item=>item.checked === true);
//         setCheckArr(mapArr)
//     },[show,list])

//     useEffect(()=>{
//         if(!checkArr.length)return;
//        const arr = JSON.parse(JSON.stringify(checkArr));
//         arr.map((item:listObj)=>{
//             delete item.checked
//         })
//         setDownloadArr(arr)
//     },[checkArr])


//     const query_balance = () => {
//         if(!(window as any)?.ethereum){
//             setTips('Please install metamask');
//             setShowErr(true)
//         }
//         if(!list.length){
//             setTips('Please Import CSV ');
//             setShowErr(true)
//             setTimeout(()=>{
//                 setShowErr(false)
//             },2000)
//         }
//         if(showType && TokenAddress ===""){
//             setShowErr(true)
//             setTips('ERC20 address is required');
//             setTimeout(()=>{
//                 setShowErr(false)
//             },2000)
//             return;
//         }
//         if(showType && !ethers.utils.isAddress(TokenAddress)){
//             setShowErr(true)
//             setTips('ERC20 address is not correct');
//             setTimeout(()=>{
//                 setShowErr(false)
//             },2000)
//             return;
//         }
//         let arr:listObj[];
//         let loadingArr: boolean[];
//         if(checkArr.length){
//             arr = [...checkArr];
//             loadingArr = [...Array(list.length)].fill(true);
//             list.map((item,index)=>{
//                 loadingArr[index] = item.checked as boolean;
//             })
//         }else{
//             arr = [...list];
//             loadingArr = [...Array(list.length)].fill(true);
//         }
//         setLoading(loadingArr)
//         if(showType){
//             queryERC20(arr).then((data)=>{
//                 console.log("=======",data)
//             })
//         }else{
//             queryNative(arr).then((data)=>{
//                 console.log("=======",data)
//             });
//         }

//     };
//     const queryERC20 = async (arr:listObj[]) =>{
//         const contract = new Contract(TokenAddress, Erc20ABI);
//         const FormatAddress:any[] = [];
//         arr.map((item,index)=>{
//             FormatAddress.push(
//                 contract.balanceOf(item.address)
//             )
//         })
//         const ethcallProvider = new Provider(web3);
//         await ethcallProvider.init();
//         const amountList = await ethcallProvider.all(FormatAddress)
//             arr.map((item,index)=>{
//                 let amount = amountList[index].toString();
//                 item.amount = ethers.utils.formatEther(amount);
//             });
//         const loadingArr = [...Array(list.length)].fill(false);
//         setLoading(loadingArr)
//         setList(arr)
//     }

//     const queryNative = async (arr:listObj[]) =>{
//         for await (let item of arr){
//             const objArr = [...checkArr];
//             let amount = await web3?.getBalance(item.address)
//             const objItem = arr.filter(obj=>obj.address ===item.address);
//             objItem[0].amount = ethers.utils.formatEther(amount.toString());
//             setList(objArr)
//         }
//     }

//     const handleType = () =>{
//         setShowType(!showType)
//         setCheckArr([])
//         setDownloadArr([])
//         setLoading([])
//         setList([])
//         setShowErr(false);
//     }

//     const UniqueArr = (objArr:listObj) =>{
//         let obj:any ={};
//         return (objArr as any).reduce((cur:listObj,next:listObj) => {
//             obj[next.address] ? "" : obj[next.address] = true && (cur as any).push(next);
//             return cur;
//         },[])
//     }
//     const handleChange = (e:ChangeEvent) =>{
//         const eventObj = e.target as HTMLInputElement;
//         const index = Number(eventObj.value);
//         list[index].checked = true;
//         setShow(!show)
//     }

//     const handleInput= (e:ChangeEvent) => {
//         const eventObj = e.target as HTMLInputElement;
//         setTokenAddress(eventObj.value)
//     }

//     return <div>
//         <ButtonBox>
//             <CSVReader
//                 onUploadAccepted={(results: any) => {
//                     // results.data.shift()

//                     const arr = results.data.map((item:any)=>{
//                         if(!ethers.utils.isAddress(item[0])) return null;
//                         return {
//                             address:item[0],
//                             amount:null,
//                             checked:false
//                         }
//                     })

//                     const ArrAft = arr.filter((item:any) => item != null);
//                     const ArrUni = UniqueArr(ArrAft);
//                     const e = [...Array(ArrUni.length)].fill(false)
//                     setLoading(e)
//                     setList(ArrUni);
//                 }}

//             >
//                 {({
//                       getRootProps,
//                   }: any) => (
//                     <>
//                         <div
//                             {...getRootProps()}
//                             className="rht"
//                         >
//                             <Button variant="flat" >
//                                Import CSV
//                             </Button>

//                         </div>
//                     </>
//                 )}
//             </CSVReader>
//             <Button variant="dark" onClick={()=>query_balance()} className="querybtn"> Query</Button>
//             {/* <div className="query">
//                 {
//                     !!downloadArr.length &&<CsvDownloader
//                         datas={downloadArr as any}
//                         filename={`myWallets_${showType?'ERC20':'native'}_${downloadArr[0]?.address}`}
//                         extension=".csv"> <Button variant="dark">  Download</Button>
//                     </CsvDownloader>
//                 }

//             </div> */}


//             <a className="example" href="/batch-query/example.csv">example(import)</a>
//             <div className="switchBox">
//                 <Form.Check
//                     type="switch"
//                     id="custom-switch"
//                     label="Native / ERC20"
//                     checked={showType}
//                     onChange={()=>handleType()}
//                 />
//             </div>

//         </ButtonBox>

//         {
//             showType &&<div>
//                 <FloatBox
//                     controlId="floatingInput"
//                     label="Token Address"
//                     className="mb-3"
//                 >
//                     <Form.Control type="text" placeholder="Token Address" onChange={handleInput}/>
//                 </FloatBox>
//             </div>
//         }
//         {
//             showErr &&<AlertBox  variant='danger'>
//                 {Tips}
//             </AlertBox>
//         }



//         <TableBox>
//             <Table striped borderless hover className="tableStyle">
//                 <thead>
//                     <tr>
//                         <th>#</th>
//                         <th>index</th>
//                         <th>Address</th>
//                         <th>Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                 {
//                     list.map((item,index)=>
//                         <tr key={index}>
//                             <td>
//                                 <div className="first">
//                                     <Form.Check
//                                         inline
//                                         type="checkbox"
//                                         id={`default-checkbox_${index}`}
//                                         value={index}
//                                         name="selectValue"
//                                         onChange={handleChange}
//                                     />
//                                 </div>

//                             </td>
//                             <td>{index+1}</td>
//                             <td>{item.address}</td>
//                             <td>
//                                 {
//                                     item.amount ==null && loading[index] && <Spinner animation="border" variant="dark" />
//                                 }
//                                 {item.amount}
//                             </td>
//                         </tr>
//                     )
//                 }
//                 </tbody>
//             </Table>
//         </TableBox>
//     </div>
// }
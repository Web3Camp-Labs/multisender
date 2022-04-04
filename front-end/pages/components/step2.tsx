import {Form,Table,Button} from 'react-bootstrap';
import styled from "styled-components";
import {useState} from "react";

const Box = styled.div`
  padding: 40px 0;
  .numbers{
    font-size: 20px;
  }
  .tips{
    font-size: 12px;
    color: #999;
  }
  h5{
    padding:10px 0 5px 10px;
    color: #000000;
  }
  .ml2{
    margin-left: 10px;
  }
`
const TableBox = styled.div`
    margin-top: 10px;
  .tableStyle{
    border-top: 1px solid #eee;
    color: #666666;
    th{
      height: 60px;
      line-height: 60px;
    }
    .first{
      display: flex;
      justify-content: center;
      align-items: stretch;
      .form-check-inline{
        margin-right: 0;
        display: flex;
        margin-top: 13px;
      }
    }
    td{
      line-height: 50px;
      word-break: break-all;
      &:nth-child(4){
       width: 30%;
      }
    }
    tr:nth-child(2n+1) td{
      background:rgba(255,255,255,0.3)!important;
      color: #666666!important;
    }
    tr:hover td{
      background:rgba(0,0,0,0.01)!important;
    }
  }
`

const H5Box = styled.h5`
  display: inline-block;
  margin-bottom: 20px;
`

export default function Step2(){
    const [tablelist,setTablelist] = useState([
        {
            address:'0x33d3fF69E5967b3E6Cdc95206F1AbdF0709406F7',
            amount:10
        },{
            address:'0x33d3fF69E5967b3E6Cdc95206F1AbdF0709406F7',
            amount:10
        }
    ])
    const [totalAmount, settotalAmount] = useState(0);
    const [allowance, setallowance] = useState(0);
    const [addressArray, setaddressArray] = useState([]);
    const [pageSize] = useState(200); // Default 200 transfer per tx
    const [mybalance, setmybalance] = useState(0);
    const [ethBalance, setethBalance] = useState('0');
    const [symbol, setsymbol] = useState('');

    return <Box>
            <div className="mb-3">
                <h5>List of recipients</h5>
                <TableBox>
                    <Table  striped borderless hover className="tableStyle">
                        <thead>
                        <tr>
                            <th>Address</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            tablelist.map((i, index) => (<tr key={`${i.address}_${index}`}>
                                <td>{i.address}</td>
                                <td>{i.amount}</td>
                            </tr>))
                        }
                        </tbody>
                    </Table>
                </TableBox>
            </div>
            <div className="mb-3">
                <h5>Summary</h5>
                <Table bordered >
                    <tbody>
                    <tr>
                        <td width="50%">
                            <div className='numbers'>{totalAmount} {symbol}</div>
                            <div className="tips">Request approve amount</div>
                        </td>
                        <td>
                            <div className='numbers'>{allowance} {symbol}</div>
                            <div className="tips">Your current allowance</div>
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <div className='numbers'>{addressArray.length}</div>
                            <div className="tips">Total number of addresses</div>
                        </td>
                        <td>
                            <div className='numbers'>{totalAmount} {symbol}</div>
                            <div className="tips">Total number of tokens to be sent</div>
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <div className='numbers'>{Math.ceil(addressArray.length / pageSize)}</div>
                            <div className="tips">Total number of transaction needed</div>
                        </td>
                        <td>
                            <div className='numbers'>{mybalance} {symbol}</div>
                            <div className="tips">Your token balance</div>
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <div className='numbers' />
                            <div className="tips">Approximate cost of operation</div>
                        </td>
                        <td>
                            <div className='numbers'>{ethBalance} ETH</div>
                            <div className="tips">Your ETH balance</div>
                        </td>
                    </tr>

                    </tbody>
                </Table>
            </div>

            <div className="mb-4">
                <H5Box>Amount to Approve</H5Box>
                <Form.Group className="ml2">
                    <div className="mb-2">
                        <Form.Check
                            type="radio"
                            inline
                            label="Extra amount to sent"
                            name='approveAmount'
                            // onChange={handleRadio}
                            // value='extra'
                        />
                    </div>
                    <div>
                        <Form.Check
                            inline
                            type="radio"
                            label="Unlimited amount"
                            name='approveAmount'
                            // value='unlimited'
                            // onChange={handleRadio}
                        />
                    </div>
                </Form.Group>
            </div>

            <div className="ml2">
                <Button
                    variant="flat"
                    // onClick={doBatchSend}
                >Submit</Button>
            </div>




    </Box>
}
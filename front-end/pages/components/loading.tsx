import styled from "styled-components";
import Spinner from 'react-bootstrap/Spinner';
import {useWeb3} from "../api/connect";

const Box = styled.div`
    background: rgba(0,0,0,0.2);
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`

const LoadingInner = styled.div`
    width: 400px;
    background: #fff;
  box-shadow: 0 0 5px #ccc;
  border-radius: 6px;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .image{
    margin-bottom: 20px;
  }
`


export default function Loading(){
    const { state } = useWeb3();
    const { tips } = state;

    return <Box>
        <LoadingInner>
            <div className="image">
                <Spinner  animation="border" variant="flat" />
            </div>
            <div>{tips}</div>
        </LoadingInner>
    </Box>
}
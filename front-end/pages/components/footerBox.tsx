import styled from "styled-components";
import {Container} from 'react-bootstrap';
const Footer = styled.div`
  height: 80px;
  margin-top: 100px;
  .midBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  img{
    width: 40px;
    height: 40px;
  }
  .lft{
    padding-left: 10px;
  }
`
export default function footerBox(){
    return  <Footer>
        <Container>
            <div className="midBox">
                <div className="lft">&copy; 2022 Web3camp.us</div>
                <div>
                    <a href="https://github.com/Web3-Camp/multisender" target="_blank" rel="noreferrer">
                        <img src="https://web3camp.us/assets/images/GitHub-Mark.png" alt=""/>
                    </a>
                </div>
            </div>
        </Container>
</Footer>
}

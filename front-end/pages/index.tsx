import type { NextPage } from 'next'
import {Container, Row, Col, Card} from 'react-bootstrap';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import {Display,FileEarmarkCode,Check2Square} from "react-bootstrap-icons"
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import {useState} from "react";
import Loading from "./components/loading";
import {useWeb3} from "./api/connect";

const MainBox = styled.div`
    display: flex;
  flex-grow: 1;
`
const MainContent = styled.main`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`

const BgBox = styled(Container)`
  margin-top: 30px;
`

const CardBox = styled(Card)`
  border:0;
  box-shadow: 0 0 5px #ccc;
  border-radius: 6px;
`

const NavBox = styled.div`
    height: 120px;
    margin: 40px ;
    .bg{
      border-bottom: 1px solid #eee;
      height: 40px;
    }
    .box{
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 80px;
    }
  li{
    background: #FAFBFC;
    padding: 0 20px;
    .circle{
      width: 80px;
      height: 80px;
      border-radius: 80px;
      box-shadow: 0 0 5px #eee;
      background: #f8f8f8;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #cccccc;
      font-size: 16px;
 
    }
    .title{
      padding: 20px 0 40px;
      font-size: 14px;
      opacity: 0.8;
      span{
        opacity: 0.6;
      }
    }
    &.active{
      .circle{
       background: #fff;
        box-shadow: 0 0 10px rgba(128,0,128,0.3);
        color: purple;
      }
      .title{
        padding: 20px 0 40px;
        font-size: 14px;
        opacity: 1;
        color: purple;
      }
    }
  }
`

const Home: NextPage = () => {
    const [ current, setCurrent ] = useState<number>(1);
    const { state } = useWeb3();
    const { tips } = state;

    const handleCurrent = (index:number) =>{
        setCurrent(index)
    }
  return (
    <>
      <MainContent >
          <HeaderTop />
          {
              tips != null &&   <Loading />
          }
          <MainBox>
              <BgBox>
                  <Row>
                      <Col md={12} xs={12}>
                          <NavBox>
                              <div className="bg">
                                  <ul className="box">
                                      <li className={current === 1 ?"active":''} onClick={()=>handleCurrent(1)}>
                                          <div className="circle">
                                              <FileEarmarkCode />
                                          </div>
                                          <div className="title"><span>Step1. </span>Prepare</div>
                                      </li>
                                      <li  className={current === 2 ?"active":''}>
                                          <div className="circle">
                                              <Check2Square />
                                          </div>
                                          <div className="title"><span>Step2.</span> Confirm</div>
                                      </li>
                                      <li className={current === 3 ?"active":''}>
                                          <div className="circle"> <Display /></div>
                                          <div className="title"><span>Step3.</span> Result</div>
                                      </li>
                                  </ul>
                              </div>
                          </NavBox>
                          <CardBox body>
                              {
                                  current === 1 && <Step1 handleNext={handleCurrent}/>
                              }
                              {
                                  current === 2 && <Step2 handleNext={handleCurrent} />
                              }
                              {
                                  current === 3 && <Step3 />
                              }
                          </CardBox>
                      </Col>
                  </Row>
              </BgBox>
          </MainBox>
          <FooterBox />
      </MainContent>
    </>
  )
}

export default Home

import type { NextPage } from 'next'
import Head from 'next/head'
import {Container, Row, Col, Card} from 'react-bootstrap';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
import FooterBox from "./components/footerBox";
import {Display,FileEarmarkCode,Check2Square} from "react-bootstrap-icons"
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import {useState} from "react";

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
    height: 90px;
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
    background: #fff;
    padding: 0 40px;
    &>div{
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
    &.active{
      &>div{
       background: #fff;
        box-shadow: 0 0 10px rgba(128,0,128,0.3);
        color: purple;
      }
    }
  }
`


const Home: NextPage = () => {
    const [ current, setCurrent ] = useState(3)
  return (
    <>
      <Head>
        <title>Batch Query</title>
        <meta name="description" content="Batch Query" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContent >
          <HeaderTop />
          <MainBox>
              <BgBox>
                  <Row>
                      <Col md={12} xs={12}>
                          <NavBox>
                              <div className="bg">
                                  <ul className="box">
                                      <li className={current === 1 ?"active":''}>
                                          <div>
                                              <FileEarmarkCode />
                                          </div>
                                      </li>
                                      <li  className={current === 2 ?"active":''}>
                                          <div>
                                              <Check2Square />
                                          </div>
                                      </li>
                                      <li className={current === 3 ?"active":''}><div> <Display /></div></li>
                                  </ul>
                              </div>
                          </NavBox>
                          <CardBox body>
                              {
                                  current === 1 && <Step1 />
                              }
                              {
                                  current === 2 && <Step2 />
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

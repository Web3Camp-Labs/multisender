import type { NextPage } from 'next'
import Head from 'next/head'
import {Container, Row, Col, Card} from 'react-bootstrap';
import styled from "styled-components";
import HeaderTop from "./components/headTop";
// import BatchQuery from "./components/batchQuery";
import FooterBox from "./components/footerBox";
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


const Home: NextPage = () => {
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
                          <CardBox body>
                                {/* <BatchQuery /> */}
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

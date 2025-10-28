import React from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px 0;
  margin-top: auto;
  border-top: 1px solid #eee;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterText = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const FooterLinks = styled.div`
  a {
    margin-left: 15px;
    color: purple;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterText>
            &copy; {new Date().getFullYear()} Web3Camp MultiSender
          </FooterText>
          <FooterLinks>
            <a href="https://github.com/Web3Camp-Labs/multisender" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://web3camp.us" target="_blank" rel="noopener noreferrer">
              Web3Camp
            </a>
          </FooterLinks>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;

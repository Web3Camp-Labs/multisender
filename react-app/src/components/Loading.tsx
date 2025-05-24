import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useWeb3 } from '../context/Web3Context';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 400px;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  color: #333;
  font-size: 16px;
`;

const Loading: React.FC = () => {
  const { state } = useWeb3();
  const { tips } = state;

  return (
    <LoadingContainer>
      <LoadingContent>
        <Spinner animation="border" variant="primary" role="status" style={{ color: 'purple' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <LoadingText>{tips}</LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default Loading;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../context/Web3Context';
import UrlJson from '../config/url.json';

const Box = styled.div`
  h5 {
    padding: 10px 0 5px;
    color: #000000;
  }
  
  .transaction {
    padding: 20px 0 40px;
    
    li {
      margin-bottom: 10px;
      word-break: break-all;
    }
  }
`;

interface Props {
  handlePrev: () => void;
}

const Step3: React.FC<Props> = ({ handlePrev }) => {
  const { state } = useWeb3();
  const { txHash, txHashList, web3Provider } = state;
  const [txURL, setTxURL] = useState<string>('');

  useEffect(() => {
    const getId = async () => {
      if (!web3Provider) return;
      
      try {
        let url = "";
        const { chainId } = await web3Provider.getNetwork();
        // Convert bigint chainId to number for comparison with JSON config
        const urlArr = UrlJson.filter(item => item.id === Number(chainId));
        url = urlArr[0]?.url || '';
        setTxURL(url);
      } catch (error) {
        console.error('Error getting chain ID:', error);
      }
    };
    
    getId();
  }, [web3Provider]);

  return (
    <Box>
      <div>
        {txHash != null && (
          <>
            <h5>Approval history</h5>
            <ul className='transaction'>
              <li>
                <a 
                  href={`${txURL}/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {txHash}
                </a>
              </li>
            </ul>
          </>
        )}
        <h5>Transactions history</h5>
        <ul className='transaction'>
          {txHashList && txHashList.map((hash: string) => (
            <li key={hash}>
              <a 
                href={`${txURL}/${hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {hash}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <button className="btn btn-secondary" onClick={handlePrev}>
          Back
        </button>
      </div>
    </Box>
  );
};

export default Step3;

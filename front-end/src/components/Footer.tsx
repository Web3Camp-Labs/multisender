import React from 'react';
import styled from 'styled-components';
import GithubImg from '../res/github.png';
import TwitterImg from '../res/Twitter.png';
import Web3CampLogo from '/web3camp.logo.png';

const Footer = styled.div`
  width: 100%;
  padding: 32px 5% 24px;
  background: #fafbfc;
  border-top: 1px solid #e1e4e8;
  font-size: 14px;
  box-sizing: border-box;

  .footerContent {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mainRow {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
  }

  /* Left Panel */
  .leftPanel {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .companyName {
    color: #24292e;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      color: #0366d6;
    }
  }

  .logoImg {
    height: 36px;
    width: auto;
  }

  .socialIcons {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .socialIcons a {
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  img {
    width: 24px;
    height: 24px;
  }

  /* Right Panel */
  .rightPanel {
    display: flex;
    gap: 40px;
  }

  .linkColumn {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .columnHeading {
    color: #24292e;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .columnLink {
    color: #586069;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
    line-height: 1.6;

    &:hover {
      color: #0366d6;
    }
  }

  /* Bottom Copyright */
  .copyrightRow {
    margin-top: auto;
    color: #586069;
    font-size: 13px;
    text-align: left;
  }

  @media (max-width: 768px) {
    padding: 24px 3% 20px;

    .mainRow {
      flex-direction: column;
      gap: 32px;
    }

    .rightPanel {
      flex-direction: column;
      gap: 24px;
      width: 100%;
    }

    .copyrightRow {
      text-align: left;
    }
  }
`;

const FooterBox: React.FC = () => {
  return (
    <Footer>
      <div className="footerContent">
        <div className="mainRow">
          {/* Left Panel */}
          <div className="leftPanel">
            <a href="https://web3camp.us" target="_blank" rel="noreferrer" className="companyName">
              <img src={Web3CampLogo} alt="Web3Camp" className="logoImg" />
            </a>
            <div className="socialIcons">
              <a href="https://github.com/Web3Camp-Labs/multisender" target="_blank" rel="noreferrer">
                <img src={GithubImg} alt="GitHub" />
              </a>
              <a href="https://twitter.com/Web3Camp" target="_blank" rel="noreferrer">
                <img src={TwitterImg} alt="Twitter" />
              </a>
            </div>
            {/* Copyright */}
            <div className="copyrightRow">
              &copy; 2022-{new Date().getFullYear()} Web3Camp.us
            </div>
          </div>

          {/* Right Panel - Flexible Grid */}
          <div className="rightPanel">
            {/* Friend Links Column */}
            <div className="linkColumn">
              <div className="columnHeading">Friends</div>
              <a href="https://rebase.network" target="_blank" rel="noreferrer" className="columnLink">
                Rebase
              </a>
              <a href="https://learnblockchain.cn" target="_blank" rel="noreferrer" className="columnLink">
                登链社区
              </a>
            </div>

            {/* Resources Column */}
            <div className="linkColumn">
              <div className="columnHeading">Resources</div>
              <a href="https://github.com/Web3Camp-Labs/multisender" target="_blank" rel="noreferrer" className="columnLink">
                GitHub Repo
              </a>
              <a href="https://web3camp.us/quick-dapp" target="_blank" rel="noreferrer" className="columnLink">
                Quick dApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterBox;

import { ConnectKitButton } from "connectkit";

import styled from "styled-components";
const StyledButton = styled.button`
  background: #220749;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 100px;
  width: 50%;
  height: 50px;
  margin-top: 50px;
  color: white;
  font-family: Roboto;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
`;

export const ConnectButton = ({ children }) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        console.log(isConnected);
        children((connected) => (connected = isConnected));

        return (
          <div>
            <StyledButton onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </StyledButton>
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

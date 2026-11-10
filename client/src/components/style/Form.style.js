import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${(props) => props.isError && "red"};
  border-radius: 0.25rem;
  padding: 0.5rem;

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  /* width: fit-content; */
  background-color: #0b4a2d;
  padding: 10px 20px;
  color: white;
`;

export const ErrorInput = styled.div`
  width: 100%;
  text-align: left;
  padding: 2px;
  font-size: 0.9rem;
  color: red;
  display: ${(props) => (props.showMessage ? "block" : "none")};
`;

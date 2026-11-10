import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${(props) => (props.isError ? "red" : "#0b4a2d")};
  border-radius: 0.25rem;
  padding: 0.5rem;

  &:focus {
    outline: none;
  }
`;

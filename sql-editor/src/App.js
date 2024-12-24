import TrinoQueryInterface from './components/Trino Query Interface';
import styled from '@emotion/styled';

const Header = styled.header`
  background-color: #3b82f6;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;

function App() {
  return (
    <div className="App">
      <Header>
        <HeaderTitle>Trino Query Interface</HeaderTitle>
      </Header>
      <TrinoQueryInterface />
    </div>
  );
}

export default App;
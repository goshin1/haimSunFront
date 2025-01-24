import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Main from './component/Main';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route exact path='/' element={<Login></Login>}></Route>
          <Route exact path='/main' element={<Main></Main>}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

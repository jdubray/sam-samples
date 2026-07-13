import './App.css';
import Counter from './components/Counter'

function App() {
  return (
    <div className="App">
      <Counter counterName="counter-1" />
      <Counter counterName="counter-2" />
    </div>
  );
}

export default App;

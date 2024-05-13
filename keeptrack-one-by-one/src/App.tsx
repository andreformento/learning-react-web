import ButtonEvent from './ButtonEvent';
import FruitList, { Fruit } from './FruitList';
import HelloComponent from './hello/HelloComponent';
import HelloEvent from './hello/HelloEvent';
import HelloFunction from './hello/HelloFunction';
import HelloState from './hello/HelloState';
import WorkspacesPage from './workspaces/WorkspacesPage';

const fruits: Fruit[] = [
  { id: 1, name: 'apple' },
  { id: 2, name: 'orange' },
  { id: 3, name: 'blueberry' },
  { id: 4, name: 'banana' },
  { id: 5, name: 'kiwi' },
];

const App: React.FC = () => {
  return (
    <div>
      <FruitList fruits={fruits} />
      <ButtonEvent />
      <HelloEvent name="Eddie" level={4}></HelloEvent>
      <HelloState name="Eddie" level={4}></HelloState>
      <HelloFunction name='Eddie' level={3} />
      <HelloComponent name='Eddie' level={1} />

      <WorkspacesPage />
    </div>
  );
}

export default App;

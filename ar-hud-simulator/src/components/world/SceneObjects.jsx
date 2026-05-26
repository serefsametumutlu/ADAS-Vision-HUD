import SCENARIO from './scenario';
import Vehicle from './objects/Vehicle';
import Pedestrian from './objects/Pedestrian';
import TrafficSign from './objects/TrafficSign';
import TrafficLight from './objects/TrafficLight';
import CrosswalkZebra from './objects/CrosswalkZebra';

export default function SceneObjects() {
  return (
    <>
      {SCENARIO.map(obj => {
        switch (obj.type) {
          case 'vehicle':
            return <Vehicle key={obj.id} {...obj} />;
          case 'pedestrian':
            return <Pedestrian key={obj.id} {...obj} />;
          case 'sign':
            return <TrafficSign key={obj.id} {...obj} type={obj.signType} />;
          case 'traffic-light':
            return <TrafficLight key={obj.id} {...obj} />;
          case 'crosswalk':
            return <CrosswalkZebra key={obj.id} position={obj.pos} />;
          default:
            return null;
        }
      })}
    </>
  );
}

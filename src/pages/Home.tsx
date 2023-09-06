import { useEffect } from 'react';
import Nav from '../components/shared/Nav';
import Itinerary from '../components/Itinerary';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CardLabels from '../components/labels/CardLabels';

function Home(): JSX.Element {
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line no-inner-declarations
      async function getUser() {
        try {
          const { data: userInfo } = await axios.get(
            `/user/getUser/${user?.email}`
          );
          if (!userInfo.length) {
            const newUser = {
              email: user?.email,
              nickname: user?.nickname,
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { data: newUserInfo } = await axios.post(
              '/user/createUser',
              newUser
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      getUser();
    }
  }, [user]);
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Navigation Bar */}
      <div>
        <Nav />
        {/* Itinerary with Cards */}
        <div className='flex mx-10 my-10 space-x-4 '>
          <div className='w-[20%]'>
            <CardLabels />
          </div>
          <div className='w-[80%]'>
            <Itinerary />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default Home;

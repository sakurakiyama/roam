import Nav from '../components/shared/Nav';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserProvider';
import { UserData } from '../types';

/* 

TODO: [] Add a modal to navigate users to login if not signed in. 
TODO: [] Add styling 
TODO: [] Add logic to click on existing itineraries and..
            [] Edit them 
            [] Save them 
            [] Send them
*/

interface Itinerary {
  _id: string;
  cards: JSX.Element[];
  userID: string;
}
function Manage() {
  const contextValue = useContext(UserContext) as unknown as {
    user: UserData;
    updateUser: (userData: UserData) => void;
  };
  const { user: userData, updateUser } = contextValue;
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const { user } = useAuth0();
  const navigate = useNavigate();

  const createItinerary = async () => {
    try {
      const { data: newItinerary } = await axios.post('/user/createItinerary', {
        userID: userData._id,
      });
      setItineraries((prevState) => {
        return [...prevState, newItinerary];
      });
      navigate(`/build/${newItinerary._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const { data: userInfo } = await axios.get(
        `/user/getUser/${user?.email}`
      );
      if (!userInfo) {
        const newUser = {
          email: user?.email,
          nickname: user?.nickname,
        };
        const { data: newUserInfo } = await axios.post(
          '/user/createUser',
          newUser
        );
        updateUser(newUserInfo);

        return;
      } else {
        const { data: userItineraries } = await axios.get(
          `/user/getItineraries/${userInfo._id}`
        );
        setItineraries(userItineraries);
        updateUser(userInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  return (
    <>
      <Nav />
      <button onClick={createItinerary}>Create new itinerary</button>
      <div>
        All Itineraries:
        {itineraries.map((element) => {
          return <ul>{JSON.stringify(element)}</ul>;
        })}
      </div>
    </>
  );
}

export default Manage;

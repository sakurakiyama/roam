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
  itineraryName: string;
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

  const viewItinerary = (itineraryID: string) => {
    navigate(`/build/${itineraryID}`);
  };

  const deleteItinerary = async (itineraryID: string) => {
    try {
      await axios.delete(`/user/deleteItinerary/${itineraryID}`);
      setItineraries((prevState) => {
        const newItineraryList = prevState.filter((itinerary) => {
          if (itinerary._id !== itineraryID) return itinerary;
        });
        return newItineraryList;
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      <div>
        {itineraries.map((element) => {
          return (
            <div className='flex justify-between items-center border border-solid m-3 p-2 shadow-sm	rounded-lg'>
              <div className='flex-1'>{`${element.itineraryName}`}</div>
              <div className='flex space-x-2'>
                <button
                  className='text-blue-500'
                  onClick={() => viewItinerary(element._id)}
                >
                  View
                </button>
                <button
                  className='text-red-500'
                  onClick={() => deleteItinerary(element._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex justify-center border border-solid m-3 p-2 shadow-sm	rounded-lg'>
        <button onClick={() => createItinerary()}>Create new itinerary</button>
      </div>
    </>
  );
}

export default Manage;

/* eslint-disable @typescript-eslint/no-unused-vars */
import Nav from '../components/shared/Nav';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function Manage() {
  const [userData, setUserData] = useState({});
  const [itineraries, setItineraries] = useState<object[]>([]);

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

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line no-inner-declarations
      async function getUser() {
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
            setUserData(newUserInfo);
            return;
          } else {
            const { data: userItineraries } = await axios.get(
              `/user/getItineraries/${userInfo._id}`
            );
            setItineraries(userItineraries);
            setUserData(userInfo);
          }
        } catch (error) {
          console.log(error);
        }
      }
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
          return <div>{JSON.stringify(element)}</div>;
        })}
      </div>
    </>
  );
}

export default Manage;

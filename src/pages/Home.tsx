import React, { useEffect } from 'react';
import Nav from '../components/shared/Nav';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

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
    <div>
      <Nav />
    </div>
  );
}

export default Home;

import { getAuth } from '@/serv';

export const revalidate = 0;

const Profile = async () => {
  const session = await getAuth();
  return (<>
    {session ?
      (<>
        <p>user: {session.username}</p>
        <p>log in at {new Date(session.creationTime).toLocaleString()}</p>
        <p>user id: {session.userId}</p>
      </>) :
      <p>Not logged in</p>
    }
  </>);
};

export default Profile;

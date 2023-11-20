import InputArea from '@/components/LoginInput';

// refresh rsc when login/session change
export const revalidate = 0;

const Login = async () => {
  return (<>
    <h3 className="text-2xl my-2">Log In</h3>
    <div>
      <InputArea />
    </div>
  </>);
};

export default Login;

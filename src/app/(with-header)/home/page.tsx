import NewBlog from '@/components/NewBlog';

const Home = async () => {
  return (<>
    <h3 className="text-2xl my-2">Home Page</h3>
    {await NewBlog()}
  </>);
};

export default Home;

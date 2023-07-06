import { Layout } from '@/types';
import AppBar from '@/components/AppBar';

const WithHeaderLayout: Layout = ({
  children
}) => {
  return (<>
    <AppBar />
    <main className="mx-4 mt-2">
      {children}
    </main>
  </>);
};

export default WithHeaderLayout;

import { Layout } from '@/types';
import AppBar from '@/components/AppBar';

const WithHeaderLayout: Layout = ({
  children
}) => {
  return (<>
    <AppBar />
    <main className="px-6 mt-2">
      {children}
    </main>
  </>);
};

export default WithHeaderLayout;

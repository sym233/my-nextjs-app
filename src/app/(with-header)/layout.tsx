import { Layout } from '@/types';
import AppBar from '@/components/AppBar';
import Footer from '@/components/Footer';

const WithHeaderLayout: Layout = ({
  children
}) => {
  return (<>
    <AppBar />
    <main className="px-6 my-2 flex-1">
      {children}
    </main>
    <Footer />
  </>);
};

export default WithHeaderLayout;

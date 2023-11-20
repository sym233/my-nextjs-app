import { Suspense } from 'react';

import { Layout } from '@/types';

const Layout: Layout = ({ children }) => {
  return <>
  <h3 className="text-2xl my-2">Profile</h3>
    <Suspense>
      {children}
    </Suspense>
  </>
}

export default Layout;

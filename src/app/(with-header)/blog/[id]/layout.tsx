import { Layout } from "@/types";

export default (({ children }) => {
  return (
    <div className="border border-gray-100 rounded shadow-sm p-2 max-w-screen-2xl mx-auto">
      {children}
    </div>
  );
}) satisfies Layout;

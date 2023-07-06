import { blog } from "@/db/blog";
import { Page } from "@/types";

const Post: Page<{ id: string }> = async (props) => {
  const { params } = props;
  const b = await blog(parseInt(params.id));
  if (b.error) {
    return <p>Error: {b.error}</p>;
  }
  if (b.data) {
    const { id, title, content } = b.data;
    return (
      <>
        <p>You are reading Post (/{id})</p>
        <h3>{title}</h3>
        <p>{content}</p>
      </>
    );
  }
  return <p>blog {params.id} not exists</p>;
};

export default Post;

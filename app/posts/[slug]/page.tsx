import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allPosts.map((post): any => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: any) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) {
    return <div>Loading...</div>;
  }
  return { title: post.title };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) {
    return <div>Loading...</div>;
  }
  const Content = getMDXComponent(post.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={post?.startDate} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post?.startDate), "LLLL d, yyyy")}
        </time>

        <h1>{post.title}</h1>
        <p>so here slug edit {post.duration}</p>
      </div>
      <Content />
    </article>
  );
};

export default PostLayout;

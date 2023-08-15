import { useRef } from 'react';
import { useAddPostMutation, useGetPostsQuery, useDeletePostMutation } from './postService';

export default function Posts() {
  const ref = useRef<HTMLInputElement>(null);
  const { data, isFetching } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();
  const [deletePost] = useDeletePostMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ref.current) return;
    if (ref.current.value === '') return;
    addPost({ title: ref.current.value, id: Date.now() });
    ref.current.value = '';
  };

  return (
    <main>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Title' ref={ref} />
        <button>Submit</button>
      </form>
      <h1>All Posts</h1>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        data?.map(post => (
          <article
            key={post.id}
            style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <p>{post.title}</p>
            <button onClick={() => deletePost(post.id)}>X</button>
          </article>
        ))
      )}
    </main>
  );
}

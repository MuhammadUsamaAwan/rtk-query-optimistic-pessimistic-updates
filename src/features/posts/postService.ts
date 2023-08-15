import { api } from '../../app/api';
import { Post } from './types';

const postsApi = api.injectEndpoints({
  endpoints: build => ({
    getPosts: build.query<Post[], void | undefined>({
      query: () => 'posts',
      providesTags: ['Posts'],
    }),
    addPost: build.mutation<Post, Post>({
      query: body => ({
        url: 'posts',
        method: 'POST',
        body,
      }),
      // pessimistic update
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          (api as typeof postsApi).util.updateQueryData('getPosts', undefined, draft => {
            return [...draft, data];
          })
        );
        try {
          await queryFulfilled;
        } catch (e) {
          console.log(e);
          dispatch(api.util.invalidateTags(['Posts']));
        }
      },
    }),
    deletePost: build.mutation<Post, number>({
      query: id => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      // optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(
          (api as typeof postsApi).util.updateQueryData('getPosts', undefined, draft => {
            return draft.filter(post => post.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          dispatch(api.util.invalidateTags(['Posts']));
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } = postsApi;

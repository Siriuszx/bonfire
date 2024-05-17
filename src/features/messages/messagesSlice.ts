import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

import type { RootState } from '@/app/store';
import type { Message } from '@/types/Message';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TPostMessageBody = {
  user: string;
  body: string;
  reply?: string;
};

type MessagesState = {
  shouldScrollDown: boolean;
  listState: Record<string, { currentPage: number }>;
};

const initialState: MessagesState = {
  shouldScrollDown: true,
  listState: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    shouldScrollDownSet: (state, action: PayloadAction<boolean>) => {
      state.shouldScrollDown = action.payload;
    },
    pageCountIncreased: (state, { payload }: PayloadAction<string>) => {
      state.listState[payload].currentPage += 1;
    },
  },
});

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], { chatRoomId: string; page: number }>(
      {
        query: ({ chatRoomId, page }) =>
          `/chat-rooms/${chatRoomId}/messages?page=${page ?? 0}`,
      },
    ),
    getMessagesCount: builder.query<number, { chatRoomId: string }>({
      query: ({ chatRoomId }) => `/chat-rooms/${chatRoomId}/messages/count`,
    }),
    postMessage: builder.mutation<
      Message,
      { chatRoomId: string; body: TPostMessageBody }
    >({
      query: ({ chatRoomId, body }) => ({
        url: `/chat-rooms/${chatRoomId}/messages`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ chatRoomId }, { dispatch, queryFulfilled }) => {
        const result = (await queryFulfilled).data;
        dispatch(
          messagesApiSlice.util.updateQueryData(
            'getMessages',
            { chatRoomId, page: 1 },
            (draft) => {
              draft.unshift(result);
            },
          ),
        );
        dispatch(shouldScrollDownSet(true));
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessagesCountQuery,
  usePostMessageMutation,
} = messagesApiSlice;

export const { shouldScrollDownSet, pageCountIncreased } =
  messagesSlice.actions;

export default messagesSlice;

export const selectMessageListCurrentPage =
  (chatRoomId: string) => (state: RootState) =>
    state.messages.listState[chatRoomId]?.currentPage ?? 0;

export const selectShouldScrollDown = (state: RootState) =>
  state.messages.shouldScrollDown;

export const selectMessagesByChatId =
  (chatRoomId: string, page: number) => (state: RootState) =>
    messagesApiSlice.endpoints.getMessages.select({ chatRoomId, page })(state)
      .data;

export const selectMessageById =
  ({
    chatRoomId,
    page,
    id,
  }: {
    chatRoomId: string;
    page: number;
    id: string;
  }) =>
  (state: RootState) =>
    messagesApiSlice.endpoints.getMessages
      .select({ chatRoomId, page })(state)
      .data?.find((m) => m._id === id);

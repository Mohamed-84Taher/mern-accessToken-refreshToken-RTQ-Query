import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: data => ({
        url: "/auth",
        method: "POST",
        body: { ...data }
      })
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET"
      })
    })
  })
});

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice;

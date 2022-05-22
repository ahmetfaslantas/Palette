import { useReducer, useCallback } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        done: true,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
}

function useFetch(
  url,
  options = {
    method: "GET",
  }
) {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: null,
    isError: null,
    done: false,
  });

  const fetchData = useCallback(
    async (body) => {
      dispatch({ type: "FETCH_INIT" });

      const response = await fetch(`${process.env.API_URL}${url}`, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
        credentials: "include",
      });

      if (!response.ok) {
        dispatch({ type: "FETCH_FAILURE", payload: data });
        return;
      }

      const data = await response.json();

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    },
    [url, options]
  );

  return {
    ...state,
    fetchData,
  };
}

export default useFetch;

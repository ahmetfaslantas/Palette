import { useReducer, useEffect } from "react";

function useFetch(url, options) {
  function fetchStatus(state, action) {
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

  const [state, dispatch] = useReducer(fetchStatus, {
    isLoading: true,
    data: null,
    isError: null,
  });

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: "FETCH_INIT" });
      const response = await fetch(`${process.env.API_URL}${url}`, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : null,
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        dispatch({ type: "FETCH_FAILURE", payload: data });
        return;
      }

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    }

    fetchData();
  }, [url]);

  return state;
}

export default useFetch;

const initialState = {
  user: null,
  token: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}
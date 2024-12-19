import '../styles/globals.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import users from '../reducers/user';  // Assurez-vous que le chemin est correct

const store = configureStore({
  reducer: { users },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
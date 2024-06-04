import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `http://localhost:6969/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  const googleAuth = () => {
		window.open(
			`http://localhost:6969/auth/google/callback`,
			"_self"
		);
	};

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <button onClick={googleAuth}>
        <span>Sing in with Google</span>
      </button>
    </>
  )
}

export default App

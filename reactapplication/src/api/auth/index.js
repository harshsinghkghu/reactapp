
import { JWT_EXPIRES_IN, JWT_SECRET, sign } from 'src/utils/jwt';
//import { users } from './data';
import axios from 'axios';
import { apiUrl } from 'src/config';

const STORAGE_KEY = 'users';

var users = {}




// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

const getPersistedUsers = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const persistUser = (user) => {
  try {
    const users = getPersistedUsers();
    const data = JSON.stringify([...users, user]);
    sessionStorage.setItem(STORAGE_KEY, data);
  } catch (err) {
    console.error(err);
  }
};

class AuthApi {
  async signIn(request) {
    const { email, password } = request;
    await axios
      .get(apiUrl + `getUserByUsername/${email}`)
      .then((response) => {
        users = response.data.loggedIUser[0];

        if (
          response &&
          response.data &&
          response.data.loggedIUser.length > 0 &&
          password === response.data.loggedIUser[0].password
        ) {
          window.sessionStorage.setItem(
            "user",
            response.data.loggedIUser[0].id
          );
          window.sessionStorage.setItem(
            "mail",
            response.data.loggedIUser[0].userName
          );
          window.sessionStorage.setItem(
            "password",
            response.data.loggedIUser[0].password
          );
          localStorage.setItem("user", response.data.loggedIUser[0].id);
          //const accessToken = sign({ userId: user.id }, user.id, null);
          //const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

          //resolve({accessToken});
        }

      })
      .catch((error) => {
        console.error('[Auth Api]: ', error);
        //return new Error('Internal server error');
      });

    return new Promise((resolve, reject) => {
      try {
        // Merge static users (data file) with persisted users (browser storage)
        /*const mergedUsers = [
          ...users,
          ...getPersistedUsers()
        ];*/

        // Find the user
        //const user = mergedUsers.find((user) => user.emailId === email);

        if (users.password !== password) {
          reject(new Error("Please check your email and password"));

        }

        // Create the access token
        const accessToken = sign({ userId: users.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(
          new Error(
            "Please register your account. If already registered then contact us at contactus@techmaadhyam.com for activation"
          )
        );
      }
    });
  }

  async signUp(request) {
    const { email, password } = request;
    await axios
      .get(apiUrl + `getUserByUsername/${email}`)
      .then((response) => {
        console.log(response.data);
        if (response && response.data && response.data.length > 0 && password === response.data[0].password) {
          users = response.data[0];
          //const accessToken = sign({ userId: user.id }, user.id, null);
          //const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

          //resolve({accessToken});
        }
      })
      .catch((error) => {
        console.error('[Auth Api]: ', error);
        //return new Error('Internal server error');
      });

    return new Promise((resolve, reject) => {
      try {
        // Merge static users (data file) with persisted users (browser storage)
        /*const mergedUsers = [
          ...users,
          ...getPersistedUsers()
        ];*/

        // Check if a user already exists
        //let user = mergedUsers.find((user) => user.emailId === email);

        if (users) {
          reject(new Error('User already exists'));
          return;
        }

        let user = {
          id: users.id,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          email: users.emailId,
          name: users.name,
          plan: users.id
        };

        persistUser(user);

        const accessToken = sign({ userId: users.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(request) {
    //const { accessToken } = request;

    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        //const decodedToken = decode(accessToken);

        // Merge static users (data file) with persisted users (browser storage)
        /*const mergedUsers = [
          ...users,
          ...getPersistedUsers()
        ];*/

        // Find the user
        /* const { userId } = decodedToken;*/
        //const user = mergedUsers.find((user) => users.id === userId);

        if (!users) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          id: users.id,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          email: users.emailId,
          name: users.name,
          plan: users.id
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();

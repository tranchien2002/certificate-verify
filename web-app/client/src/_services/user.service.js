import axios from 'axios';

export const userService = {
  login,
  register
};

async function login(username, password) {
  let respone = await axios.post(
    `${process.env.VUE_APP_API_BACKEND}/auth/login`,
    {
      username: username,
      password: password
    },
    { 'content-type': 'application/x-www-form-urlencoded' }
  );

  let user = await handleResponse(respone);
  if (user.token) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return new Error(user);
}

async function register(user) {
  let response = await axios.post(`${process.env.VUE_APP_API_BACKEND}/auth/register`, {
    username: user.username,
    name: user.name,
    password: user.password
  });
  return handleResponse(response);
}

async function handleResponse(response) {
  return new Promise((resolve, reject) => {
    let data = response.data;
    if (response.status === 200) {
      if (data.success === true) {
        resolve(data);
      } else {
        reject(data.msg);
      }
      if (errors) {
        reject(errors);
      }
    } else if (response.status === 401) {
      location.reload(true);
    } else {
      const error = (data && data.msg) || response.statusText;
      reject(error);
    }
  });
}

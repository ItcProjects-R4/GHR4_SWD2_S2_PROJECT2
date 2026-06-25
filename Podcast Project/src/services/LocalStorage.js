const ACCOUNTS_KEY = "podcastAccounts";
const LOGGED_IN_KEY = "loggedInUser";
const USER_KEY = "user";
const IS_LOGGED_IN_KEY = "isLoggedIn";
const SAVED_EMAIL_KEY = "savedEmail";
const REMEMBER_ME_KEY = "rememberMe";

function getAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerUser({ name, email, phone, password }) {
  const accounts = getAccounts();

  if (accounts.some((acc) => acc.email === email)) {
    throw new Error("Email already exists");
  }

  const newUser = { name, email, phone, password };
  accounts.push(newUser);
  saveAccounts(accounts);

  // Save for persistence
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(IS_LOGGED_IN_KEY, "true");
  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(newUser));

  return newUser;
}

export function loginUser({ email, password }) {
  const accounts = getAccounts();
  const user = accounts.find(
    (acc) => acc.email === email && acc.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Save for persistence
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(IS_LOGGED_IN_KEY, "true");
  localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));

  return user;
}

export function getLoggedInUser() {
  // Check new format first
  const userRaw = localStorage.getItem(USER_KEY);
  const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY) === "true";

  if (userRaw && isLoggedIn) {
    try {
      return JSON.parse(userRaw);
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  }

  // Fallback to old format
  const raw = localStorage.getItem(LOGGED_IN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logoutUser() {
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  // Keep savedEmail and rememberMe for convenience
}

export function clearAllData() {
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(SAVED_EMAIL_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
}

export function getSavedEmail() {
  return localStorage.getItem(SAVED_EMAIL_KEY);
}

export function setSavedEmail(email) {
  localStorage.setItem(SAVED_EMAIL_KEY, email);
}

export function removeSavedEmail() {
  localStorage.removeItem(SAVED_EMAIL_KEY);
}

export function getRememberMe() {
  return localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function setRememberMe(value) {
  localStorage.setItem(REMEMBER_ME_KEY, value ? "true" : "false");
}
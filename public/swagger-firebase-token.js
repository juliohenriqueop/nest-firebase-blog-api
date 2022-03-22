function findFirebaseAuthUserKey(keys) {
  const firebaseAuthUserKey = keys.find((key) =>
    key.startsWith('firebase:authUser'),
  );

  return firebaseAuthUserKey;
}

function getFirebaseLocalStorageDb() {
  const indexedDB = window.indexedDB;
  const openIndexedDbRequest = indexedDB.open('firebaseLocalStorageDb', 1);

  return new Promise((resolve, reject) => {
    openIndexedDbRequest.onerror = () => {
      reject('Unable to open firebaseLocalStorageDb!');
    };

    openIndexedDbRequest.onsuccess = (event) => {
      const firebaseLocalStorageDb = event.target.result;
      resolve(firebaseLocalStorageDb);
    };
  });
}

function getFirebaseLocalStorageTransaction(firebaseLocalStorageDb) {
  const firebaseLocalStorageTransaction = firebaseLocalStorageDb.transaction(
    'firebaseLocalStorage',
    'readwrite',
  );

  return firebaseLocalStorageTransaction;
}

function getFirebaseLocalStorageStore(firebaseLocalStorageTransaction) {
  const firebaseLocalStorageStore = firebaseLocalStorageTransaction.objectStore(
    'firebaseLocalStorage',
  );

  return firebaseLocalStorageStore;
}

function getAllFirebaseLocalStorageDbKeys(firebaseLocalStorageStore) {
  const allFirebaseLocalStorageDbKeysRequest =
    firebaseLocalStorageStore.getAllKeys();

  return new Promise((resolve, reject) => {
    allFirebaseLocalStorageDbKeysRequest.onerror = () => {
      reject('Unable to find firebase keys from indexedDB!');
    };

    allFirebaseLocalStorageDbKeysRequest.onsuccess = () => {
      const allFirebaseLocalStorageDbKeys =
        allFirebaseLocalStorageDbKeysRequest.result;

      resolve(allFirebaseLocalStorageDbKeys);
    };
  });
}

function getFirebaseAuthUserEntryFromIndexedDB(
  firebaseLocalStorageStore,
  firebaseAuthUserKey,
) {
  const firebaseAuthUserEntryRequest =
    firebaseLocalStorageStore.get(firebaseAuthUserKey);

  return new Promise((resolve, reject) => {
    firebaseAuthUserEntryRequest.onerror = () => {
      reject('Unable to find firebase auth user from indexedDB!');
    };

    firebaseAuthUserEntryRequest.onsuccess = () => {
      const firebaseAuthUserEntry = firebaseAuthUserEntryRequest.result;
      resolve(firebaseAuthUserEntry);
    };
  });
}

async function deleteFirebaseAuthUserEntryFromIndexedDB(
  firebaseLocalStorageStore,
  firebaseAuthUserKey,
) {
  const deleteFirebaseAuthUserEntryRequest =
    firebaseLocalStorageStore.delete(firebaseAuthUserKey);

  return new Promise((resolve, reject) => {
    deleteFirebaseAuthUserEntryRequest.onerror = () => {
      reject('Unable to delete firebase auth user from indexedDB!');
    };

    deleteFirebaseAuthUserEntryRequest.onsuccess = () => {
      const firebaseAuthUserEntry = deleteFirebaseAuthUserEntryRequest.result;
      resolve(firebaseAuthUserEntry);
    };
  });
}

async function getFirebaseIdTokenFromIndexedDB(firebaseAuthUserEntry) {
  const firebaseAuthUser = firebaseAuthUserEntry.value;
  const idToken = firebaseAuthUser.stsTokenManager.accessToken;

  return idToken;
}

function getFirebaseAuthUseKeyFromLocalStorage() {
  const localStorage = window.localStorage;
  const localStorageKeys = Object.keys(localStorage);
  const firebaseAuthUseKey = findFirebaseAuthUserKey(localStorageKeys);

  return firebaseAuthUseKey;
}

function getFirebaseIdTokenFromLocalStorage(firebaseAuthUseKey) {
  const firebaseAuthUserData = localStorage.getItem(firebaseAuthUseKey);

  if (!firebaseAuthUserData) {
    return null;
  }

  const firebaseAuthUser = JSON.parse(firebaseAuthUserData);
  const idToken = firebaseAuthUser.stsTokenManager.accessToken;

  return idToken;
}

function deleteFirebaseIdTokenFromLocalStorage(firebaseAuthUseKey) {
  const localStorage = window.localStorage;
  localStorage.removeItem(firebaseAuthUseKey);
}

function findTokenInput() {
  const tokenInput = document.querySelector('.auth-container input[type=text]');
  return tokenInput;
}

function updateTokenInputValue(tokenInput, idToken) {
  const tokenInputPrototype = Object.getPrototypeOf(tokenInput);
  const tokentInputPrototypeValue = Object.getOwnPropertyDescriptor(
    tokenInputPrototype,
    'value',
  );
  const tokenInputPrototypeValueSetter = tokentInputPrototypeValue.set;
  tokenInputPrototypeValueSetter.call(tokenInput, idToken);

  const updateTokenEvent = new Event('input', {
    bubbles: true,
  });

  tokenInput.dispatchEvent(updateTokenEvent);
}

window.addEventListener('storage', () => {
  const findIdTokenInterval = setInterval(async () => {
    let idToken = null;

    try {
      const firebaseLocalStorageDb = await getFirebaseLocalStorageDb();

      const firebaseLocalStorageTransaction =
        getFirebaseLocalStorageTransaction(firebaseLocalStorageDb);

      const firebaseLocalStorageStore = getFirebaseLocalStorageStore(
        firebaseLocalStorageTransaction,
      );

      const allFirebaseLocalStorageDbKeys =
        await getAllFirebaseLocalStorageDbKeys(firebaseLocalStorageStore);

      const firebaseAuthUserKey = findFirebaseAuthUserKey(
        allFirebaseLocalStorageDbKeys,
      );

      const firebaseAuthUserEntry = await getFirebaseAuthUserEntryFromIndexedDB(
        firebaseLocalStorageStore,
        firebaseAuthUserKey,
      );

      idToken = await getFirebaseIdTokenFromIndexedDB(firebaseAuthUserEntry);

      await deleteFirebaseAuthUserEntryFromIndexedDB(
        firebaseLocalStorageStore,
        firebaseAuthUserKey,
      );
    } catch {
      const firebaseAuthUseKey = getFirebaseAuthUseKeyFromLocalStorage();
      idToken = await getFirebaseIdTokenFromLocalStorage(firebaseAuthUseKey);

      deleteFirebaseIdTokenFromLocalStorage(firebaseAuthUseKey);
    }

    const tokenInput = findTokenInput();

    if (tokenInput && idToken) {
      updateTokenInputValue(tokenInput, idToken);
      clearInterval(findIdTokenInterval);
    }
  }, 1000);
});

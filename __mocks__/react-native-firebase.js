// firestore mocks
export class Firestore {
  collection = name => {
    if (!this[name]) {
      this[name] = new Collection(name);
    }
    return this[name];
  };

  doc = name => {
    if (!this[name]) {
      this[name] = new Doc(name);
    }
    return this[name];
  };
}

export class Collection {
  constructor(name) {
    this.name = name;
    this.snap = { val: () => this._val() };
  }

  where = jest.fn(() => {
    return this;
  });

  orderBy = jest.fn(() => {
    return this;
  });

  limit = jest.fn(() => {
    return this;
  });

  get = jest.fn(() => {
    return new Query();
  });

  onSnapshot = (successCallback, errorCallback) => {
    successCallback({ docs: [] });
    return jest.fn();
  };

  doc = name => {
    return new Doc(name);
  };
}

export class Query {
  then = jest.fn((param, callback) => {
    return Promise.resolve([new Doc(), new Doc()]);
  });
}

export class Doc {
  constructor(path) {
    this.path = path;
    this.snap = { val: () => this._val() };
    this.data = null;
  }

  _val = jest.fn(() => {
    return this.data;
  });

  onSnapshot = jest.fn((param, callback) => {
    const promise = new Promise((resolve, reject) => {
      if (callback) {
        callback(this.snap);
        resolve();
      } else {
        resolve(this.snap);
      }
    });
    return promise;
  });

  set = jest.fn((param, callback) => {
    return Promise.resolve();
  });

  update = jest.fn(data => {
    return Promise.resolve();
  });

  remove = jest.fn(() => {
    return Promise.resolve();
  });

  collection = jest.fn(() => {
    return new Collection();
  });
}

// other mocks
export class Analytics {
  setAnalyticsCollectionEnabled = jest.fn();

  logEvent = jest.fn();

  setCurrentScreen = jest.fn();
}

export class Notifications {
  onNotification = jest.fn(() => {
    return Promise.resolve();
  });
  onNotificationOpened = jest.fn(() => {
    return Promise.resolve();
  });
  getInitialNotification = jest.fn(() => {
    return Promise.resolve();
  });
}

export class Messaging {
  getToken = jest.fn(() => {
    return Promise.resolve();
  });
}

export class Storage {
  constructor() {
    this.ref = null;
  }

  ref = name => {
    if (!this.ref) {
      this.ref = name;
    }
    return this;
  };

  putFile = jest.fn(() => {
    return Promise.resolve();
  });
}

export class Links {
  getInitialLink = jest.fn(() => {
    return Promise.resolve();
  });
}

export default class RNFirebase {
  static initializeApp() {
    RNFirebase.firebase = new MockFirebase();
    RNFirebase.promises = [];
    return RNFirebase.firebase;
  }

  static reset() {
    RNFirebase.promises = [];
    RNFirebase.firebase.firestoreInstance = null;
  }

  static waitForPromises() {
    return Promise.all(RNFirebase.promises);
  }

  static analytics() {
    if (!this.analyticsInstance) {
      this.analyticsInstance = new Analytics();
    }
    return this.analyticsInstance;
  }

  static firestore() {
    if (!this.firestoreInstance) {
      this.firestoreInstance = new Firestore();
    }
    return this.firestoreInstance;
  }

  static storage() {
    if (!this.storageInstance) {
      this.storageInstance = new Storage();
    }
    return this.storageInstance;
  }

  static notifications() {
    if (!this.notificationsInstance) {
      this.notificationsInstance = new Notifications();
    }
    return this.notificationsInstance;
  }

  static messaging() {
    if (!this.messagingInstance) {
      this.messagingInstance = new Messaging();
    }
    return this.messagingInstance;
  }

  static links() {
    if (!this.linksInstance) {
      this.linksInstance = new Links();
    }
    return this.linksInstance;
  }

  static app() {}
}

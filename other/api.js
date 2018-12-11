(function () {
  window.API = {}

  function fail () {
    return Math.floor(Math.random()*(5-1)) === 3
  }

  function generateId () {
    return Math.random().toString(36).substring(2);
  }

  var weapons = [
    {
      id: generateId(),
      name: 'Sword',
    },
    {
      id: generateId(),
      name: 'Musket',
    },
  ];
  var pirates = [
    {
      id: generateId(),
      name: 'Molly the Tyrant',
      complete: false,
    },
    {
      id: generateId(),
      name: 'Pete Shelly',
      complete: false,
    },
    {
      id: generateId(),
      name: 'Leonard Cohen',
      complete: true,
    }
  ];

  API.fetchWeapons = function () {
    return new Promise((res, rej) => {
      setTimeout(function () {
        res(weapons)
      }, 2000)
    })
  }

  API.fetchPirates = function () {
    return new Promise((res, rej) => {
      setTimeout(function () {
        res(pirates)
      }, 2000)
    })
  }

  API.savePirate = function (name) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        const pirate = {
          id: generateId(),
          name: name,
          complete: false,
        }
        pirates = pirates.concat([pirate]);
        fail() ? rej(pirate) : res(pirate);
      }, 300)
    })
  }

  API.saveWeapon = function (name) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        const weapon = {
          id: generateId(),
          name: name,
        }
        weapons = weapons.concat([weapon]);
        fail() ? rej(weapon) : res(weapon);
      }, 300)
    })
  }

  API.deleteWeapon = function (id) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        weapon = weapon.filter((weapon) => weapon.id !== id);
        fail() ? rej(): res(weapons);
      }, 300)
    });
  }

  API.deletePirate = function (id) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        pirates = pirates.filter((pirate) => pirate.id !== id);
        fail() ? rej(): res(pirates);
      }, 300)
    });
  }

  API.savePirateToggle = function (id) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        pirates = pirates.map((pirate) => pirate.id !== id ? pirate :
          Object.assign({}, pirate, {complete: !pirate.complete})
        );

        fail() ? rej(): res(pirates);
      }, 300)
    });
  }
})()
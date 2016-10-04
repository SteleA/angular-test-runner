module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals" : {
      "require":false,
      // Angular
      "angular": false,

      // Angular mocks
      "module": false,
      "inject": false,

      // Jasmine
      "jasmine": false,
      "describe": false,
      "beforeEach": false,
      "afterEach": false,
      "it": false,
      "expect": false,
      "spyOn": false,

      //other
      moment:false,
      _:false
    }
};

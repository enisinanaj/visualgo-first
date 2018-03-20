export default ApplicationConfig = (() => {
    let instance = null;
    return class ApplicationConfig {
      static getInstance() {
        if (instance == null) {
          instance = new ApplicationConfig();
        }
        return instance;
      }
    }
})();
var self;

self = {
  Environments: function() {
    return {
      DEVELOPMENT: "development",
      PRODUCTION: "production"
    };
  },
  isProduction: function() {
    return self.getEnvironment() === self.Environments.PRODUCTION;
  },
  isDevelopment: function() {
    return self.getEnvironment() === self.Environments.DEVELOPMENT;
  },
  getEnvironment: function() {
    return self.Environments.DEVELOPMENT;
  },
  getUrl: function() {
    switch (self.getEnvironment()) {
      case self.isDevelopment():
        return "http://localhost:2301/";
      default:
        return "http://api.shipper.co.nz/";
    }
  },
  getRiakSchemaPrefix: function() {
    if (self.isDevelopment()) {
      return "shipper_";
    }
    return "";
  },
  getJWTKey: function() {
    return "SaS(50CdC499o8lLrQG`7#0Fy7#U18";
  }
};

module.exports = self;

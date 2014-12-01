self =
  Environments: ->
    DEVELOPMENT: "development"
    PRODUCTION: "production"
  isProduction: ->
    return self.getEnvironment() is self.Environments.PRODUCTION
  isDevelopment: ->
    return self.getEnvironment() is self.Environments.DEVELOPMENT
  getEnvironment: ->
    return self.Environments.DEVELOPMENT
  getUrl: ->
    switch self.getEnvironment()
      when self.isDevelopment()
        return "http://localhost:2301/"
      else
        return "http://api.shipper.co.nz/"
  getRiakSchemaPrefix: ->
    if self.isDevelopment()
      return "shipper_"
    return ""
  getJWTKey: ->
    return "SaS(50CdC499o8lLrQG`7#0Fy7#U18"

module.exports = self
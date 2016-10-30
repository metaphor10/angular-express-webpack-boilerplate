function AppConfig($stateProvider, $locationProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/")
}

export default AppConfig

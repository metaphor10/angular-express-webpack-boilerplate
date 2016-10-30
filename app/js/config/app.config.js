function AppConfig($stateProvider, $locationProvider, $urlRouterProvider) {
  "ngInject"

  $locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise("/")
}

export default AppConfig

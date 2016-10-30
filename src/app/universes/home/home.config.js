export default function HomeConfig($stateProvider) {
  "ngInject"

  $stateProvider
    .state("home", {
      url: "/",
      template: require("./home.html"),
      controller: "HomeCtrl",
      title: "Accueil",
      resolve: {
        datas() {
        },
      },
    })
}

export default function ArticleConfig($stateProvider) {
  "ngInject"

  $stateProvider
    .state("article", {
      url: "/article",
      template: require("./article.html"),
      controller: "ArticleCtrl",
      title: "Article",
      resolve: {
        datas() {
        },
      },
    })
}

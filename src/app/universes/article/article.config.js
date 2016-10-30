export default function ArticleConfig($stateProvider) {
  $stateProvider
    .state("article", {
      url: "/article",
      template: require("./list/list.html"),
      controller: "ArticleListCtrl",
      title: "Article",
    })
}

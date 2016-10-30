export default function ArticleListCtrl($scope, ArticleFactory) {
  ArticleFactory.getArticles($scope)
}

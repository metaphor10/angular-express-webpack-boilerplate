export default function ArticleFactory($http) {

  function getArticles($scope) {
    $http.get("/articles").success((articles) => {
      $scope.articles = articles
    })
  }

  function getArticle($scope, articleId) {
    $http.get(`/articles/${articleId}`).success((article) => {
      $scope.article = article
    })
  }

  function createArticle($scope, article) {
    $http.post("/articles", article).success((article) => {
      $scope.article = article
    })
  }

  function updateArticle($scope, article) {
    $http.put(`/articles/${article._id}`, article).success(() => {
      getTasks($scope)
    })
  }

  function deleteArticle($scope, article) {
    $http.delete(`/articles/${article._id}`).success(() => {
      console.log("Article succefully deleted")
    })
  }

  return {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  }
}

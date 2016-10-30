export default function ArticleFactory($http) {

  function getArticles($scope) {
    $http.get("/articles").success((articles) => {
      $scope.articles = articles
    })
  }

  function createArticle($scope) {
    if (!$scope.createTaskInput) {
      return
    }

    $http.post("/todos", {
      task: $scope.createTaskInput,
      isCompleted: false,
      isEditing: false,
    }).success(() => {
      getTasks($scope)
      $scope.createTaskInput = ""
    })
  }

  function updateArticle($scope, article) {
    $http.put(`/articles/${article._id}`, {task: todo.updatedTask}).success(() => {
      getTasks($scope)
    })
  }

  function deleteArticle($scope) {
    $http.delete(`/todos/${todoToDelete._id}`).success(() => {
      getTasks($scope)
    })
  }

  return {
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  }
}

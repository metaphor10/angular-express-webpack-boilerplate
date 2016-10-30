import angular from "angular"
import ArticleConfig from "./article.config"
import ArticleCtrl from "./articleController"

// Create the module where our functionality can attach to
const articleModule = angular.module("app.article", [])
articleModule.config(ArticleConfig)
articleModule.controller("ArticleCtrl", ArticleCtrl)

export default articleModule

import angular from "angular"
import HomeConfig from "./home.config"
import HomeCtrl from "./homeController"

// Create the module where our functionality can attach to
const homeModule = angular.module("app.home", [])
homeModule.config(HomeConfig)
homeModule.controller("HomeCtrl", HomeCtrl)

export default homeModule

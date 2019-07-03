"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var ngfBackground_directive_1 = require("./ngfBackground.directive");
var ngfDrop_directive_1 = require("./ngfDrop.directive");
var ngf_directive_1 = require("./ngf.directive");
var ngfSelect_directive_1 = require("./ngfSelect.directive");
var ngfUploadStatus_directive_1 = require("./ngfUploadStatus.directive");
var ngfFormData_directive_1 = require("./ngfFormData.directive");
var ngfSrc_directive_1 = require("./ngfSrc.directive");
var declarations = [
    ngfDrop_directive_1.ngfDrop,
    ngfSelect_directive_1.ngfSelect,
    ngfBackground_directive_1.ngfBackground,
    ngfSrc_directive_1.ngfSrc,
    ngfUploadStatus_directive_1.ngfUploadStatus,
    ngfFormData_directive_1.ngfFormData,
    ngf_directive_1.ngf
];
var ngfModule = (function () {
    function ngfModule() {
    }
    ngfModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: declarations,
            exports: declarations
        })
    ], ngfModule);
    return ngfModule;
}());
exports.ngfModule = ngfModule;

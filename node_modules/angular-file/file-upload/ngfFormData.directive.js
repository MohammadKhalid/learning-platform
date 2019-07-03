"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngfFormData = (function () {
    function ngfFormData(IterableDiffers) {
        this.postName = "file";
        this.FormData = new FormData();
        this.FormDataChange = new core_1.EventEmitter();
        this.differ = IterableDiffers.find([]).create();
    }
    ngfFormData.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.differ.diff(this.files);
        if (changes) {
            setTimeout(function () { return _this.buildFormData(); }, 0);
        }
    };
    ngfFormData.prototype.buildFormData = function () {
        var _this = this;
        var isArray = typeof (this.files) === 'object' && this.files.constructor === Array;
        if (isArray) {
            this.FormData = new FormData();
            var files = this.files || [];
            files.forEach(function (file) {
                return _this.FormData.append(_this.postName, file, _this.fileName || file.name);
            });
            this.FormDataChange.emit(this.FormData);
        }
        else {
            delete this.FormData;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ngfFormData.prototype, "files", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ngfFormData.prototype, "postName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ngfFormData.prototype, "fileName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", FormData)
    ], ngfFormData.prototype, "FormData", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngfFormData.prototype, "FormDataChange", void 0);
    ngfFormData = __decorate([
        core_1.Directive({ selector: 'ngfFormData' }),
        __metadata("design:paramtypes", [core_1.IterableDiffers])
    ], ngfFormData);
    return ngfFormData;
}());
exports.ngfFormData = ngfFormData;

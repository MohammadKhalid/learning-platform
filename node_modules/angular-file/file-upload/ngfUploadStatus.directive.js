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
var ngfUploadStatus = (function () {
    function ngfUploadStatus() {
        this.percent = 0;
        this.percentChange = new core_1.EventEmitter();
    }
    ngfUploadStatus.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.httpEvent && changes.httpEvent.currentValue) {
            var event_1 = changes.httpEvent.currentValue;
            if (event_1.loaded && event_1.total) {
                setTimeout(function () {
                    _this.percent = Math.round(100 * event_1.loaded / event_1.total);
                    _this.percentChange.emit(_this.percent);
                }, 0);
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], ngfUploadStatus.prototype, "percent", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngfUploadStatus.prototype, "percentChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Event)
    ], ngfUploadStatus.prototype, "httpEvent", void 0);
    ngfUploadStatus = __decorate([
        core_1.Directive({ selector: 'ngfUploadStatus' })
    ], ngfUploadStatus);
    return ngfUploadStatus;
}());
exports.ngfUploadStatus = ngfUploadStatus;

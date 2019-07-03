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
var fileTools_1 = require("./fileTools");
var ngfSrc = (function () {
    function ngfSrc(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngfSrc.prototype.ngOnChanges = function (_changes) {
        var _this = this;
        fileTools_1.dataUrl(this.file)
            .then(function (src) {
            return _this.ElementRef.nativeElement.src = src;
        });
    };
    __decorate([
        core_1.Input('ngfSrc'),
        __metadata("design:type", Object)
    ], ngfSrc.prototype, "file", void 0);
    ngfSrc = __decorate([
        core_1.Directive({ selector: '[ngfSrc]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], ngfSrc);
    return ngfSrc;
}());
exports.ngfSrc = ngfSrc;

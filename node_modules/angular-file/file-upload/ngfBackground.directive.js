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
var ngfBackground = (function () {
    function ngfBackground(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngfBackground.prototype.ngOnChanges = function (_changes) {
        var _this = this;
        fileTools_1.dataUrl(this.file)
            .then(function (src) {
            var urlString = 'url(\'' + (src || '') + '\')';
            _this.ElementRef.nativeElement.style.backgroundImage = urlString;
        });
    };
    __decorate([
        core_1.Input('ngfBackground'),
        __metadata("design:type", Object)
    ], ngfBackground.prototype, "file", void 0);
    ngfBackground = __decorate([
        core_1.Directive({ selector: '[ngfBackground]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], ngfBackground);
    return ngfBackground;
}());
exports.ngfBackground = ngfBackground;

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
var doc_event_help_functions_1 = require("./doc-event-help.functions");
var fileTools_1 = require("./fileTools");
var ngf = (function () {
    function ngf(element) {
        this.element = element;
        this.filters = [];
        this.lastFileCount = 0;
        this.ngfFixOrientation = true;
        this.fileDropDisabled = false;
        this.selectable = false;
        this.directiveInit = new core_1.EventEmitter();
        this.lastInvalids = [];
        this.lastInvalidsChange = new core_1.EventEmitter();
        this.lastBaseUrlChange = new core_1.EventEmitter();
        this.fileChange = new core_1.EventEmitter();
        this.files = [];
        this.filesChange = new core_1.EventEmitter();
        this.initFilters();
    }
    ngf.prototype.initFilters = function () {
        this.filters.push({ name: 'accept', fn: this._acceptFilter });
        this.filters.push({ name: 'fileSize', fn: this._fileSizeFilter });
    };
    ngf.prototype.ngOnDestroy = function () {
        delete this.fileElm;
    };
    ngf.prototype.ngOnInit = function () {
        var _this = this;
        if (this.selectable) {
            this.enableSelecting();
        }
        if (this.multiple) {
            this.paramFileElm().setAttribute('multiple', this.multiple);
        }
        setTimeout(function () {
            _this.directiveInit.emit(_this);
        }, 0);
    };
    ngf.prototype.ngOnChanges = function (changes) {
        if (changes.accept) {
            this.paramFileElm().setAttribute('accept', changes.accept.currentValue || '*');
        }
    };
    ngf.prototype.paramFileElm = function () {
        if (this.fileElm)
            return this.fileElm;
        var isFile = doc_event_help_functions_1.isFileInput(this.element.nativeElement);
        if (isFile)
            return this.fileElm = this.element.nativeElement;
        var label = doc_event_help_functions_1.createInvisibleFileInputWrap();
        this.fileElm = label.getElementsByTagName('input')[0];
        this.fileElm.addEventListener('change', this.changeFn.bind(this));
        this.element.nativeElement.appendChild(label);
        return this.fileElm;
    };
    ngf.prototype.enableSelecting = function () {
        var _this = this;
        var elm = this.element.nativeElement;
        if (doc_event_help_functions_1.isFileInput(elm)) {
            var bindedHandler_1 = function (_ev) { return _this.beforeSelect(); };
            elm.addEventListener('click', bindedHandler_1);
            elm.addEventListener('touchstart', bindedHandler_1);
            return;
        }
        var bindedHandler = function (ev) { return _this.clickHandler(ev); };
        elm.addEventListener('click', bindedHandler);
        elm.addEventListener('touchstart', bindedHandler);
        elm.addEventListener('touchend', bindedHandler);
    };
    ngf.prototype.getValidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            if (this.isFileValid(files[x])) {
                rtn.push(files[x]);
            }
        }
        return rtn;
    };
    ngf.prototype.getInvalidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            var failReason = this.getFileFilterFailName(files[x]);
            if (failReason) {
                rtn.push({
                    file: files[x],
                    type: failReason
                });
            }
        }
        return rtn;
    };
    ngf.prototype.handleFiles = function (files) {
        var _this = this;
        var valids = this.getValidFiles(files);
        if (files.length != valids.length) {
            this.lastInvalids = this.getInvalidFiles(files);
        }
        else {
            delete this.lastInvalids;
        }
        this.lastInvalidsChange.emit(this.lastInvalids);
        if (valids.length) {
            if (this.ngfFixOrientation) {
                this.applyExifRotations(valids)
                    .then(function (fixedFiles) { return _this.que(fixedFiles); });
            }
            else {
                this.que(valids);
            }
        }
        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    };
    ngf.prototype.que = function (files) {
        var _this = this;
        this.files = this.files || [];
        Array.prototype.push.apply(this.files, files);
        this.filesChange.emit(this.files);
        if (files.length) {
            this.fileChange.emit(this.file = files[0]);
            if (this.lastBaseUrlChange.observers.length) {
                fileTools_1.dataUrl(files[0])
                    .then(function (url) { return _this.lastBaseUrlChange.emit(url); });
            }
        }
        this.lastFileCount = this.files.length;
    };
    ngf.prototype.changeFn = function (event) {
        var fileList = event.__files_ || (event.target && event.target.files);
        if (!fileList)
            return;
        this.stopEvent(event);
        this.handleFiles(fileList);
    };
    ngf.prototype.clickHandler = function (evt) {
        var elm = this.element.nativeElement;
        if (elm.getAttribute('disabled') || this.fileDropDisabled) {
            return false;
        }
        var r = doc_event_help_functions_1.detectSwipe(evt);
        if (r !== false)
            return r;
        var fileElm = this.paramFileElm();
        fileElm.click();
        this.beforeSelect();
        return false;
    };
    ngf.prototype.beforeSelect = function () {
        if (this.files && this.lastFileCount === this.files.length)
            return;
        this.fileElm.value = null;
    };
    ngf.prototype.isEmptyAfterSelection = function () {
        return !!this.element.nativeElement.attributes.multiple;
    };
    ngf.prototype.eventToTransfer = function (event) {
        if (event.dataTransfer)
            return event.dataTransfer;
        return event.originalEvent ? event.originalEvent.dataTransfer : null;
    };
    ngf.prototype.stopEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    ngf.prototype.transferHasFiles = function (transfer) {
        if (!transfer.types) {
            return false;
        }
        if (transfer.types.indexOf) {
            return transfer.types.indexOf('Files') !== -1;
        }
        else if (transfer.types.contains) {
            return transfer.types.contains('Files');
        }
        else {
            return false;
        }
    };
    ngf.prototype.eventToFiles = function (event) {
        var transfer = this.eventToTransfer(event);
        if (transfer) {
            if (transfer.files && transfer.files.length) {
                return transfer.files;
            }
            if (transfer.items && transfer.items.length) {
                return transfer.items;
            }
        }
        return [];
    };
    ngf.prototype.applyExifRotations = function (files) {
        var mapper = function (file, index) {
            return fileTools_1.applyExifRotation(file)
                .then(function (fixedFile) { return files.splice(index, 1, fixedFile); });
        };
        var proms = [];
        for (var x = files.length - 1; x >= 0; --x) {
            proms[x] = mapper(files[x], x);
        }
        return Promise.all(proms).then(function () { return files; });
    };
    ngf.prototype.onChange = function (event) {
        var files = this.element.nativeElement.files || this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    };
    ngf.prototype.getFileFilterFailName = function (file) {
        for (var i = 0; i < this.filters.length; i++) {
            if (!this.filters[i].fn.call(this, file)) {
                return this.filters[i].name;
            }
        }
        return undefined;
    };
    ngf.prototype.isFileValid = function (file) {
        var noFilters = !this.accept && (!this.filters || !this.filters.length);
        if (noFilters) {
            return true;
        }
        return this.getFileFilterFailName(file) ? false : true;
    };
    ngf.prototype.isFilesValid = function (files) {
        for (var x = files.length - 1; x >= 0; --x) {
            if (!this.isFileValid(files[x])) {
                return false;
            }
        }
        return true;
    };
    ngf.prototype._acceptFilter = function (item) {
        return fileTools_1.acceptType(this.accept, item.type, item.name);
    };
    ngf.prototype._fileSizeFilter = function (item) {
        return !(this.maxSize && item.size > this.maxSize);
    };
    ngf.prototype.filesToWriteableObject = function (files) {
        var jsonFiles = [];
        for (var x = 0; x < files.length; ++x) {
            jsonFiles.push({
                type: files[x].type,
                kind: files[x]["kind"]
            });
        }
        return jsonFiles;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ngf.prototype, "multiple", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ngf.prototype, "accept", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], ngf.prototype, "maxSize", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ngf.prototype, "ngfFixOrientation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ngf.prototype, "fileDropDisabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ngf.prototype, "selectable", void 0);
    __decorate([
        core_1.Output('init'),
        __metadata("design:type", core_1.EventEmitter)
    ], ngf.prototype, "directiveInit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ngf.prototype, "lastInvalids", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngf.prototype, "lastInvalidsChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ngf.prototype, "lastBaseUrl", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngf.prototype, "lastBaseUrlChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", File)
    ], ngf.prototype, "file", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngf.prototype, "fileChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ngf.prototype, "files", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ngf.prototype, "filesChange", void 0);
    __decorate([
        core_1.HostListener('change', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], ngf.prototype, "onChange", null);
    ngf = __decorate([
        core_1.Directive({
            selector: "[ngf]",
            exportAs: "ngf"
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], ngf);
    return ngf;
}());
exports.ngf = ngf;

'use strict';

/**
 * User: ikotenko
 * Date: 03.07.13
 * Time: 17:53
 */
var ListWithPaging = function (list, pageSize) {
    this.list = list;
    this.length = list.length;
    this.start = 0;
    this.pageSize = pageSize;
    this.end = this.start + this.pageSize;
    if(this.end > this.length) {
        this.end = this.length;
    }
    this.currentPage = this.list.slice(this.start, this.end);
}

ListWithPaging.prototype.isLeft = function () {
    return this.start > 0;
}

ListWithPaging.prototype.isRight = function () {
    return (this.start + this.pageSize) < this.length
}

ListWithPaging.prototype.left = function () {
    if(this.start >= this.pageSize) {
        this.start -= this.pageSize;
        this.end = this.start + this.pageSize;
        if(this.end > this.length) {
            this.end = this.length;
        }
        this.currentPage = this.list.slice(this.start, this.end);
    }
}

ListWithPaging.prototype.right = function () {
    if(this.start + this.pageSize < this.length) {
        this.start += this.pageSize;
        this.end = this.start + this.pageSize;
        if(this.end > this.length) {
            this.end = this.length;
        }
        this.currentPage = this.list.slice(this.start, this.end);
    }
}

ListWithPaging.prototype.setup = function(list) {
    this.list = list;
    this.init();
}

ListWithPaging.prototype.init = function () {
    this.length = this.list.length;
    this.start = 0;
    this.end = this.index + this.pageSize;
    if(this.end > this.length) {
        this.end = this.length;
    }
    this.currentPage = this.list.slice(this.start, this.end);
}
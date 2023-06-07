"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGHProxyOptions = exports.GetGHProxySecureOptions = void 0;
function GetGHProxySecureOptions(GHAccessToken) {
    return {
        upstream: 'https://api.github.com',
        prefix: 'ghsecure',
        httpMethods: ['GET', 'POST'],
        replyOptions: {
            rewriteRequestHeaders: (origReq, headers) => {
                return Object.assign(Object.assign({}, headers), { authorization: `Bearer ${GHAccessToken}` });
            }
        }
    };
}
exports.GetGHProxySecureOptions = GetGHProxySecureOptions;
function GetGHProxyOptions() {
    return {
        upstream: 'https://api.github.com',
        prefix: 'ghproxy',
        httpMethods: ['GET', 'POST']
    };
}
exports.GetGHProxyOptions = GetGHProxyOptions;

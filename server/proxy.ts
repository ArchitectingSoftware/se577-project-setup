import { FastifyHttpProxyOptions } from '@fastify/http-proxy'; 


export function GetGHProxyOptions(GHAccessToken: string | undefined) : FastifyHttpProxyOptions {
    return {
        upstream: 'https://api.github.com',
        prefix: 'ghsecure', 
        httpMethods: ['GET', 'POST'],
        replyOptions: {
            rewriteRequestHeaders: (origReq, headers) => {
                return {
                    ...headers,
                    authorization: `Token ${GHAccessToken}`
                }
            } 
        } 
    }
}




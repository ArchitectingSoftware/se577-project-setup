import { FastifyHttpProxyOptions } from '@fastify/http-proxy'; 


export function GetGHProxySecureOptions(GHAccessToken: string | undefined) : FastifyHttpProxyOptions {
    return {
        upstream: 'https://api.github.com',
        prefix: 'ghsecure', 
        httpMethods: ['GET', 'POST'],
        replyOptions: {
            rewriteRequestHeaders: (origReq, headers) => {
                return {
                    ...headers,
                    authorization: `Bearer ${GHAccessToken}`
                }
            } 
        } 
    }
}

export function GetGHProxyOptions() : FastifyHttpProxyOptions {
    return {
        upstream: 'https://api.github.com',
        prefix: 'ghproxy', 
        httpMethods: ['GET', 'POST']
    }
}

export function InjectAuthQueryOption(authToken: string | undefined) : FastifyHttpProxyOptions {
    return {
        upstream: 'http://localhost:9500/qotest',
        prefix: 'qo', 
        httpMethods: ['GET'],    
        replyOptions: {
            queryString(search, reqUrl) {
                //first, lets setup the authtoken query string value
                const authQs = `auth=${authToken}`

                //now lets split the URL and get only the stuff to the
                //right of the ?
                let [,qs] = reqUrl.split("?")

                //2 options, there were no parameters, or we need to add
                //our parameter to the list
                if(qs)
                    qs = `${qs}&${authQs}`  //other query parameters existed
                else
                    qs = `${authQs}`         //this is the only one     
                
                return qs
            }
        } 
    }
}




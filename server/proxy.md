## Proxy Information

One thing we will be doing is looking into best practices for architecting, and designing modern applications. 

In the previous part of the project, I had you create a simple API and wire it into your front end.  The objectives of this were to:

1. Ensure you had the ability to create a simple API, and select an API framework for your assignment. 

2. Have you gain some experience integrating a simple API into your frontend, and coping with things like asynchronous coding from a typescript front end.

```
┌────────────────┐         ┌─────────────────┐          .───────────────. 
│                │         │                 │         (                 )
│                │         │                 │         │`───────────────'│
│ SPA Front End  │         │       API       │         │    MOCK Data    │
│  (Async Call)  │━━━━━━━━▶│                 │━━━━━━━━▶│(JSON Structure) │
│                │         │                 │         │                 │
│                │         │                 │         │                 │
└────────────────┘         └─────────────────┘         └─────────────────┘
```

## Integrating with GitHub
Ideally we want our front end to integrate with the GitHub APIs.  One way to do this is as follows:

```
┌────────────────┐         ┌─────────────────┐
│                │         │                 │
│                │         │     Secure      │
│ SPA Front End  │         │     GitHub      │
│  (Async Call)  │━━━━━━━━▶│       API       │
│                │         │                 │
│                │         │                 │
└────────────────┘         └─────────────────┘
```
The problem with the above is that the GitHub API requires you to pass a security token as a header in the request:

```
┌────────────────┐                                ┌─────────────────┐
│                │                                │                 │
│                │  Header                        │     Secure      │
│ SPA Front End  │    Authorization: Token xxxx   │     GitHub      │
│  (Async Call)  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▶│       API       │
│                │                                │                 │
│                │                                │                 │
└────────────────┘                                └─────────────────┘
```
So now the problem becomes, how does one get this token, and second, how do we securely use this token.

As to getting a token, I will show you how to do this in class.  Obviously, one approach would be to do the following:

```
┌────────────────┐                                ┌─────────────────┐
│                │                                │                 │
│ SPA Front End  │  Header                        │     Secure      │
│  (Async Call)  │    Authorization: Token xxxx   │     GitHub      │
│                │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▶│       API       │
│Store Token HERE│                                │                 │
│                │                                │                 │
└────────────────┘                                └─────────────────┘
```

Thus, store the token in your code so that you can pass it to GitHub when making API calls.  The challenge with this approach is that there is no secure way to manage a credential in a SPA application that runs within the browser.

Thus, we will be taking the approach shown below:

```
┌────────────────┐                                ┌─────────────────┐
│                │                                │                 │
│                │       ┌─────────────────┐      │     Secure      │
│ SPA Front End  │       │  Reverse Proxy  │      │     GitHub      │
│  (Async Call)  │━━━━━━━┫       API       ┣━━━━━▶│       API       │
│                │       └─────────▲───────┘      │                 │
│                │                 ┃              │                 │
└────────────────┘                 ┃              └─────────────────┘
                         ┌─────────┻─────────┐                       
                         │     .env File     │                       
                         │GH TOKEN GOES HERE │                       
                         └───────────────────┘                       
```

Thus, we will be creating a reverse proxy that consumes the the GH provided security token via the OS environment that is injected into the reverse proxy API via a secure .env file.

We will be using the **dotenv** package for these purposes.  In this file we create a line:

```
GH_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxx
```

This is the access token we get from GitHub.  **ALSO DO NOT FORGET TO PUT A `.env` in your `.gitignore` file.  If GitHub notices one of its tokens checked into a repo, it will remove this file from your repo as a security precaution**

In our code we use the line of code:

```
dotenv.config();
```
To read the .env file, then we can extract the GitHub token using:

```
process.env.GH_ACCESS_TOKEN
```

See the updated `server.ts` and `proxy.ts` files for how this works.


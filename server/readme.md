# Simple Server

This is a demo server to help you all out.

After you get the code run `yarn` or `npm install` to pull all of the dependencies

**MAKE SURE YOU ARE IN THE SERVER DIRECTORY WHEN YOU DO THIS**

Then to run execute `yarn run server` or `npm run server`

You can then go to `localhost:9095` and do the following things:

1. http://localhost:9500/search?course=se577
2. http://localhost:9500/search?id=123
3. http://localhost:9500/students
4. http://localhost:9500/students/456

Now notice I created an interface for this API suite in /basic-project/src/pages/ApiInterfaces.ts

### Loading API data on PageLoad

Now go to the FirstPage.vue file.  Some things to notice:

1. I created and imported a type for the `StudentApiInterface`
2. I created a function `onMounted()` this is called a lifecycle hook and runs when the page is loaded

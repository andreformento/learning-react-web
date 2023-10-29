# React

- Open shell:
  ```shell
  docker run --rm -it \
          --entrypoint=bash \
          --user 1000:1000 \
          -p 3000:3000 \
          -v $(pwd)/:/app \
          -w /app \
          node:14
  ```

- react-tutorial: `cd react-tutorial && npm start`

- backend
  ```shell
  cd backend
  npm install json-server
  npm run api
  ```

## References
- https://reactjs.org/docs/getting-started.html
- https://reactjs.org/tutorial/tutorial.html
- https://www.taniarascia.com/getting-started-with-react
- https://bezkoder.com/react-crud-web-api/
- https://create-react-app.dev/docs/getting-started
- https://create-react-app.dev/docs/adding-a-router
- https://handsonreact.com/docs/state-management#summary
- https://reactjs.org/docs/dom-elements.html#differences-in-attributes
- https://nextjs.org/learn-pages-router/foundations/from-javascript-to-react/displaying-data-with-props

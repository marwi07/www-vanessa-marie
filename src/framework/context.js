export const createContext = async (request, options, nunjucks, cookies) => {
  return {
    request,
    url: new URL(request.url),
    response: {
      body: undefined,
      status: undefined,
      headers: new Headers(),
    },

    db: options.db,
    staticBase: options.staticBase,
    nunjucks: nunjucks,
    cookies: cookies,
  };
};

import express, { Application, NextFunction, Request, Response } from "express";
import Keycloak from "keycloak-connect";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import winston from "winston";
import expressWinston from "express-winston";
import responseTime from "response-time";

const SECRET = "5Nu@1T^oInxZQf8OvbXPBSiNe7^!IF";

interface Route {
  url: string;
  rateLimit?: any; //rateLimit.Options;
  proxy?: any; // Define a specific type for your proxy options
  creditCheck?: boolean;
  auth?: boolean;
}

export const setupRateLimit = (app: Application, routes: Route[]) => {
  routes.forEach((r) => {
    if (r.rateLimit) {
      app.use(r.url, rateLimit(r.rateLimit));
    }
  });
};

export const setupProxies = (app: Application, routes: Route[]) => {
  routes.forEach((r) => {
    app.use(r.url, createProxyMiddleware(r.proxy));
  });
};

export const setupLogging = (app: Application) => {
  app.use(morgan("combined"));

  app.use(responseTime());

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.json(),
      statusLevels: true,
      meta: false,
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      expressFormat: true,
      ignoreRoute() {
        return false;
      },
    })
  );
};

export const checkCredit = (req: Request) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Checking credit with token", req.headers["authorization"]);
    setTimeout(() => {
      reject("No sufficient credits");
    }, 500);
  });
};

export const setupCreditCheck = (app: Application, routes: Route[]) => {
  routes.forEach((r) => {
    if (r.creditCheck) {
      app.use(r.url, (req: Request, res: Response, next: NextFunction) => {
        checkCredit(req)
          .then(() => {
            next();
          })
          .catch((error) => {
            res.status(402).send({ error });
          });
      });
    }
  });
};

export const setupAuth = (app: Application, routes: Route[]) => {
  var memoryStore = new session.MemoryStore();
  var keycloak = new Keycloak({ store: memoryStore });

  app.use(
    session({
      secret: SECRET,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  app.use(keycloak.middleware());

  routes.forEach((r) => {
    if (r.auth) {
      app.use(
        r.url,
        keycloak.protect(),
        (req: Request, res: Response, next: NextFunction) => {
          next();
        }
      );
    }
  });
};

export const ROUTES = [
  {
    url: "/product",
    auth: false,
    creditCheck: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      //   max: 5,
    },
    proxy: {
      target: "http://localhost:5001/product",
      changeOrigin: true,
      pathRewrite: {
        [`^/product`]: "",
      },
    },
  },
  {
    url: "/order",
    auth: false,
    creditCheck: false,
    proxy: {
      target: "http://localhost:5001/order",
      changeOrigin: true,
      pathRewrite: {
        [`^/order`]: "",
      },
    },
  },
  {
    url: "/auth",
    auth: false,
    creditCheck: true,
    proxy: {
      target: "http://localhost:5001/auth",
      changeOrigin: true,
      pathRewrite: {
        [`^/auth`]: "",
      },
    },
  },
  {
    url: "/rabbitmq",
    auth: false,
    creditCheck: false,
    proxy: {
      target: "http://rabbitmq:15672",
      changeOrigin: true,
      pathRewrite: {
        [`^/rabbitmq`]: "",
      },
    },
  },
];

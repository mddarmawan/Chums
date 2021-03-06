FROM node:10.13.0-alpine as react-build

ENV PATH /app/node_modules/.bin:$PATH

RUN npm config set unsafe-perm true

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g


RUN mkdir /tmp/project

WORKDIR /tmp/project

RUN git clone https://github.com/LiveChurchSolutions/Chums.git .
RUN mv /tmp/project/ChumsApp /app
COPY ./envs/.env.App /app/.env


WORKDIR /app


RUN npm install --loglevel verbose
RUN npm install react-scripts@3.0.1 -g --silent


RUN npm run build

FROM nginx:1.16-alpine
COPY ./nginx/conf/default.conf /etc/nginx/conf.d/default.conf

COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
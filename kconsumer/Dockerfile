FROM node:9-alpine

# ficheros de la aplicación
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./src/* /usr/src/app/

# instalación de librerías

RUN apk --no-cache --virtual build-dependencies add \
	python \
   make \
   g++ \
   && npm install \
	&& apk del build-dependencies

EXPOSE 3002

CMD [ "npm", "start" ]

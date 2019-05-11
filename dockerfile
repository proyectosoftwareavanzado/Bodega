FROM node

WORKDIR /opt/bodega
add . /opt/bodega
RUN npm install --quiet
RUN npm install nodemon -g --quiet


EXPOSE 8083

CMD npm start
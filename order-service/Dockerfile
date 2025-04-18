# Usa una imagen base oficial de Node.js
FROM node:18

# Crea y define el directorio de trabajo en el contenedor
WORKDIR /index

# Copia el package.json y package-lock.json antes para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que corre tu app
EXPOSE 7000

# Comando por defecto para ejecutar la app
CMD ["npm", "start"]

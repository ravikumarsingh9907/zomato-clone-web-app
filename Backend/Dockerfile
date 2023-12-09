FROM node:18-alpine3.17 AS first
WORKDIR /src

ENV DATABASE_URL=mongodb+srv://ravikumarsingh9907:OTZUa5bnGSNb8UOD@cluster0.wm5gkg9.mongodb.net/?retryWrites=true&w=majority \
    PASS=OTZUa5bnGSNb8UOD \
    PORT=3333 \
    CLOUD_NAME=dupvoqioo \
    CLOUD_API_KEY=124299373281251 \
    CLOUD_API_SECRET=VcT4G_RZzXcbEKQOX_v3CP-Kdjk

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3333
CMD ["node", "index.js"]
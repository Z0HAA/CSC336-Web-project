const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync("translation.proto");
const proto = grpc.loadPackageDefinition(packageDef);

const translations = {
  hello: { es: "hola", fr: "bonjour" },
  bye: { es: "adios", fr: "au revoir" }
};

function TranslateText(call, callback) {
  const { text, targetLanguage } = call.request;
  const translated = translations[text]?.[targetLanguage] || text;
  callback(null, { translatedText: translated });
}

const server = new grpc.Server();
server.addService(proto.TranslationService.service, { TranslateText });

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind translation service:', err);
      return;
    }
    console.log(`Translation Service running on port ${port}`);
    server.start();
  }
);
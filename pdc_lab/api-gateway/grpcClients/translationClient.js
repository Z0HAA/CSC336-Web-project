const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const pkgDef = protoLoader.loadSync("../translation-service/translation.proto");
const proto = grpc.loadPackageDefinition(pkgDef);

const client = new proto.TranslationService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

exports.translateText = (text, lang, cb) => {
  client.TranslateText({ text, targetLanguage: lang }, (err, res) => {
    if (err) {
      console.error('Translation gRPC Error:', err);
      return cb(text);
    }
    if (!res || !res.translatedText) {
      console.error('Translation service returned empty response');
      return cb(text);
    }
    cb(res.translatedText);
  });
};
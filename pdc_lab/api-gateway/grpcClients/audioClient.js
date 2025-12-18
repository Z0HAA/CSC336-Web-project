const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const pkgDef = protoLoader.loadSync("../audio-service/audio.proto");
const proto = grpc.loadPackageDefinition(pkgDef);

const client = new proto.AudioService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

exports.processAudio = (audioBuffer, cb) => {
  client.ProcessAudio({ audio: audioBuffer }, (err, res) => {
    if (err) {
      console.error('Audio gRPC Error:', err);
      return cb(null);
    }
    if (!res || !res.audio) {
      console.error('Audio service returned empty response');
      return cb(audioBuffer);
    }
    cb(res.audio);
  });
};
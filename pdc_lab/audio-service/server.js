const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync("audio.proto");
const proto = grpc.loadPackageDefinition(packageDef);

function ProcessAudio(call, callback) {
  const audioData = call.request.audio;
  
  if (!audioData) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Audio data is required'
    });
  }
  
  callback(null, { audio: audioData });
}

const server = new grpc.Server();
server.addService(proto.AudioService.service, { ProcessAudio });

server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind audio service:', err);
      return;
    }
    console.log(`Audio Service running on port ${port}`);
    server.start();
  }
);
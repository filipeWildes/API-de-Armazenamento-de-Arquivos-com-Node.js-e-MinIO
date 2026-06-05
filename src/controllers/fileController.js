const minioClient = require('../config/minio');

const bucketName = process.env.BUCKET_NAME;

async function createBucket() {
  const exists = await minioClient.bucketExists(bucketName);

  if (!exists) {
    await minioClient.makeBucket(bucketName);
    console.log('Bucket criado');
  }
}

exports.uploadFile = async (req, res) => {
  try {
    await createBucket();

    const file = req.file;

    await minioClient.putObject(
      bucketName,
      file.originalname,
      file.buffer
    );

    return res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      arquivo: file.originalname
    });

  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};

exports.listFiles = async (req, res) => {
  try {

    const arquivos = [];

    const stream = minioClient.listObjects(
      bucketName,
      '',
      true
    );

    stream.on('data', (obj) => {
      arquivos.push(obj.name);
    });

    stream.on('end', () => {
      res.json(arquivos);
    });

    stream.on('error', (err) => {
      res.status(500).json(err);
    });

  } catch (error) {
    res.status(500).json({
      erro: error.message
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {

    const { name } = req.params;

    await minioClient.removeObject(
      bucketName,
      name
    );

    return res.status(200).json({
      message: 'Arquivo removido com sucesso',
      arquivo: name
    });

  } catch (error) {

    return res.status(500).json({
      erro: error.message
    });

  }
};
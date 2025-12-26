const Minio = require('minio');

// Initialisation du client MinIO avec les variables d'environnement
// Ces variables sont définies dans ton docker-compose.yml
const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin'
});

const BUCKET_NAME = 'covers';

const initBucket = async () => {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        console.log(`Bucket MinIO '${BUCKET_NAME}' créé.`);

        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                }
            ]
        };
        await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
};

const uploadFile = async (file) => {
    await initBucket();
    const objectName = `${Date.now()}-${file.originalname}`;
    await minioClient.putObject(BUCKET_NAME, objectName, file.buffer, file.size);
    return `http://localhost:9000/${BUCKET_NAME}/${objectName}`;
};

module.exports = { uploadFile };
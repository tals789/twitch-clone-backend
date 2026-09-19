import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly client: S3Client
  private readonly bucket: string

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      endpoint: config.getOrThrow<string>('S3_ENDPOINT'),
      region: config.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: config.getOrThrow<string>('S3_SECRET_KEY'),
      }
    })

    this.bucket = config.getOrThrow<string>('S3_BUCKET_NAME')
  }

  async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      Body: buffer,
      ContentType: mimetype
    }

    try {
      await this.client.send(new PutObjectCommand(command))
    } catch(err) {
      throw err
    }
  }

  async remove(key: string) {
    const command: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
    }

    try {
      await this.client.send(new DeleteObjectCommand(command))
    } catch(err) {
      throw err
    }
  }
}
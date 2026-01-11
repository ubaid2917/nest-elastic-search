import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';


@Injectable()
export class ElasticService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: "https://db964e693970494393ce31494d8569cf.us-central1.gcp.cloud.es.io:443",
      auth: {
        apiKey: "aEtkSHJwc0JuN3FvUndRdDh2b0c6a1NnRXFQWjQzRUI2TThvZ2tXdXNSQQ==",
      },
    });
    console.log('Elasticsearch client initialized in constructor');
  }

  getClient(): Client {
    return this.client;
  }

  async createIndex(index: string) {
    console.log(`Checking if index "${index}" exists...`);
    const exists = await this.client.indices.exists({ index });
    if (!exists) {
      await this.client.indices.create({ index });
      console.log(`Index "${index}" created`);
    }
  }

  async indexDocument(index: string, id: string, body: any) {
    console.log(`Indexing document id="${id}" into index "${index}"`);
    await this.client.index({
      index,
      id,
      document: body,
    });
  }

  async search(index: string, query: any) {
    return this.client.search({
      index,
      body: query,
    });
  }
}


import {
  LOGIN,
  CREATE_CONTENT_TYPE,
  CREATE_CONTENT_ENTRY,
  UPDATE_CONTENT_ENTRY,
  UPLOAD_MEDIA,
  GET_CONTENT_TYPE_BY_SLUG,
} from "../queries";
import { getAuthenticatedClient } from "../apollo-client";

const ORGANIZATION_ID = process.env.CMS_ORGANIZATION_ID;

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

interface ContentTypeField {
  slug: string;
  name: string;
  type: "TEXT" | "RICH_TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "SELECT" | "MEDIA" | "REFERENCE" | "JSON";
  required?: boolean;
}

interface ContentType {
  id: string;
  slug: string;
  name: string;
  fields: ContentTypeField[];
}

interface ContentEntry {
  id: string;
  slug: string;
  data: Record<string, unknown>;
}

interface MediaUploadResult {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
}

// GraphQL mutation response types
interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string };
  } | null;
}

interface ContentTypeResponse {
  contentTypeBySlug: ContentType | null;
}

interface CreateContentTypeResponse {
  createContentType: ContentType | null;
}

interface CreateContentEntryResponse {
  createContentEntry: ContentEntry | null;
}

interface UpdateContentEntryResponse {
  updateContentEntry: ContentEntry | null;
}

interface UploadMediaResponse {
  uploadMedia: MediaUploadResult | null;
}

export class CMSClient {
  private client: ReturnType<typeof getAuthenticatedClient>;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.client = getAuthenticatedClient(token);
  }

  static async login(email: string, password: string): Promise<CMSClient> {
    const tempClient = getAuthenticatedClient("");

    const { data } = await tempClient.mutate<LoginResponse>({
      mutation: LOGIN,
      variables: {
        input: { email, password },
      },
    });

    if (!data?.login?.accessToken) {
      throw new Error("Login failed");
    }

    return new CMSClient(data.login.accessToken);
  }

  async getContentTypeBySlug(slug: string): Promise<ContentType | null> {
    const { data } = await this.client.query<ContentTypeResponse>({
      query: GET_CONTENT_TYPE_BY_SLUG,
      variables: {
        slug,
        organizationId: ORGANIZATION_ID,
      },
    });

    return data?.contentTypeBySlug || null;
  }

  async createContentType(
    name: string,
    slug: string,
    fields: ContentTypeField[]
  ): Promise<ContentType> {
    const { data } = await this.client.mutate<CreateContentTypeResponse>({
      mutation: CREATE_CONTENT_TYPE,
      variables: {
        input: {
          name,
          slug,
          organizationId: ORGANIZATION_ID,
          fields,
        },
      },
    });

    if (!data?.createContentType) {
      throw new Error(`Failed to create content type: ${slug}`);
    }

    return data.createContentType;
  }

  async createContentEntry(
    contentTypeId: string,
    slug: string,
    entryData: Record<string, unknown>
  ): Promise<ContentEntry> {
    const { data: result } = await this.client.mutate<CreateContentEntryResponse>({
      mutation: CREATE_CONTENT_ENTRY,
      variables: {
        input: {
          contentTypeId,
          organizationId: ORGANIZATION_ID,
          slug,
          data: entryData,
        },
      },
    });

    if (!result?.createContentEntry) {
      throw new Error(`Failed to create content entry: ${slug}`);
    }

    return result.createContentEntry;
  }

  async updateContentEntry(
    id: string,
    entryData: Record<string, unknown>
  ): Promise<ContentEntry> {
    const { data: result } = await this.client.mutate<UpdateContentEntryResponse>({
      mutation: UPDATE_CONTENT_ENTRY,
      variables: {
        id,
        input: { data: entryData },
      },
    });

    if (!result?.updateContentEntry) {
      throw new Error(`Failed to update content entry: ${id}`);
    }

    return result.updateContentEntry;
  }

  async uploadMedia(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<MediaUploadResult> {
    // Convert buffer to base64 for upload
    const base64 = file.toString("base64");

    const { data } = await this.client.mutate<UploadMediaResponse>({
      mutation: UPLOAD_MEDIA,
      variables: {
        input: {
          organizationId: ORGANIZATION_ID,
          filename,
          mimeType,
          data: base64,
        },
      },
    });

    if (!data?.uploadMedia) {
      throw new Error(`Failed to upload media: ${filename}`);
    }

    return data.uploadMedia;
  }
}

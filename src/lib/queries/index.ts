import { gql } from "@apollo/client";

// ============================================
// QUERIES
// ============================================

export const GET_CONTENT_ENTRY_BY_SLUG = gql`
  query GetContentEntryBySlug($slug: String!, $contentTypeId: ID!, $organizationId: ID!) {
    contentEntryBySlug(slug: $slug, contentTypeId: $contentTypeId, organizationId: $organizationId) {
      id
      slug
      data
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONTENT_ENTRIES = gql`
  query GetContentEntries($contentTypeId: ID!, $organizationId: ID!) {
    contentEntries(contentTypeId: $contentTypeId, organizationId: $organizationId) {
      id
      slug
      data
    }
  }
`;

export const GET_CONTENT_TYPE_BY_SLUG = gql`
  query GetContentTypeBySlug($slug: String!, $organizationId: ID!) {
    contentTypeBySlug(slug: $slug, organizationId: $organizationId) {
      id
      slug
      name
      fields {
        slug
        name
        type
        required
      }
    }
  }
`;

export const GET_CONTENT_TYPES = gql`
  query GetContentTypes($organizationId: ID!) {
    contentTypes(organizationId: $organizationId) {
      id
      slug
      name
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_CONTENT_TYPE = gql`
  mutation CreateContentType($input: CreateContentTypeInput!) {
    createContentType(input: $input) {
      id
      slug
      name
      fields {
        slug
        name
        type
        required
      }
    }
  }
`;

export const CREATE_CONTENT_ENTRY = gql`
  mutation CreateContentEntry($input: CreateContentEntryInput!) {
    createContentEntry(input: $input) {
      id
      slug
      data
    }
  }
`;

export const UPDATE_CONTENT_ENTRY = gql`
  mutation UpdateContentEntry($id: ID!, $input: UpdateContentEntryInput!) {
    updateContentEntry(id: $id, input: $input) {
      id
      slug
      data
      updatedAt
    }
  }
`;

export const UPLOAD_MEDIA = gql`
  mutation UploadMedia($input: UploadMediaInput!) {
    uploadMedia(input: $input) {
      id
      url
      filename
      mimeType
    }
  }
`;

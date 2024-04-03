"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tag: Tag!
  }

  type Tag {
    id: ID!
    name: String!
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]!
    getPostsByTag(tagId: ID!): [Post!]!
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): Post
    updatePost(id: ID!, newInfo: PostCreate!): Post
    createTag(name: String!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostsByTag: (_parent, args, { app }) => {
      const { tagId } = args;
      return app.db.posts.filter((post) => post.tag.id === tagId);
    }
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content, tagId} = newPost;

      const tag = app.db.tags.find((tag) => tag.id === tagId)
      const post = {
        id: randomUUID(),
        title,
        content,
        tag
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, args, { app }) => {
      const { id } = args;
      const postIndex = app.db.posts.findIndex((post) => post.id === id)
      if (postIndex === -1){
        return
      }
      const deletedValue = app.db.posts.splice(postIndex, 1).pop()
      return deletedValue;
    },
    updatePost: (_parent, args, { app }) => {
      const { id } = args;
      const { title, content } = args.newInfo;

      const postIndex = app.db.posts.findIndex((post) => post.id === id)
      if (postIndex === -1){
        return
      }
      app.db.posts[postIndex].title = title;
      app.db.posts[postIndex].content = content;

      return app.db.posts[postIndex]
    },
    createTag: (_parent, args, { app }) => {
      const { name } = args;
      const id = randomUUID();
      const newTag = {
        id, 
        name
      };
      app.db.tags.push(newTag);
      return newTag;
    }
  },
};

export const loaders = {};

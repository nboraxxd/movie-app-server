# nmovies - A simple movie recommendation website

A simple movie recommendation website built using Express, MongoDB, Swagger, JWT, Mailgun and The Movie Database API.

<img alt="nmovies" src="https://github.com/user-attachments/assets/38178afe-cbc9-44a7-a1c8-72e0cac5ecf1" width="100%" />

## 📋 Table of Contents

1. 🤖 [Introduction](#-introduction)
2. 🚀 [Demo](#-demo)
3. ⚙️ [Tech Stack](#%EF%B8%8F-tech-stack)
4. 🔋 [Features](#-features)
5. 🤸 [Quick Start](#-quick-start)

## 🤖 Introduction

The website allows users to search for movies and TV shows, get recommendations, create and read reviews. Users can also create an account, log in, and save their favorite movies and TV shows.

Backend was inspired by the <a href="https://youtu.be/j-Sn1b4OlLA" target="_blank"><i>MoonFlix - Fullstack Responsive Movie Website 2022 tutorial</i></a>, created by Tuat Tran Anh.

The frontend is built using React, TypeScript, shadcn/ui, TanStack Query, zustand, Zod and deployed on Vercel. You can find the repository <a href="https://github.com/nboraxxd/nmovies-client" target="_blank">here</a>.

## 🚀 Demo

Check out the API documentation <a href="https://nmovieserver-5428d07b6e36.herokuapp.com/api" target="_blank">here</a>.

Check out the website <a href="https://nmovies-xoxo.vercel.app" target="_blank">here</a>.

## ⚙️ Tech Stack

- Express
- MongoDB
- Swagger
- JWT
- Mailgun
- Zod
- Cloudinary
- The Movie Database API

## 🔋 Features

- User authentication: Register, send verification email, login, forgot password, reset password, refresh token.

- User profile: Upload avatar, update user information, change password, delete account.

- Movies: Get movies, search movies, get movie details, get recommended movies.

- TV Shows: Get TV shows, search TV shows, get TV show details, get recommended TV shows.

- Reviews: Get reviews for a movie or TV show with pagination, create a review, get user reviews with pagination, delete a review.

- Favorites: Add a movie or TV show to favorites, get user favorites, remove a movie or TV show from favorites.

- Error handling: Handle errors with custom error messages.

- Security: Protect routes with JWT, CORS, sanitize user input, prevent NoSQL injection, and more.

## 🤸 Quick Start

Follow these steps to set up the project locally on your machine.

**Clone the repository**

```bash
git clone https://github.com/nboraxxd/nmovies-server
cd nmovies-server
```

**Installations**

Install the dependencies using npm:

```bash
npm install
```

**Environment Variables**

Change the name of the `.env.example` file to `.env` and fill in the required environment variables.

**Runnning the project**

```bash
npm run dev
```

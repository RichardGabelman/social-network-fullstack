<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/RichardGabelman/social-network-fullstack">
    <img src="frontend/public/profile-icon-@.svg" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">DevThreads</h3>

  <p align="center">
    A Threads-inspired social app built with a React + Vite frontend and an Express/PostgreSQL backend. Users authenticate via GitHub and can post, reply, like, and follow others.
    <br />
    <br />
    <a href="https://devthreads.richardgabelman.com">View Live</a>
    &middot;
    <a href="https://github.com/RichardGabelman/social-network-fullstack/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![DevThreads Screen Shot][product-screenshot]](images/screenshot.png)

<p>
  Social platforms like Threads are something most developers use daily but rarely think about
  building. The mechanics underneath (auth, social graphs, threaded replies, etc...) are deceptively
  simple on the surface and worth understanding from the inside out.
</p>

<p>
  <b>DevThreads</b> is a full-stack microblogging app where users authenticate with GitHub,
  which pulls in their handle and avatar automatically. From there, they can write posts, reply
  to others, like content, and follow users.
</p>

<p>
  The backend is an Express API backed by PostgreSQL, with Prisma as the ORM. Authentication is
  handled via Passport.js using the GitHub OAuth strategy, with sessions managed through JWTs.
  The frontend is built with React and Vite, communicating with the API over REST.
</p>

<p>
  The frontend is deployed on Vercel and the backend runs on a self-managed Hetzner VPS, giving
  full control over the server environment end to end.
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)
- ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=for-the-badge)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=fff&style=for-the-badge)
- ![Passport](https://img.shields.io/badge/Passport-34E27A?logo=passport&logoColor=000&style=for-the-badge)
- ![JSON Web Tokens](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=for-the-badge)
- ![GitHub ](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff&style=for-the-badge) OAUTH
- Frontend hosted on ![Vercel Badge](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff&style=for-the-badge)
- Backend hosted on a ![Hetzner Badge](https://img.shields.io/badge/Hetzner-D50C2D?logo=hetzner&logoColor=fff&style=for-the-badge) vps

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database (local or hosted)
- A GitHub OAuth App

### Installation

1. Clone the repo

```sh
   git clone https://github.com/RichardGabelman/social-network-fullstack.git
```

2. Navigate to the backend directory and install dependencies
```sh
   cd backend
   npm install
```

3. Create a `.env` file and fill in your values
```sh
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   JWT_SECRET="your_jwt_secret"
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   GITHUB_CALLBACK_URL="backend_base_url(default is http://localhost:3000)/api/auth/github/callback"
```

4. Run Prisma migrations
```sh
   npx prisma migrate dev
```

5. Start the backend server
```sh
   npm run dev
```

6. Navigate to the frontend directory and install dependencies
```sh
   cd frontend
   npm install
```

7. Create a `.env` file and point it at your backend
```sh
   VITE_API_URL="backend_base_url(default is http://localhost:3000)"
```

8. Start the frontend dev server
```sh
   npm run dev
```

The frontend will by default be running at `http://localhost:5173`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Once both servers are running, open [http://localhost:5173](http://localhost:5173) in your browser.

Sign in with your GitHub account to get started. From there you can:

- Create text posts
- Reply to and like posts
- Follow other users
- Edit your display name and bio from your profile

<br />

![DevThreads Post Reply Screenshot](images/usage1.png)
![DevThreads New Post Modal Screenshot](images/usage2.png)
![DevThreads User Index Screenshot](images/usage3.png)
![DevThreads Edit Profile Screenshot](images/usage4.png)

Try the live app at [devthreads.richardgabelman.com](https://devthreads.richardgabelman.com).


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->

## License

Distributed under the MIT. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Richard Gabelman - [@RichardGabelman](https://twitter.com/RichardGabelman) - hello@richardgabelman.com

Project Link: [https://github.com/RichardGabelman/social-network-fullstack](https://github.com/RichardGabelman/social-network-fullstack)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [The Odin Project](https://www.theodinproject.com/)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) - for the README template

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/RichardGabelman/ca-tenant-law-rag.svg?style=for-the-badge
[contributors-url]: https://github.com/RichardGabelman/ca-tenant-law-rag/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/RichardGabelman/ca-tenant-law-rag.svg?style=for-the-badge
[forks-url]: https://github.com/RichardGabelman/ca-tenant-law-rag/network/members
[stars-shield]: https://img.shields.io/github/stars/RichardGabelman/ca-tenant-law-rag.svg?style=for-the-badge
[stars-url]: https://github.com/RichardGabelman/ca-tenant-law-rag/stargazers
[issues-shield]: https://img.shields.io/github/issues/RichardGabelman/ca-tenant-law-rag.svg?style=for-the-badge
[issues-url]: https://github.com/RichardGabelman/ca-tenant-law-rag/issues
[license-shield]: https://img.shields.io/github/license/RichardGabelman/ca-tenant-law-rag.svg?style=for-the-badge
[license-url]: https://github.com/RichardGabelman/ca-tenant-law-rag/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/richard-gabelman
[product-screenshot]: images/page_screenshot.png

<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

# CheckMyMoT.com

CheckMyMoT.com is a Next.js 14 web platform built with TypeScript, designed to provide users with an easy way to check the MOT status of their vehicles. This project leverages modern web technologies and best practices to deliver a seamless user experience.

## Features

- User authentication with NextAuth.js
- Vehicle MOT status checking
- User dashboard for personalized information
- Responsive design with Tailwind CSS
- API integration for real-time data

## Getting Started

To get started with CheckMyMoT.com, follow the instructions below:

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Docker (for containerized development)
- PostgreSQL (or your preferred database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/checkmymot.com.git
   cd checkmymot.com
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Set up the environment variables:

   Copy the example environment file and update the values as needed:

   ```bash
   cp .env.example .env
   ```

4. Set up the database:

   Run the Prisma migrations to set up your database schema:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database with initial data (optional):

   ```bash
   npx ts-node scripts/seed.ts
   ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

or

```bash
yarn dev
```

Visit `http://localhost:3000` in your browser to see the application in action.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

or

```bash
yarn build
```

### Running in Docker

To run the application in a Docker container, use the following command:

```bash
docker-compose up --build
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Next.js for the framework
- TypeScript for type safety
- Prisma for database management
- Tailwind CSS for styling

For more information, visit our [documentation](https://checkmymot.com/docs).
# Meliyah Afro-Shop

## Project Overview

Meliyah Afro-Shop is a web application designed to provide a seamless shopping experience for customers looking for Afro-Haircare products. The project is built using Next.js and Tailwind CSS, and it integrates with various APIs to offer a comprehensive set of features.

## Installation

To set up the development environment for Meliyah Afro-Shop, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/MrCodeBS/Meliyah-afro.git
   cd Meliyah-afro
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file in the root directory of the project.
   - Copy the contents of `.env.example` into the `.env` file.
   - Replace the placeholder values with your actual configuration.

## Usage

To run the development server, use the following command:
```bash
npm run dev
```

To build the project for production, use the following command:
```bash
npm run build
```

To start the production server, use the following command:
```bash
npm start
```

## Environment Variables

The following environment variables are required for the project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
- `ADMIN_EMAIL`: The admin email address.
- `RESEND_API_KEY`: The API key for the Resend service.
- `RESEND_FROM_EMAIL`: The email address to use for sending emails.
- `NEXT_PUBLIC_ADMIN_URL`: The URL for the admin interface.

## Scripts

The following npm scripts are available:

- `dev`: Runs the development server.
- `build`: Builds the project for production.
- `start`: Starts the production server.
- `lint`: Runs the linter to check for code quality issues.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

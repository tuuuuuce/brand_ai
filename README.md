# Brand Creator

## Project Description
Brand Creator is a web application that allows users to generate a complete brand strategy and a logo for their business idea. By simply providing a brief project description, users can receive a comprehensive brand strategy and an automatically generated logo, making it an ideal tool for entrepreneurs, startups, and branding enthusiasts.

## Features
- **Brand Strategy Generator:** Provides an 8-step brand strategy, including Brand Purpose, Target Audience, Market Research, Brand Positioning, Brand Identity, Brand Story, Brand Touchpoints, and Marketing Communication.
- **Logo Generator:** Creates a logo based on the brand strategy, offering visual branding assets.
- **Regenerate Options:** Allows users to regenerate brand strategies and logos to explore different branding ideas.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript (with [marked.js](https://github.com/markedjs/marked) for markdown parsing)
- **Backend:** Node.js, Express.js
- **API:** OpenAI API for generating brand strategy and logo designs
- **Styling:** Custom CSS with a modern and dark-themed user interface

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tuuuuuce/brand_ai.git
   cd brand-creator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to use the application.

## Usage

1. **Enter a Project Description:** Enter a brief description of your project or brand idea.
2. **Create Brand:** Click "Create Brand" to generate a detailed brand strategy.
3. **View and Regenerate:** View your brand strategy, and if desired, regenerate it or the logo for additional options.

## Project Structure

```plaintext
├── public
│   ├── index.html          # Main HTML file with form and structure
│   ├── styles.css          # Custom CSS for styling
├── app.js                  # Server-side application logic (Express.js)
├── .env                    # Environment variables (API key)
└── README.md               # Project documentation
```

## API Endpoints

- **POST /create-brand:** Accepts a description and generates a brand strategy.
- **POST /generate-logo:** Generates a logo based on the provided brand strategy.

## Dependencies

- **express**: Web framework for Node.js
- **dotenv**: Loads environment variables from `.env` file
- **openai**: Node.js client for accessing the OpenAI API

## License

This project is licensed under the [MIT License](LICENSE).

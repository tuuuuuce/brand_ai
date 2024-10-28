import express from 'express'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.use(express.json())
app.use(express.static('public'))

// Endpoint to handle brand creation requests
app.post('/create-brand', async (req, res) => {
  const { description } = req.body

  if (!description) {
    return res.status(400).json({ error: 'Description is required' })
  }

  const brandCreationPrompt = `
    You are an AI assistant that helps users create a complete brand from scratch using the following detailed structure. The user will provide a brief description of their project or idea, and based on this, you will generate a full brand strategy. If the user provides specific details or steps, you must incorporate them into the process. The user will not answer additional questions; you are responsible for answering everything using the given structure. Here's the 8-step brand creation process you must follow:
    Step 1: Brand Purpose and Vision
    - Brand Values: Define the core principles and beliefs that will guide the brand’s actions and communication. Identify what the brand stands for and what values it embodies.
    - Brand Purpose: Clearly explain why the brand exists and the value it brings to its customers. What problem does it solve or what need does it fulfill? Make sure to articulate the higher purpose beyond just profit.
    - Mission Statement: Craft a concise mission statement outlining the brand’s goals and purpose.
    - Vision Statement: Define the long-term goals of the brand. Where do you want the brand to be in the future?
    Step 2: Target Audience
    - Identify Target Audience: Define the demographic and psychographic characteristics of the ideal audience (e.g., age, gender, location, income, education, interests, lifestyle, values).
    - Customer Personas: Create detailed personas representing different segments of the brand’s target audience, highlighting their behaviors, needs, and pain points.
    - Reasons to Consider the Brand: List reasons why these target personas would engage with or choose this brand over others.
    Step 3: Market Research and Competitor Analysis
    - Industry Research: Provide a brief analysis of the industry, identifying major trends and key competitors.
    - Competitor Analysis: Analyze the strengths, weaknesses, opportunities, and threats (SWOT) of similar brands. Highlight gaps in the market and areas where the user’s brand can differentiate itself.
    - Unique Selling Proposition (USP): Define what sets the brand apart from competitors, focusing on unique aspects and advantages.
    Step 4: Brand Positioning
    - Brand Positioning: Determine how the brand should be perceived in the market (e.g., luxury, affordable, eco-friendly).
    - Positioning Statement: Create a clear and concise statement summarizing the brand’s identity, purpose, and differentiation from competitors.
    Step 5: Brand Identity
    - Brand Name: Propose a brand name that reflects the purpose, values, and vision of the brand. Make sure the name is unique, memorable, and scalable for future growth.
    - Logo Design: Generate ideas for a logo that visually represents the brand. Consider simplicity, distinctiveness, and scalability across different platforms.
    - Tagline: Create a short, memorable tagline that encapsulates the brand’s essence.
    - Color Palette: Suggest a color palette that evokes the desired emotional response from the target audience. Include explanations for why each color was chosen based on psychological impact.
    - Typography: Recommend fonts that align with the brand’s tone and purpose, ensuring readability and consistency across platforms.
    - Brand Personality: Describe the brand’s personality as if it were a person (e.g., fun, professional, approachable). Outline traits and characteristics that define the brand’s identity.
    - Voice and Tone: Define how the brand communicates with its audience. Decide whether the tone should be formal, casual, friendly, authoritative, etc., and explain why.
    - Imagery & Visual Style: Suggest a consistent visual style, including imagery, graphics, and icons that align with the brand identity.
    Step 6: Brand Story
    - Brand Story: Craft a compelling narrative for the brand, explaining its origin, purpose, and vision. Emphasize emotional connections, highlighting why the brand was created and how it aims to impact its audience.
    Step 7: Brand Touchpoints
    - Website and Digital Presence: Suggest how the website should reflect the brand identity, from design and tone to user experience. Ensure consistency across digital platforms.
    - Social Media Strategy: Propose a strategy for social media, outlining which platforms to use and how to engage the audience through consistent branding and messaging.
    - Product Packaging and Design: If relevant, suggest how product packaging should align with the brand identity and customer expectations.
    - Customer Service: Define the approach to customer service, ensuring all interactions align with the brand’s values and identity.
    Step 8: Marketing and Brand Communication
    - Brand Communication: Suggest ways to communicate the brand’s purpose and story, both internally and externally.
    - Content Marketing Strategy: Propose types of content (e.g., blogs, videos, social media posts) that can help build relationships with the target audience and establish the brand’s voice.
    - Advertising: Suggest advertising strategies that align with the brand’s target audience, including social media, search engines, or traditional channels. Tailor messages to resonate with the brand’s identity.
    - Influencer and Partnership Marketing: Identify potential influencers or partner brands that align with the brand’s values and target audience, providing opportunities for collaboration.
    Incorporate the user's input (if any) into the process and generate a cohesive and fully fleshed-out brand using this structure.
    Description: ${description}
  `

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: brandCreationPrompt }],
      max_tokens: 2000,
    })

    const brandStrategy = response.choices[0].message.content
    res.json({ brandStrategy })
  } catch (error) {
    console.error('Error generating brand strategy:', error)
    res.status(500).json({ error: 'Failed to generate brand strategy' })
  }
})

// Endpoint to handle logo generation
app.post('/generate-logo', async (req, res) => {
  const { brandStrategy } = req.body

  try {
    // First, generate a logo prompt using GPT
    const logoPromptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional logo designer. Based on the brand strategy provided, create a detailed prompt for generating a logo. 
          Focus on these aspects:
          - Main visual elements
          - Style (minimal, elaborate, modern, classic, etc.)
          - Colors
          - Mood and feeling
          - Key brand values to represent
          
          Format your response as a concise but detailed prompt for an AI image generator.`,
        },
        {
          role: 'user',
          content: `Create a logo generation prompt based on this brand strategy: ${brandStrategy}`,
        },
      ],
      max_tokens: 500,
    })

    const logoPrompt = logoPromptResponse.choices[0].message.content
    console.log('Generated Logo Prompt:', logoPrompt)

    // Then, use the generated prompt to create the logo image
    const image = await openai.images.generate({
      prompt: `Create a professional business logo: ${logoPrompt}. Make it minimal, scalable, and suitable for business use.`,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
      quality: 'standard',
    })

    const imageUrl = image.data[0].url
    res.json({ imageUrl })
  } catch (error) {
    console.error('Error in logo generation process:', error)
    res.status(500).json({ error: 'Failed to generate logo' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

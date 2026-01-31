import type { Article } from "./shopify";

// Define schema types
type RecipeSchema = {
  "@type": "Recipe";
  name: string;
  image: string;
  description: string;
  recipeCategory: string;
  recipeCuisine: string;
  prepTime: string;
  totalTime: string;
  recipeYield: string;
  recipeIngredient: string[];
  recipeInstructions: Array<{
    "@type": "HowToStep";
    text: string;
  }>;
};

type BlogSchema = {
  "@context": "https://schema.org/";
  "@graph": Array<RecipeSchema | any>; // Can add more types as needed
};

// Schema configurations for different articles
export const articleSchemas: Record<string, (article: Article) => BlogSchema | null> = {
  // Matcha Smoothie Recipes
  "matcha-smoothie-recipes": (article) => ({
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@type": "Recipe",
        "name": "Creamy Avocado Matcha Smoothie",
        "image": article.image?.url || "",
        "description": "A velvety green smoothie with Umi Matcha and avocado, perfect for focus and sustained energy.",
        "recipeCategory": "Smoothie",
        "recipeCuisine": "International",
        "prepTime": "PT5M",
        "totalTime": "PT5M",
        "recipeYield": "1 serving",
        "recipeIngredient": [
          "2 tsp Umi Matcha powder",
          "1/2 ripe avocado",
          "1 cup oat milk",
          "1 tsp honey"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Add all ingredients to a blender."
          },
          {
            "@type": "HowToStep",
            "text": "Blend on high until velvety and smooth."
          }
        ]
      },
      {
        "@type": "Recipe",
        "name": "Strawberry Cloud Matcha Smoothie",
        "image": article.image?.url || "",
        "description": "An aesthetic layered matcha smoothie with strawberries and yogurt for glowing skin.",
        "recipeCategory": "Smoothie",
        "recipeCuisine": "Fusion",
        "prepTime": "PT7M",
        "totalTime": "PT7M",
        "recipeYield": "1 serving",
        "recipeIngredient": [
          "2 tsp Umi Matcha powder",
          "1 cup frozen strawberries",
          "1 cup almond milk",
          "1/4 cup Greek yogurt"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Blend strawberries, yogurt, and half the milk. Pour into a glass."
          },
          {
            "@type": "HowToStep",
            "text": "Whisk matcha with the rest of the milk and slowly layer it on top."
          }
        ]
      },
      {
        "@type": "Recipe",
        "name": "High-Protein Raspberry Matcha Smoothie",
        "image": article.image?.url || "",
        "description": "Post-workout matcha smoothie with raspberries and plant protein for recovery.",
        "recipeCategory": "Smoothie",
        "recipeCuisine": "International",
        "prepTime": "PT5M",
        "totalTime": "PT5M",
        "recipeYield": "1 serving",
        "recipeIngredient": [
          "2 tsp Umi Matcha powder",
          "1/2 cup frozen raspberries",
          "1 scoop vanilla plant protein",
          "1 cup almond milk"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Add all ingredients to a blender."
          },
          {
            "@type": "HowToStep",
            "text": "Blend until smooth and creamy."
          }
        ]
      },
      {
        "@type": "Recipe",
        "name": "Blue Spirulina Matcha Ocean Smoothie",
        "image": article.image?.url || "",
        "description": "Superfood mermaid smoothie with matcha and blue spirulina for detox.",
        "recipeCategory": "Smoothie",
        "recipeCuisine": "Fusion",
        "prepTime": "PT7M",
        "totalTime": "PT7M",
        "recipeYield": "1 serving",
        "recipeIngredient": [
          "2 tsp Umi Matcha powder",
          "1 frozen banana",
          "1 cup coconut water",
          "1/2 tsp blue spirulina"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Blend banana and spirulina first to create blue base."
          },
          {
            "@type": "HowToStep",
            "text": "Stir in whisked matcha last for green swirls."
          }
        ]
      },
      {
        "@type": "Recipe",
        "name": "Tropical Pineapple Matcha Smoothie",
        "image": article.image?.url || "",
        "description": "Refreshing matcha smoothie with pineapple and coconut milk for hydration.",
        "recipeCategory": "Smoothie",
        "recipeCuisine": "Tropical",
        "prepTime": "PT5M",
        "totalTime": "PT5M",
        "recipeYield": "1 serving",
        "recipeIngredient": [
          "2 tsp Umi Matcha powder",
          "1/4 cup pineapple chunks",
          "1 cup coconut milk",
          "Ice cubes",
          "Pinch of sea salt"
        ],
        "recipeInstructions": [
          {
            "@type": "HowToStep",
            "text": "Add all ingredients to a blender."
          },
          {
            "@type": "HowToStep",
            "text": "Blend with ice until smooth and refreshing."
          }
        ]
      }
    ]
  }),

  // Add more article schemas here as needed
  // Example for future articles:
  // "matcha-latte-guide": (article) => ({ ... }),
  // "matcha-dessert-recipes": (article) => ({ ... }),
};

// Helper function to get schema for an article
export function getArticleSchema(articleHandle: string, article: Article): BlogSchema | null {
  const schemaGenerator = articleSchemas[articleHandle];
  return schemaGenerator ? schemaGenerator(article) : null;
}

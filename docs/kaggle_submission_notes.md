# CinemaForge: Kaggle Submission Notes

This document provides a summary of the advanced features, technical details, and sample data for the CinemaForge project, intended for Kaggle judges and developers.

---

### (A) Judge-Facing Summary: 6 Hooks

*   **Global Cinematic Reach**: Go beyond Hollywood with a curated library of 50 diverse, global genres, from K-Drama and Wuxia to Spaghetti Westerns and Cyberpunk Noir.
*   **Pro-Level Presets**: Each genre comes with unique, production-grade presets for fonts, color palettes, and layouts, ensuring every poster looks professionally designed.
*   **Ultimate Creative Control**: An "Epic Cosplay" mode for 10 genres uses advanced prompting to generate hyperrealistic, production-level costumes and makeup while preserving the user's identity.
*   **Guaranteed Reproducibility**: Judges can verify creativity and consistency using provided deterministic seeds and a metadata viewer, ensuring every amazing result can be recreated.
*   **Polished Neo-Brutalist UI**: A stunning, high-contrast UI with obsidian black and banana-yellow accents, featuring playful micro-animations that make the creative process a joy to use.
*   **Scalable Prompt Architecture**: The dynamic prompt library is built for expansion, allowing new genres, styles, and user-generated templates to be added without changing core code.

---

### (B) API Payload Examples (for Gemini 2.5 Flash Image)

#### 1. Single-Variant Generation (Short)

This is a standard call using a genre's `short` template variant.

```json
{
  "model": "gemini-2.5-flash-image-preview",
  "contents": {
    "parts": [
      {
        "inlineData": {
          "data": "BASE64_IMAGE_DATA",
          "mimeType": "image/jpeg"
        }
      },
      {
        "text": "Create a high-octane Action Thriller poster from {{image_url}}. Dramatic, high-contrast lighting. Bold title: Title: 'Sector 7', Tagline: 'The clock is ticking.'. Preserve face. Use neo-brutalist style, banana-yellow accents, film grain. Seed=101."
      }
    ]
  },
  "config": {
    "responseModalities": ["IMAGE", "TEXT"]
  }
}
```

#### 2. Style-Mix Call (Hypothetical API - Blending Prompts)

This example assumes a future API or a pre-processing step that can blend two prompts. The logic here combines the core instructions of a "Cyberpunk Noir" prompt with the aesthetic instructions of a "Vaporwave" prompt.

```json
{
  "model": "gemini-2.5-flash-image-preview",
  "contents": {
    "parts": [
      { "inlineData": { "data": "BASE64_IMAGE_DATA", "mimeType": "image/jpeg" } },
      {
        "text": "Task: Transform {{image_url}} into a cinematic movie poster blending two styles. Primary Style (70% influence): Cyberpunk Noir. Infuse a high-tech, low-life future drenched in neon and rain, with dramatic shadows. Secondary Style (30% influence): Vaporwave. Apply a surreal, nostalgic color palette of pastel pinks and cyans, and add subtle glitch art effects. Overall aesthetic: neo-brutalist with a banana-yellow primary accent, cinematic rim light, and high-contrast grade. Subject: Preserve the subject's identity. Text: Title: 'Chrome Dreams', Tagline: 'The future is a glitch.'. Output: poster image and a text block (Title/Tagline). Seed=1999."
      }
    ]
  },
  "config": {
    "responseModalities": ["IMAGE", "TEXT"]
  }
}
```

#### 3. Epic Cosplay Call

This call uses the specific `epic_cosplay` template variant, which contains highly detailed instructions for costume generation while ensuring identity preservation.

```json
{
  "model": "gemini-2.5-flash-image-preview",
  "contents": {
    "parts": [
      { "inlineData": { "data": "BASE64_IMAGE_DATA", "mimeType": "image/jpeg" } },
      {
        "text": "Task: Transform {{image_url}} into a cinematic Epic Fantasy movie poster, with an Epic Cosplay transformation. Style: Hyperrealistic, production-level cosplay. Design and render a full set of ornate fantasy armor with gleaming steel and aged leather textures. Add a magical glowing sword. The setting is a breathtaking fantasy landscape. Overall aesthetic: neo-brutalist with banana-yellow accents, dramatic rim light, film grain. Subject: The final character's face MUST perfectly match the subject's face from the source image. Text: Title: 'The Ember Blade', Tagline: 'Forge your destiny.'. Output: poster and a text block (Title/Tagline). Seed=1111."
      }
    ]
  },
  "config": {
    "responseModalities": ["IMAGE", "TEXT"]
  }
}
```

**Note on Caching and Rate Limits**: For optimal performance and to manage API costs, it is recommended to cache generated posters based on a hash of the `prompt_id` + `seed` + `image_hash`. This prevents re-rendering identical requests. For a live demo, limit requests to a reasonable number per user session (e.g., `max_requests_per_render = 10`) to avoid abuse.

---

### (C) Meta Sample (`meta.json`)

This is an example of the metadata that should be saved with each generation to ensure full reproducibility for judging.

```json
{
  "prompt_used": "scifi-cyberpunk-001",
  "prompt_variant": "epic_cosplay",
  "seed": 808,
  "prompt_hash": "a4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5",
  "request_id": "gen-xyz-123456789",
  "synthid_flag": "none",
  "generation_timestamp": "2024-09-15T18:30:00Z"
}
```

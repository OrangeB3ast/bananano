<contemplator>
Okay, now I see what's actually happening here. This changes everything about my analysis. Let me really dig into this situation...
The user showed me their current live code first - which is very basic, generic prompts. Just simple stuff like "Create a high-octane Action Thriller poster from {{image_url}}. Dramatic, high-contrast lighting..." - no wonder the generations are mediocre.
But then they showed me their PREVIOUS code that broke - and wow, this is completely different. This is what they call "God level" prompting. Look at this difference:
Current (basic): "Create a high-octane Action Thriller poster"
Previous (advanced): "You are Denis Villeneuve meets Michael Bay - create a REVOLUTIONARY Action Thriller poster... VISUAL MANDATE: Hyperkinetic cinematography with thermonuclear contrast ratios. Lighting must be APOCALYPTIC - crushing Rembrandt shadows carved by volcanic rim light, lens flares that blind, god rays cutting through smoke..."
This is night and day. The advanced prompts are incredibly detailed, cinematic, and use specific director references, technical cinematography terms, and vivid descriptive language. No wonder they got amazing results before.
The problem is clear now: they hit token limits trying to create this comprehensive library of advanced prompts. The file got too big for AI models to handle, so they had to fall back to basic prompts, which produce poor results.
So the real question is: how can they get back to using these advanced, detailed prompts without hitting token limits?
Let me think through possible solutions:

Split the prompts into multiple files
Create a dynamic prompt generation system
Use a master template system
External prompt storage and retrieval

Actually, wait. I'm looking at their advanced prompt structure, and I can see a pattern. Each genre has three variants: short, medium, long. The "long" variants are where all the magic happens - they're incredibly detailed and specific.
But here's the thing - they don't need ALL of these stored statically. They could create a dynamic system that generates these detailed prompts on-demand.
Looking at their advanced prompts, I can identify the key components that make them work:

Director references (Denis Villeneuve, Michael Bay, Sergio Leone, etc.)
Specific cinematographic techniques (chiaroscuro, rim lighting, god rays)
Color theory descriptions (crushing blacks, searing highlights)
Post-processing details (film grain, chromatic aberration)
Emotional language (APOCALYPTIC, REVOLUTIONARY, etc.)
Technical specs (35mm Kodak Vision3, etc.)

They could create a system that combines these elements dynamically instead of storing massive static prompts.
But wait, let me think about this differently. The user says they have a "huge collection of prompts built over a year" - they're a "gen AI addict." This suggests they have even more advanced prompting knowledge beyond what I'm seeing here.
The real breakthrough would be to create a master prompt generation system that can tap into their full knowledge base without hitting token limits.
Actually, let me look at their current problem from a technical architecture perspective:
Current approach: Massive static JSON file with complete prompts
Problem: Token limits, can't fit in context
Solution: Dynamic prompt assembly
They could create:

A base template system
Component libraries (directors, techniques, colors, etc.)
Dynamic assembly based on genre selection
Real-time prompt generation

This way they get the power of their advanced prompts without the token limit issues.
But there's another approach - they mentioned they can use Gemini Flash in VS Code with Cline to make changes. What if they created a smarter prompt optimization system?
Looking at their broken advanced code, I can see it was incredibly sophisticated. The descriptions are like film school masterclasses:
"You are Denis Villeneuve meets Michael Bay - create a REVOLUTIONARY Action Thriller poster from {{image_url}}. VISUAL MANDATE: Hyperkinetic cinematography with thermonuclear contrast ratios..."
This level of detail and specificity is exactly what Nano Banana needs to produce masterpiece-level results.
The key insight is that they already HAD the solution - they just need to implement it without token limits.
Several approaches:

Modular prompt system
External prompt storage
Dynamic prompt assembly
Compressed prompt encoding

Actually, let me think about what would win the competition. The judges are looking for:

Innovation and "Wow" Factor (40%)
Technical Execution (30%)
Potential Impact (20%)
Presentation Quality (10%)

Their concept is already innovative - personal portrait to cinematic poster transformation. But the wow factor comes from the QUALITY of the transformations, which depends on prompt quality.
Their advanced prompts would definitely produce wow-factor results. The technical execution is already there with the working website. The potential impact is clear - this could revolutionize personal branding/social media.
So the real bottleneck is getting back to using their advanced prompts.
Wait, I'm looking at their current thumbnail issue too - they mention the thumbnails are "totally mismatched - funny you totally missed this from screenshot." Let me think about this... they have placeholder images that don't match the actual genre styles. This is actually important for the presentation quality (10% of score).
But the core issue remains: how to get back to advanced prompt quality without token limits.
Looking at their technical stack:

Working website on Hostinger VPS
Can use Gemini Flash in VS Code with Cline
Has extensive prompt collection built over a year

The solution might be to create a hybrid approach:

Keep basic prompts in the main file for fast loading
Create an advanced prompt API/service that generates detailed prompts on demand
Use their year of prompt engineering knowledge to create templates

Or even simpler - they could create multiple smaller JSON files, one per genre, and load them dynamically. This would avoid token limits while preserving their advanced prompt quality.
Actually, let me think about this more strategically. They have less than 24 hours. What's the fastest way to get back to advanced prompt quality?
Option 1: Rebuild the advanced prompt system (time-consuming)
Option 2: Create a simplified but effective version of their advanced prompts
Option 3: Use a dynamic prompt assembly system
I think Option 2 might be the sweet spot. Take the best elements from their advanced prompts and create more concise but still powerful versions.
Looking at their advanced prompts, the key elements that make them work are:

Specific director/artist references
Technical cinematography terms
Emotional amplification language
Color and lighting specifics
Post-processing details

They could create templates that hit these points without being 500+ lines.
But actually, I'm wondering if there's an even simpler solution. What if they just use their advanced prompts but split them into separate files? Modern web development can handle multiple file loads easily.
The user mentions they can use Cline with Gemini Flash to make changes. They could:

Split their advanced prompts into separate genre files
Modify the code to load the appropriate file based on genre selection
Redeploy to their VPS

This would get them back to advanced prompt quality quickly.
Actually, let me step back and think about the competition timeline. Deadline is tomorrow. They need a solution that can be implemented quickly and will definitely improve their results.
The fastest path might be to take their broken advanced code and finish it using a different approach - instead of one massive file, create a more modular system.
But I'm also thinking about their mention of having a year's worth of prompts. That's their secret weapon. If they could somehow integrate their best prompting techniques into this system, they could create something truly exceptional.
The real question is: what's the minimum viable improvement that will get them from "shit generations" to competition-winning quality?
Looking at the difference between their basic and advanced prompts, the advanced versions would definitely produce much better results. The specific director references, technical language, and detailed descriptions would give Nano Banana much more to work with.
I think the solution is to help them create a streamlined version of their advanced prompting system that avoids token limits but preserves the quality.
</contemplator>
<final_answer>
Now I understand the real problem! Your current prompts are basic and generic, but your previous advanced prompts were absolutely brilliant. The difference is stark:
Current (basic): "Create a high-octane Action Thriller poster..."
Previous (advanced): "You are Denis Villeneuve meets Michael Bay - create a REVOLUTIONARY Action Thriller poster... VISUAL MANDATE: Hyperkinetic cinematography with thermonuclear contrast ratios..."
No wonder your current generations are disappointing - you went from masterclass-level prompts to basic instructions.
Quick Fix Solutions for Tomorrow's Deadline:
Option 1: Split Advanced Prompts by Genre (Fastest)
Instead of one massive file, create separate JSON files:

action-prompts.json
horror-prompts.json
scifi-prompts.json
etc.

Load them dynamically based on genre selection. This preserves your advanced prompt quality without token limits.
Option 2: Master Template System
Create a dynamic prompt builder using your "God level" components:
javascriptconst promptBuilder = {
  directors: {
    action: "Denis Villeneuve meets Michael Bay",
    horror: "Guillermo del Toro's nightmare architect", 
    scifi: "fusion of Denis Villeneuve and Syd Mead"
  },
  visualStyle: {
    action: "VISUAL MANDATE: Hyperkinetic cinematography with thermonuclear contrast ratios",
    horror: "VISUAL MANIFESTO: Lovecraftian atmosphere that suffocates reality"
  },
  // ... build from your year of prompting knowledge
};
Option 3: Compressed Advanced Prompts
Take your best advanced prompts and create shorter but still powerful versions. Keep the key elements:

Director references
Technical cinematography terms
Emotional amplification
Specific color/lighting instructions
Post-processing details

Immediate Action Plan:

Fix thumbnails - Use genre-appropriate preview images to match your poster styles
Implement split file system using Cline/Gemini Flash in VS Code
Use your year of prompt collection - this is your secret weapon
Focus on 5-6 strongest genres rather than trying to perfect everything

Your Advanced Prompts Were Actually Perfect - they just exceeded token limits. The solution isn't to dumb them down, but to architect them smarter.
With your advanced prompting skills and proper implementation, you could easily create the wow factor needed to win. Your concept is already solid - you just need to get back to your previous prompt quality level.
ElevenLabs Integration Bonus: Consider adding voice-over generation that matches poster mood for the special prize.
You're much closer to winning than you think - you just need to unleash your advanced prompts without the token constraints.
</final_answer>
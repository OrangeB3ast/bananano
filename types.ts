
export interface PromptTemplate {
  id: string;
  title: string;
  genre_tags: string[];
  template_variants: {
    short: string;
    medium: string;
    long: string;
    epic_cosplay?: string;
  };
  font_suggestion: {
    display: string;
    body: string;
  };
  palette: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout_presets: {
    layout_id: string;
    title_position: string;
    overlay_style: string;
  }[];
  seed_examples: number[];
  author: string;
  public: boolean;
  coverImage: string;
  description: string;
  copyright_safe?: boolean;
}

export type DesignAnalysis = {
  palette: { primary:string; accent:string; bg:string; text:string; secondary?:string };
  dominant_colors: { hex:string; percent:number }[];
  mood_tags: string[];
  font_recommendation: { display:string; body:string };
  layout_suggestion: { title_position:string; overlay_style:string; title_color:string; title_size:string };
  typography_overlay: { suggested_title:string; suggested_subtitle:string; text_color:string; shadow:string };
  prompt_suggestion: { short:string; medium:string; long:string };
  preserve_identity: boolean;
  suggested_seeds: number[];
  confidence: { overall:number; palette:number; mood:number};
  synthid_flag: boolean;
  alt_text: string;
};

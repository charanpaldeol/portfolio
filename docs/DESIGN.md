# Design System Strategy: The Editorial Expert

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Architectural Editorial."** 

This is not a standard SaaS interface; it is an authoritative, high-end digital publication. We move beyond "template" culture by using Manrope’s geometric precision for headlines and Inter’s functional clarity for body copy. The system breaks the rigid grid through intentional asymmetry—using generous whitespace (negative space) as a structural element rather than a void. We create a "signature" feel by treating every page as a custom layout where typography defines the rhythm and tonal layering defines the depth.

---

## 2. Colors & Surface Philosophy

### The Palette
We use a sophisticated, high-contrast base with vibrant, purposeful accents.
- **Primary (`#00694c`):** Trust and expertise. Used for high-priority actions.
- **Secondary (`#584fbc`):** Modernity and vision. Used for specialized feature highlights.
- **Tertiary (`#755700`):** Authority and warmth. Used for high-level emphasis.
- **Neutrals (`#fcf9f5` to `#1b1c1a`):** Warm whites and deep charcoals form the editorial canvas.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. Traditional "boxes" make a site feel like a template. 
- **Boundaries:** Must be defined solely through background color shifts. For example, a `surface-container-low` section sitting against a `surface` background provides all the structural definition required.
- **The Signature Texture:** Main CTAs or Hero sections should use subtle linear gradients (e.g., transitioning from `primary` to `primary_container`) to provide a "hand-crafted" visual soul.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper.
- **Nesting:** Place a `surface_container_lowest` card on a `surface_container_low` section. This creates a natural, soft lift.
- **Glassmorphism:** For floating navigation or modal overlays, use semi-transparent surface colors with a `backdrop-blur` (12px–20px). This allows the layout to feel integrated and airy rather than heavy.

---

### 3. Typography
The typographic system is the voice of the brand: expert, trustworthy, and modern.

| Scale | Font | Weight | Character |
| :--- | :--- | :--- | :--- |
| **Display** | Manrope | ExtraBold | Large, commanding headlines that set the editorial tone. |
| **Headline**| Manrope | Bold | Strategic section markers with tight tracking. |
| **Title** | Inter | Medium | Clear, functional headers for cards and sidebars. |
| **Body** | Inter | Regular | Optimized for long-form readability with generous line-height. |
| **Label** | Inter | SemiBold | All-caps or small-caps for metadata and chips. |

**Editorial Logic:** Always pair a large `display-lg` Manrope headline with a `body-lg` Inter paragraph. The contrast between the geometric character of Manrope and the neutral utility of Inter creates the "Expert" personality.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering** rather than traditional structural lines. 
- **Low Depth:** `surface` → `surface_container_low`.
- **High Depth:** `surface` → `surface_container_highest`.

### Ambient Shadows
When a floating effect is required (e.g., a primary dropdown), shadows must be **extra-diffused**:
- **Blur:** 40px to 60px.
- **Opacity:** 4%–8%.
- **Color:** Use a tinted version of `on_surface` (deep charcoal) to mimic natural light. Never use pure black `#000000`.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use a **Ghost Border**:
- **Token:** `outline_variant`.
- **Opacity:** 10%–20% maximum. 
- **Rule:** If the border is clearly visible at a glance, it is too heavy.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `md` (0.75rem) roundedness, and `on_primary` text.
- **Secondary:** Surface-tinted background with a `ghost border`.
- **Tertiary:** No background. Text-link style with an animated underline on hover.

### Cards & Lists
- **The Rule:** No divider lines. Use `surface_container` shifts to group content.
- **Asymmetry:** Encourage "offset" card layouts where images or icons bleed slightly outside the container boundaries to break the "boxed-in" feel.

### Input Fields
- **Style:** Underline only or extremely subtle `surface_variant` backgrounds. 
- **Focus State:** Transition the `outline` to `primary` with a 2px stroke, but keep the rest of the field "borderless."

### Chips & Badges
- Use `primary_fixed` or `secondary_fixed` backgrounds with high-contrast text. 
- Roundedness should be `full` to provide a soft contrast to the structured typography.

### Specialized Component: The "Expert Highlight"
A large-scale pull-quote component using `display-sm` typography and a `tertiary` vertical accent bar (4px wide), used to anchor long-form content.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins. If the left margin is 80px, try a right margin of 120px for editorial flair.
- **Do** lean into `surface_container_lowest` for cards to make them feel like they are floating on "warm" paper.
- **Do** use high-scale typography (e.g., `display-lg`) for short, punchy value propositions.

### Don't
- **Don't** use 1px solid borders to separate sections.
- **Don't** use standard "drop shadows" (small blur, high opacity). It cheapens the "Modern" brand.
- **Don't** crowd the content. If a section feels "full," double the padding. This brand breathes through its whitespace.
- **Don't** use pure black text. Use `on_surface` (#1b1c1a) for a softer, more premium reading experience.
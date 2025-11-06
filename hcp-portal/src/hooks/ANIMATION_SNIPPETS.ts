/**
 * Animation System - Quick Reference Code Snippets
 * 
 * Copy-paste ready code snippets for common animation patterns
 */

// ============================================
// HERO SECTION SNIPPETS
// ============================================

/*
// Hero Badge
import { useHeroBadge } from '@/hooks/useComponentAnimations'

const badgeProps = useHeroBadge(0.1)
<motion.div {...badgeProps}>AI-Powered Healthcare</motion.div>
*/

/*
// Hero Title
import { useHeroTitle } from '@/hooks/useComponentAnimations'

const titleProps = useHeroTitle(0.2)
<motion.h1 {...titleProps}>Revolutionary Telehealth Platform</motion.h1>
*/

/*
// Hero Description
import { useHeroDescription } from '@/hooks/useComponentAnimations'

const descProps = useHeroDescription(0.3)
<motion.p {...descProps}>Experience the future of healthcare...</motion.p>
*/

/*
// Hero CTA Buttons
import { useHeroCTA } from '@/hooks/useComponentAnimations'

const ctaProps = useHeroCTA(0.5)
<motion.div {...ctaProps}>
  <Button>Get Started</Button>
</motion.div>
*/

/*
// Complete Hero Section
import { useHeroAnimations } from '@/hooks/useComponentAnimations'

function HeroSection() {
  const anim = useHeroAnimations()
  return (
    <section>
      <motion.div {...anim.badge}>Badge</motion.div>
      <motion.h1 {...anim.title}>Title</motion.h1>
      <motion.p {...anim.description}>Description</motion.p>
      <motion.div {...anim.cta}>
        <Button>CTA</Button>
      </motion.div>
      <motion.div {...anim.stats}>Stats</motion.div>
    </section>
  )
}
*/

// ============================================
// DEMO SECTION SNIPPETS
// ============================================

/*
// Demo Header
import { useDemoHeader } from '@/hooks/useComponentAnimations'

const { ref, ...headerProps } = useDemoHeader(0.1)
<motion.div ref={ref} {...headerProps}>
  <h2>Watch Our Demo</h2>
</motion.div>
*/

/*
// Demo Video Container
import { useDemoVideo } from '@/hooks/useComponentAnimations'

const { ref, ...videoProps } = useDemoVideo(0.1)
<motion.div ref={ref} {...videoProps}>
  <video />
</motion.div>
*/

/*
// Demo Play Button
import { useDemoPlayButton } from '@/hooks/useComponentAnimations'

const playProps = useDemoPlayButton()
<motion.button {...playProps}>Play</motion.button>
*/

/*
// Demo Features (Staggered)
import { useDemoFeatures } from '@/hooks/useComponentAnimations'

const { ref, container, item } = useDemoFeatures(0.1, 4)
<motion.div ref={ref} {...container}>
  {features.map((f, i) => (
    <motion.div key={i} {...item}>{f.label}</motion.div>
  ))}
</motion.div>
*/

/*
// Complete Demo Section
import { useDemoAnimations } from '@/hooks/useComponentAnimations'

function DemoSection() {
  const anim = useDemoAnimations()
  return (
    <section>
      <motion.div {...anim.header}>
        <h2>Demo</h2>
      </motion.div>
      <motion.div {...anim.video}>
        <video />
        <motion.button {...anim.playButton}>Play</motion.button>
      </motion.div>
      <motion.div {...anim.features.container}>
        {features.map((f, i) => (
          <motion.div key={i} {...anim.features.item}>{f}</motion.div>
        ))}
      </motion.div>
    </section>
  )
}
*/

// ============================================
// CARD COMPONENT SNIPPETS
// ============================================

/*
// Card Entrance (Scroll-triggered)
import { useCardEntrance } from '@/hooks/useComponentAnimations'

const { ref, ...cardProps } = useCardEntrance(0, 0.1)
<motion.div ref={ref} {...cardProps}>
  <CardContent />
</motion.div>
*/

/*
// Card Hover
import { useCardHover } from '@/hooks/useComponentAnimations'

const hoverProps = useCardHover()
<motion.div {...hoverProps}>
  <CardContent />
</motion.div>
*/

/*
// Card Focus
import { useCardFocus } from '@/hooks/useComponentAnimations'

const focusProps = useCardFocus()
<motion.button {...focusProps}>
  <CardContent />
</motion.button>
*/

/*
// Card Icon Animation
import { useCardIcon } from '@/hooks/useComponentAnimations'

const iconProps = useCardIcon()
<motion.div {...iconProps}>
  <Icon />
</motion.div>
*/

/*
// Complete Card with All Animations
import { useCardAnimations } from '@/hooks/useComponentAnimations'

function FeatureCard({ feature, index }) {
  const anim = useCardAnimations(index, 0.1)
  return (
    <motion.div {...anim}>
      <motion.div {...anim.icon}>
        <Icon />
      </motion.div>
      <h3>{feature.title}</h3>
    </motion.div>
  )
}
*/

/*
// Feature Grid with Stagger
import { useFeatureGridCards } from '@/hooks/useComponentAnimations'

function FeatureGrid({ features }) {
  const { ref, container, item } = useFeatureGridCards(0.1, 0.1)
  return (
    <motion.div ref={ref} {...container}>
      {features.map((f, i) => (
        <motion.div key={i} {...item}>
          <FeatureCard feature={f} index={i} />
        </motion.div>
      ))}
    </motion.div>
  )
}
*/

// ============================================
// CTA SECTION SNIPPETS
// ============================================

/*
// CTA Container
import { useCTAContainer } from '@/hooks/useComponentAnimations'

const { ref, ...containerProps } = useCTAContainer(0.1)
<motion.section ref={ref} {...containerProps}>
  <CTAContent />
</motion.section>
*/

/*
// CTA Badge
import { useCTABadge } from '@/hooks/useComponentAnimations'

const badgeProps = useCTABadge(0.1)
<motion.div {...badgeProps}>Start Today</motion.div>
*/

/*
// CTA Heading
import { useCTAHeading } from '@/hooks/useComponentAnimations'

const headingProps = useCTAHeading(0.2)
<motion.h2 {...headingProps}>Ready to Get Started?</motion.h2>
*/

/*
// CTA Description
import { useCTADescription } from '@/hooks/useComponentAnimations'

const descProps = useCTADescription(0.3)
<motion.p {...descProps}>Join thousands of users...</motion.p>
*/

/*
// CTA Buttons
import { useCTAButtons } from '@/hooks/useComponentAnimations'

const buttonProps = useCTAButtons(0.5)
<motion.div {...buttonProps}>
  <Button>Get Started</Button>
</motion.div>
*/

/*
// Complete CTA Section
import { useCTAAnimations } from '@/hooks/useComponentAnimations'

function CTASection() {
  const anim = useCTAAnimations()
  return (
    <motion.section {...anim.container}>
      <motion.div {...anim.badge}>Badge</motion.div>
      <motion.h2 {...anim.heading}>Heading</motion.h2>
      <motion.p {...anim.description}>Description</motion.p>
      <motion.div {...anim.buttons}>
        <Button>CTA</Button>
      </motion.div>
      <motion.div {...anim.trustIndicators}>
        <TrustBadges />
      </motion.div>
    </motion.section>
  )
}
*/

// ============================================
// BASE ANIMATION SNIPPETS
// ============================================

/*
// Fade In
import { useFadeIn } from '@/hooks/useAnimations'

const fadeProps = useFadeIn(0.2)
<motion.div {...fadeProps}>Content</motion.div>
*/

/*
// Slide Up
import { useSlideUp } from '@/hooks/useAnimations'

const slideProps = useSlideUp(0.1, 24)
<motion.div {...slideProps}>Content</motion.div>
*/

/*
// Scale In
import { useScaleIn } from '@/hooks/useAnimations'

const scaleProps = useScaleIn(0.2, 0.95)
<motion.div {...scaleProps}>Content</motion.div>
*/

/*
// Combined Entrance
import { useEntrance } from '@/hooks/useAnimations'

const entranceProps = useEntrance(0.1, { y: 24, scale: 0.95 })
<motion.div {...entranceProps}>Content</motion.div>
*/

/*
// Hover Lift
import { useHoverLift } from '@/hooks/useAnimations'

const liftProps = useHoverLift(1.05)
<motion.div {...liftProps}>Hover me</motion.div>
*/

/*
// Hover Scale
import { useHoverScale } from '@/hooks/useAnimations'

const scaleProps = useHoverScale(1.1)
<motion.div {...scaleProps}>Hover me</motion.div>
*/

/*
// Scroll Fade In
import { useScrollFadeIn } from '@/hooks/useAnimations'

const { ref, ...fadeProps } = useScrollFadeIn(0.1, true, 24)
<motion.div ref={ref} {...fadeProps}>Content</motion.div>
*/

/*
// Scroll Fade Scale
import { useScrollFadeScale } from '@/hooks/useAnimations'

const { ref, ...scaleProps } = useScrollFadeScale(0.1, true)
<motion.div ref={ref} {...scaleProps}>Content</motion.div>
*/

/*
// Scroll Stagger
import { useScrollStagger } from '@/hooks/useAnimations'

const { ref, container, item } = useScrollStagger(0.1, true, 0.1)
<motion.div ref={ref} {...container}>
  {items.map((item, i) => (
    <motion.div key={i} {...item}>Item</motion.div>
  ))}
</motion.div>
*/

/*
// Entrance + Hover Combined
import { useEntranceHover } from '@/hooks/useAnimations'

const combinedProps = useEntranceHover(0.2, 1.05)
<motion.div {...combinedProps}>Content</motion.div>
*/

/*
// Scroll + Hover Combined
import { useScrollHover } from '@/hooks/useAnimations'

const { ref, ...scrollHoverProps } = useScrollHover(0.1, true, 1.05)
<motion.div ref={ref} {...scrollHoverProps}>Content</motion.div>
*/

// ============================================
// QUICK IMPORTS
// ============================================

/*
// Import all from one place
import {
  // Tokens
  timing,
  easing,
  distance,
  scale,
  
  // Base hooks
  useFadeIn,
  useSlideUp,
  useHoverLift,
  useScrollFadeIn,
  
  // Component hooks
  useHeroAnimations,
  useDemoAnimations,
  useCardAnimations,
  useCTAAnimations,
} from '@/hooks/animations'
*/


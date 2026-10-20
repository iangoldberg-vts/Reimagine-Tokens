import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Filter,
  Home,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  UserCheck,
  Users,
} from 'lucide-react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { FilterBar } from '@/components/filter-bar'

const SECTIONS = [
  { id: 'grid', label: 'Grid' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'elevation', label: 'Shapes and Elevation' },
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Type Scale' },
  { id: 'icons', label: 'Iconography' },
  { id: 'imagery', label: 'Imagery' },
  { id: 'ai', label: 'AI' },
  { id: 'filters', label: 'Filters' },
  { id: 'tokens', label: 'Tokens Applied to Components' },
]

// Exact rect coordinates lifted from the Figma frames so the schematics copy them 1:1.
const DESKTOP_SCHEMATIC = {
  frame: { width: 1280, height: 900 },
  column: { width: 70, xs: [78, 174, 270, 366, 462, 556, 654, 750, 844, 940, 1034, 1134] },
  blocks: [
    { x: 0, y: 0, width: 1280, height: 100 }, // header — full-bleed
    { x: 78, y: 132, width: 358, height: 304 }, // sidebar
    { x: 460, y: 132, width: 744, height: 304 }, // hero
    { x: 78, y: 468, width: 360, height: 304 }, // card 1
    { x: 459, y: 468, width: 360, height: 304 }, // card 2
    { x: 844, y: 468, width: 360, height: 304 }, // card 3
    { x: 0, y: 804, width: 1280, height: 100 }, // footer — full-bleed
  ],
}

const MOBILE_SCHEMATIC = {
  frame: { width: 402, height: 874 },
  column: { width: 81, xs: [16, 113, 209, 306] },
  blocks: [
    { x: 0, y: 0, width: 402, height: 100 }, // header — full-bleed
    { x: 16, y: 132, width: 178, height: 204 }, // feature left
    { x: 210, y: 132, width: 178, height: 204 }, // feature right
    { x: 16, y: 368, width: 372, height: 206 }, // hero / body
    { x: 16, y: 606, width: 81, height: 100 }, // stat 1
    { x: 112, y: 606, width: 81, height: 100 }, // stat 2
    { x: 210, y: 606, width: 81, height: 100 }, // stat 3
    { x: 308, y: 606, width: 81, height: 100 }, // stat 4
    { x: 0, y: 738, width: 402, height: 136 }, // footer — full-bleed
  ],
}

const SPACING_SCALE = [
  { px: 4, label: 'xs', example: 'Icon-to-label gap' },
  { px: 8, label: 'sm', example: 'Compact control padding' },
  { px: 16, label: 'md', example: 'Default field / card padding' },
  { px: 24, label: 'lg', example: 'Gap between grouped elements' },
  { px: 32, label: 'xl', example: 'Gap between stacked sections' },
  { px: 40, label: '2xl', example: 'Large card / panel padding' },
  { px: 48, label: '3xl', example: 'Page-level vertical rhythm' },
  { px: 56, label: '4xl', example: 'Hero / feature spacing' },
  { px: 64, label: '5xl', example: 'Page margins' },
]

type ColorToken = { name: string; cssVar: string; size: 'lg' | 'md' | 'sm'; dark?: boolean }

const PRIMARY_TOKENS: ColorToken[] = [
  { name: 'Primary', cssVar: '--primary', size: 'lg' },
  { name: 'Primary Foreground · Light', cssVar: '--primary-foreground', size: 'sm' },
  { name: 'Primary Foreground · Dark', cssVar: '--primary-foreground', size: 'sm', dark: true },
]

const SECONDARY_TOKENS: ColorToken[] = [
  { name: 'Secondary', cssVar: '--secondary', size: 'md' },
  { name: 'Chart 1', cssVar: '--chart-1', size: 'sm' },
  { name: 'Chart 2', cssVar: '--chart-2', size: 'sm' },
  { name: 'Chart 3', cssVar: '--chart-3', size: 'sm' },
  { name: 'Chart 4', cssVar: '--chart-4', size: 'sm' },
  { name: 'Chart 5', cssVar: '--chart-5', size: 'sm' },
]

const FUNCTIONAL_TOKENS: ColorToken[] = [
  { name: 'Border', cssVar: '--border', size: 'md' },
  { name: 'Muted', cssVar: '--muted', size: 'md' },
  { name: 'Accent', cssVar: '--accent', size: 'sm' },
  { name: 'Ring', cssVar: '--ring', size: 'sm' },
  { name: 'Input', cssVar: '--input', size: 'sm' },
  { name: 'Success', cssVar: '--success', size: 'sm' },
  { name: 'Warning', cssVar: '--warning', size: 'sm' },
  { name: 'Destructive', cssVar: '--destructive', size: 'sm' },
  { name: 'Declined', cssVar: '--declined', size: 'sm' },
]

const RADIUS_SCALE = [
  { label: 'sm', radius: 4 },
  { label: 'md', radius: 8 },
  { label: 'lg', radius: 14 },
  { label: 'full', radius: 999 },
]

const TYPE_SCALE = [
  { label: 'Caption', px: '12px', rem: '0.75rem', className: 'text-xs font-semibold' },
  { label: 'Small', px: '14px', rem: '0.875rem', className: 'text-sm font-semibold' },
  { label: 'Body', px: '16px', rem: '1rem', className: 'text-base font-semibold' },
  { label: 'Text', px: '18px', rem: '1.125rem', className: 'text-lg font-semibold' },
  { label: 'Subhead', px: '20px', rem: '1.25rem', className: 'text-xl font-semibold' },
  { label: 'Headline', px: '24px', rem: '1.5rem', className: 'text-2xl font-semibold' },
  { label: 'Title', px: '30px', rem: '1.875rem', className: 'text-3xl font-semibold' },
  { label: 'Display Small', px: '36px', rem: '2.25rem', className: 'text-4xl font-semibold' },
  { label: 'Display', px: '48px', rem: '3rem', className: 'text-5xl font-semibold' },
  { label: 'Display Large', px: '60px', rem: '3.75rem', className: 'text-6xl font-semibold' },
]

const FONT_WEIGHTS = [
  { label: 'normal', weight: 400, className: 'font-normal' },
  { label: 'semibold', weight: 600, className: 'font-semibold' },
  { label: 'bold', weight: 700, className: 'font-bold' },
  { label: 'black', weight: 900, className: 'font-black' },
]

const LINE_HEIGHTS = [
  { label: 'none', value: '1', className: 'leading-none' },
  { label: 'normal', value: '1.5', className: 'leading-normal' },
  { label: 'relaxed', value: '1.625', className: 'leading-relaxed' },
]

const ICONS = [
  { Icon: Home, name: 'Home' },
  { Icon: Building2, name: 'Building2' },
  { Icon: Users, name: 'Users' },
  { Icon: Settings, name: 'Settings' },
  { Icon: Bell, name: 'Bell' },
  { Icon: Mail, name: 'Mail' },
  { Icon: Search, name: 'Search' },
  { Icon: CalendarIcon, name: 'Calendar' },
  { Icon: FileText, name: 'FileText' },
  { Icon: BarChart3, name: 'BarChart3' },
  { Icon: CreditCard, name: 'CreditCard' },
  { Icon: MapPin, name: 'MapPin' },
  { Icon: Clock, name: 'Clock' },
  { Icon: CheckCircle2, name: 'CheckCircle2' },
  { Icon: AlertTriangle, name: 'AlertTriangle' },
  { Icon: Info, name: 'Info' },
  { Icon: Plus, name: 'Plus' },
  { Icon: Trash2, name: 'Trash2' },
  { Icon: Filter, name: 'Filter' },
  { Icon: Star, name: 'Star' },
]

const IMAGE_RATIOS = [
  { ratio: 1, label: '1:1', shape: 'rounded-lg', width: '100%' },
  { ratio: 4 / 3, label: '4:3', shape: 'rounded-lg', width: '100%' },
  { ratio: 1, label: 'Circle (Avatar)', shape: 'rounded-full', width: '75%' },
]

const AI_PRINCIPLES = [
  {
    Icon: Eye,
    title: 'Transparent by default',
    description: 'Make it clear when AI generated or influenced something the user sees.',
  },
  {
    Icon: Undo2,
    title: 'Reversible actions',
    description: 'Agent-driven changes should be easy to review, undo, or override.',
  },
  {
    Icon: UserCheck,
    title: 'Human in the loop',
    description: 'Surface confidence and let people confirm before anything consequential happens.',
  },
  {
    Icon: Sparkles,
    title: 'Consistent voice',
    description: 'AI-generated content reads like the rest of the product, not like a chatbot bolted on.',
  },
]

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-6 border-t border-border pt-12 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

const SWATCH_HEIGHT = { lg: 'h-32', md: 'h-20', sm: 'h-16' } as const

function ColorSwatch({
  name,
  cssVar,
  size = 'sm',
  dark = false,
}: {
  name: string
  cssVar: string
  size?: 'lg' | 'md' | 'sm'
  dark?: boolean
}) {
  return (
    <div className={`flex flex-col gap-2 ${size === 'lg' ? 'col-span-2' : ''}`}>
      <div className={dark ? 'dark' : undefined}>
        <div className={`${SWATCH_HEIGHT[size]} rounded-lg ring-1 ring-border`} style={{ background: `var(${cssVar})` }} />
      </div>
      <div className="text-xs">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-muted-foreground">{cssVar}</p>
      </div>
    </div>
  )
}

type SchematicRect = { x: number; y: number; width: number; height: number }

type Schematic = {
  frame: { width: number; height: number }
  column: { width: number; xs: number[] }
  blocks: SchematicRect[]
}

function GridOverlayMock({
  label,
  caption,
  schematic,
  maxWidth,
}: {
  label: string
  caption: string
  schematic: Schematic
  maxWidth: number
}) {
  const { frame, column, blocks } = schematic
  const pct = (value: number, total: number) => `${(value / total) * 100}%`

  return (
    <div className="flex w-full flex-col items-center gap-2" style={{ maxWidth }}>
      <div
        className="relative w-full overflow-hidden bg-card"
        style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
      >
        {blocks.map((b, i) => (
          <div
            key={i}
            className="absolute bg-border"
            style={{
              left: pct(b.x, frame.width),
              top: pct(b.y, frame.height),
              width: pct(b.width, frame.width),
              height: pct(b.height, frame.height),
            }}
          />
        ))}
        {column.xs.map((x, i) => (
          <div
            key={i}
            className="pointer-events-none absolute inset-y-0 bg-destructive/10"
            style={{ left: pct(x, frame.width), width: pct(column.width, frame.width) }}
          />
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{label}</p>
        <p>{caption}</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              VTS
            </div>
            <span className="font-heading text-sm font-semibold">Design System</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-6 py-12">
        <nav className="sticky top-12 hidden h-fit w-48 shrink-0 flex-col gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-20">
          <div>
            <h1 className="text-3xl font-semibold">Foundation</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              The core building blocks of the VTS design system,{' '}
              <strong className="font-semibold text-foreground">grid, spacing, surfaces, color, and type</strong>,
              applied consistently across every product surface.
            </p>
          </div>

          <Section id="grid" title="Grid">
            <Card>
              <CardContent className="px-4 py-6 sm:px-[76px]">
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-12 sm:gap-6">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className={`flex h-16 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary ${
                        i >= 4 ? 'hidden sm:flex' : ''
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              Resize the window. Below <code>sm</code>: 4 columns · 16px margin · 16px gutter. At{' '}
              <code>sm</code> and above: 12 columns · 76px margin · 24px gutter.
            </p>

            <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[1fr_auto]">
              <GridOverlayMock
                label="Desktop"
                caption="12 columns · 76px margin · 24px gutter"
                schematic={DESKTOP_SCHEMATIC}
                maxWidth={1280}
              />
              <GridOverlayMock
                label="Mobile"
                caption="4 columns · 16px margin · 16px gutter"
                schematic={MOBILE_SCHEMATIC}
                maxWidth={170}
              />
            </div>
          </Section>

          <Section id="spacing" title="Spacing" description="A 4px base scale used for padding, gaps, and layout rhythm.">
            <Card>
              <CardContent className="flex flex-col divide-y divide-border pt-6">
                {SPACING_SCALE.map((s) => (
                  <div key={s.px} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="w-10 shrink-0 text-xs font-medium text-foreground">{s.label}</span>
                    <span className="w-12 shrink-0 text-xs text-muted-foreground">{s.px}px</span>
                    <div className="h-2 shrink-0 rounded-full bg-primary" style={{ width: s.px }} />
                    <span className="flex-1 text-xs text-muted-foreground">{s.example}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          <Section
            id="surfaces"
            title="Surfaces"
            description="Background containers are flat. No elevation or borders unless needed for separation."
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex h-32 items-center justify-center rounded-lg bg-background text-sm text-foreground ring-1 ring-border">
                Background · Light
              </div>
              <div className="dark flex h-32 items-center justify-center rounded-lg bg-background text-sm text-foreground ring-1 ring-border">
                Background · Dark
              </div>
            </div>
          </Section>

          <Section
            id="elevation"
            title="Shapes and Elevation"
            description="Elevation follows the actual shadcn component conventions in this project."
          >
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Corner Radius</h3>
                <div className="flex flex-wrap items-end gap-6">
                  {RADIUS_SCALE.map((r) => (
                    <div key={r.label} className="flex flex-col items-center gap-2">
                      <div className="size-16 border border-border bg-muted" style={{ borderRadius: r.radius }} />
                      <div className="text-center text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">{r.label}</p>
                        <p>{r.radius}px</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Elevation</h3>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div className="flex flex-col gap-4">
                    <div className="h-16 rounded-lg bg-popover ring-1 ring-foreground/10" />
                    <div>
                      <CardTitle className="text-base">Base</CardTitle>
                      <CardDescription className="mt-1">
                        The page canvas. Separation from cards comes from a one-step value difference, never a
                        shadow.
                      </CardDescription>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Examples:</span> Card, Input, Button,
                        Dialog, Drawer
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Dialog</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Base</DialogTitle>
                          <DialogDescription>
                            The page canvas. Separation from cards comes from a one-step value difference,
                            never a shadow.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="h-16 rounded-lg bg-popover shadow-md ring-1 ring-foreground/10" />
                    <div>
                      <CardTitle className="text-base">Raised Glass</CardTitle>
                      <CardDescription className="mt-1">
                        The raised pattern used across the app. Frosted glass, not a flat token. Consistent
                        across stat tiles, building headers, and content cards.
                      </CardDescription>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Examples:</span> Popover, Dropdown Menu,
                        Select, Combobox, Hover Card
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Popover</Button>} />
                      <PopoverContent>
                        <p className="font-medium text-foreground">Raised Glass</p>
                        <p className="mt-1 text-muted-foreground">
                          The raised pattern used across the app. Frosted glass, not a flat token.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="h-16 rounded-lg bg-popover shadow-lg ring-1 ring-foreground/10" />
                    <div>
                      <CardTitle className="text-base">Floating</CardTitle>
                      <CardDescription className="mt-1">
                        Deep blur, a pronounced shadow, and a slightly brighter border.
                      </CardDescription>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Examples:</span> Sheet, Toast, Context
                        Menu, and nested submenus
                      </p>
                    </div>
                    <Sheet>
                      <SheetTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Sheet</Button>} />
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Floating</SheetTitle>
                          <SheetDescription>
                            Deep blur, a pronounced shadow, and a slightly brighter border.
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="color"
            title="Color"
            description="Brand tokens carry identity — primary leads, secondary and chart colors support it. Functional tokens drive UI state."
          >
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Primary</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {PRIMARY_TOKENS.map((t) => (
                    <ColorSwatch key={t.name} {...t} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Secondary</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {SECONDARY_TOKENS.map((t) => (
                    <ColorSwatch key={t.name} {...t} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Functional</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {FUNCTIONAL_TOKENS.map((t) => (
                    <ColorSwatch key={t.name} {...t} />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section id="type" title="Type Scale" description="Geist Variable, top to bottom.">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Font Sizes</h3>
                <Card>
                  <CardContent className="flex flex-col divide-y divide-border pt-6">
                    {TYPE_SCALE.map((t) => (
                      <div key={t.label} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="w-28 shrink-0 text-xs text-muted-foreground">{t.label}</span>
                        <span className={`flex-1 ${t.className}`}>{t.label}</span>
                        <span className="shrink-0 text-right text-xs text-muted-foreground">
                          {t.px} / {t.rem}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Font Weights</h3>
                <Card>
                  <CardContent className="flex flex-col divide-y divide-border pt-6">
                    {FONT_WEIGHTS.map((w) => (
                      <div key={w.label} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="w-20 shrink-0 text-xs text-muted-foreground">{w.label}</span>
                        <span className={`flex-1 text-lg ${w.className}`}>The quick brown fox</span>
                        <span className="shrink-0 text-right text-xs text-muted-foreground">{w.weight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Line Heights</h3>
                <Card>
                  <CardContent className="flex flex-col divide-y divide-border pt-6">
                    {LINE_HEIGHTS.map((lh) => (
                      <div key={lh.label} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="w-20 shrink-0 text-xs text-muted-foreground">{lh.label}</span>
                        <p className={`max-w-md flex-1 ${lh.className}`}>
                          The quick brown fox jumps over the lazy dog. A second sentence for context.
                        </p>
                        <span className="shrink-0 text-right text-xs text-muted-foreground">{lh.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          <Section id="icons" title="Iconography" description="Lucide only, used at consistent sizes and stroke widths.">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
              {ICONS.map(({ Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 rounded-lg border border-border p-3">
                  <Icon className="size-5 text-foreground" />
                  <span className="text-center text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Browse all icons at lucide.dev/icons
            </a>
          </Section>

          <Section id="imagery" title="Imagery" description="Rounded corners, object-cover fit, consistent aspect ratios.">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {IMAGE_RATIOS.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="mx-auto" style={{ width: item.width }}>
                    <AspectRatio ratio={item.ratio}>
                      <div className={`flex size-full items-center justify-center bg-muted text-muted-foreground ${item.shape}`}>
                        <ImageIcon />
                      </div>
                    </AspectRatio>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="ai" title="AI" description="Principles first, patterns second.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {AI_PRINCIPLES.map(({ Icon, title, description }) => (
                <Card key={title}>
                  <CardHeader>
                    <Icon className="mb-1 size-5 text-primary" />
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Patterns</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pattern examples (agent actions, confidence indicators, running states) go here.
              </p>
            </div>
          </Section>

          <Section
            id="filters"
            title="Filters"
            description="A filter bar composed from Input, Label, Select, and Button — no hardcoded styles."
          >
            <Card>
              <CardContent className="pt-6">
                <FilterBar />
              </CardContent>
            </Card>
          </Section>

          <Section id="tokens" title="Tokens Applied to Components" description="A curated look at theme tokens in use.">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Inputs & Select</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row">
                  <Input placeholder="Search…" className="sm:max-w-xs" />
                  <Select defaultValue="viewer">
                    <SelectTrigger className="sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}

export default App

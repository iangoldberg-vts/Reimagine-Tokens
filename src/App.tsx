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
  { id: 'tokens', label: 'Tokens Applied to Components' },
]

const DESKTOP_WIREFRAME_ROWS: WireframeRow[] = [
  { bleed: true, height: 36 }, // header — full-bleed, ignores the margin
  { height: 108, items: ['col-span-4', 'col-span-8'] }, // sidebar + hero
  { height: 108, items: ['col-span-4', 'col-span-4', 'col-span-4'] }, // three even cards
  { bleed: true, height: 36 }, // footer — full-bleed, ignores the margin
]

const MOBILE_WIREFRAME_ROWS: WireframeRow[] = [
  { bleed: true, height: 36 }, // header — full-bleed, ignores the margin
  { height: 74, items: ['col-span-2', 'col-span-2'] }, // two even feature blocks
  { height: 74, items: ['col-span-4'] }, // full-width hero / body block
  { height: 36, items: ['col-span-1', 'col-span-1', 'col-span-1', 'col-span-1'] }, // four equal stats
  { bleed: true, height: 48 }, // footer — full-bleed, ignores the margin
]

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
  { label: 'sm', className: 'rounded-sm', px: '4.8px' },
  { label: 'md', className: 'rounded-md', px: '6.4px' },
  { label: 'lg', className: 'rounded-lg', px: '8px' },
  { label: 'xl', className: 'rounded-xl', px: '11.2px' },
  { label: '2xl', className: 'rounded-2xl', px: '14.4px' },
  { label: '3xl', className: 'rounded-3xl', px: '17.6px' },
  { label: '4xl', className: 'rounded-4xl', px: '20.8px' },
  { label: 'full', className: 'rounded-full', px: 'pill' },
]

const TYPE_SCALE = [
  { label: 'Display', className: 'text-4xl font-semibold' },
  { label: 'H1', className: 'text-3xl font-semibold' },
  { label: 'H2', className: 'text-2xl font-semibold' },
  { label: 'H3', className: 'text-xl font-semibold' },
  { label: 'Body', className: 'text-base font-normal' },
  { label: 'Small', className: 'text-sm font-normal' },
  { label: 'Caption', className: 'text-xs font-normal text-muted-foreground' },
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
  { ratio: 16 / 9, label: '16:9' },
  { ratio: 1, label: '1:1' },
  { ratio: 4 / 3, label: '4:3' },
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

type WireframeRow = { bleed: true; height: number } | { bleed?: false; height: number; items: string[] }

function GridOverlayMock({
  label,
  columns,
  margin,
  gutter,
  rowGap,
  width,
  rows,
}: {
  label: string
  columns: number
  margin: number
  gutter: number
  rowGap: number
  width?: number
  rows: WireframeRow[]
}) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    columnGap: gutter,
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative overflow-hidden rounded-md ring-1 ring-border ${width ? '' : 'w-full'}`} style={{ width }}>
        {/* wireframe mock */}
        <div className="relative z-0 flex flex-col" style={{ rowGap }}>
          {rows.map((row, i) =>
            row.bleed ? (
              <div key={i} className="rounded-md bg-muted-foreground/20" style={{ height: row.height }} />
            ) : (
              <div key={i} className="grid" style={{ ...gridStyle, height: row.height, padding: `0 ${margin}px` }}>
                {row.items.map((span, j) => (
                  <div key={j} className={`${span} h-full rounded-md bg-muted-foreground/20`} />
                ))}
              </div>
            )
          )}
        </div>
        {/* grid overlay — spans the full height, inset only by the margin horizontally */}
        <div
          className="pointer-events-none absolute inset-0 z-10 grid"
          style={{ ...gridStyle, padding: `0 ${margin}px` }}
        >
          {Array.from({ length: columns }, (_, i) => (
            <div key={i} className="h-full rounded-[2px] bg-destructive/10" />
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{label}</p>
        <p>
          {columns} columns · {margin}px margin · {gutter}px gutter
        </p>
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

          <Section
            id="grid"
            title="Grid"
            description="Desktop: 12 columns · 76px margin · 24px gutter. Mobile: 4 columns · 16px margin · 16px gutter."
          >
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
                <p className="mt-4 text-xs text-muted-foreground">
                  Resize the window — below <code>sm</code>: 4 columns · 16px margin · 16px gutter. At{' '}
                  <code>sm</code> and above: 12 columns · 76px margin · 24px gutter.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto]">
              <GridOverlayMock
                label="Desktop"
                columns={12}
                margin={76}
                gutter={24}
                rowGap={32}
                rows={DESKTOP_WIREFRAME_ROWS}
              />
              <GridOverlayMock
                label="Mobile"
                columns={4}
                margin={16}
                gutter={16}
                rowGap={32}
                width={220}
                rows={MOBILE_WIREFRAME_ROWS}
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
            description="Background containers are flat — no elevation, no border unless needed for separation."
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
                      <div className={`size-16 border border-border bg-muted ${r.className}`} />
                      <div className="text-center text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">{r.label}</p>
                        <p>{r.px}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Elevation</h3>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div className="flex flex-col gap-4">
                    <div className="flex h-16 items-center justify-center rounded-lg bg-popover text-xs text-muted-foreground ring-1 ring-foreground/10">
                      ring-1 ring-foreground/10
                    </div>
                    <div>
                      <CardTitle className="text-base">Flat</CardTitle>
                      <CardDescription className="mt-1">
                        Card, Input, Button, Dialog, Drawer — border or <code>ring-1 ring-foreground/10</code>,
                        no shadow. Modals read as elevated from the dimmed backdrop behind them, not a shadow.
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Dialog</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Flat surface</DialogTitle>
                          <DialogDescription>
                            No shadow on this popup — just <code>ring-1 ring-foreground/10</code>. The dimmed
                            overlay behind it does the elevation work.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex h-16 items-center justify-center rounded-lg bg-popover text-xs text-muted-foreground shadow-md ring-1 ring-foreground/10">
                      shadow-md
                    </div>
                    <div>
                      <CardTitle className="text-base">Floating — shadow-md</CardTitle>
                      <CardDescription className="mt-1">
                        Popover, Dropdown Menu, Select, Combobox, Hover Card, Navigation Menu — anchored
                        overlays with no backdrop, so they need a shadow to lift off the page.
                      </CardDescription>
                    </div>
                    <Popover>
                      <PopoverTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Popover</Button>} />
                      <PopoverContent>
                        This popup uses <code>shadow-md</code> plus <code>ring-1 ring-foreground/10</code>.
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex h-16 items-center justify-center rounded-lg bg-popover text-xs text-muted-foreground shadow-lg ring-1 ring-foreground/10">
                      shadow-lg
                    </div>
                    <div>
                      <CardTitle className="text-base">Elevated — shadow-lg</CardTitle>
                      <CardDescription className="mt-1">
                        Sheet, Toast, Context Menu, and nested submenus — edge-docked or stacked above another
                        floating layer, so they need more lift than a standard popup.
                      </CardDescription>
                    </div>
                    <Sheet>
                      <SheetTrigger render={<Button variant="outline" size="sm" className="w-fit">Open Sheet</Button>} />
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Elevated surface</SheetTitle>
                          <SheetDescription>This panel uses <code>shadow-lg</code>.</SheetDescription>
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
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6">
                {TYPE_SCALE.map((t) => (
                  <div
                    key={t.label}
                    className="flex items-baseline gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <span className="w-20 shrink-0 text-xs text-muted-foreground">{t.label}</span>
                    <span className={t.className}>Built for how modern teams work</span>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                  <AspectRatio ratio={item.ratio}>
                    <div className="flex size-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ImageIcon />
                    </div>
                  </AspectRatio>
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

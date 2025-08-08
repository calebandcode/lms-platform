# LMS Platform – Next.js 15, Sanity CMS & Paystack

A modern, feature-rich Learning Management System built with Next.js 15, Sanity CMS, Clerk and Paystack. Features real-time content updates, module-based learning, progress tracking and secure payments.

## Features

### For Students

- 📚 Access comprehensive course content
- 📊 Real-time progress tracking
- ✅ Lesson completion & module unlocks
- 🎯 Structured, module-based learning paths
- 🎥 Multiple video integrations (YouTube, Vimeo, Loom)
- 💳 Secure course purchases via Paystack
- 📱 Fully mobile-responsive
- 🔄 Sync progress across devices

### For Course Creators

- 📝 Rich content authoring in Sanity Studio
- 📊 Student progress dashboards
- 📈 Course analytics & insights
- 🎨 Customizable course/module structure
- 📹 Built-in video hosting options
- 💰 Direct payments via Paystack
- 🔄 Instant content updates on publish
- 📱 Mobile-optimized delivery

### Technical Highlights

- 🚀 Next.js 15 Server Components & Server Actions
- 👤 Authentication & session management with Clerk
- 💳 Payment processing with Paystack
- 📝 Headless CMS with Sanity
- 🎨 Tailwind CSS + shadcn/ui design system
- 🔒 Protected routes & content ACLs
- 🌙 Dark mode support

### UI/UX

- 🎯 Clean, modern interface
- ♿ Accessible components
- 🎭 Smooth transitions & micro-interactions
- 🔄 Skeleton loaders for async states
- 🌙 Light/Dark toggle

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account & CLI
- Clerk account
- Paystack account

### Environment Variables

Create a `.env.local` at project root:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-read-token
SANITY_API_ADMIN_TOKEN=your-sanity-admin-token

# Sanity Studio
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_WEBHOOK_SECRET=your-paystack-webhook-secret
```

### Installation

```bash
# 1. Clone repo
git clone https://github.com/yourusername/lms-platform.git
cd lms-platform

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. In separate terminal, start Sanity Studio
npm run sanity:dev
```

### Setting up Sanity CMS

1. Install Sanity CLI globally:

   ```bash
   npm install -g @sanity/cli
   ```

2. Initialize studio if needed:

   ```bash
   sanity init
   ```

3. Deploy Studio:

   ```bash
   sanity deploy
   ```

### Setting up Clerk

1. Create a new Clerk app.
2. Configure authentication providers and redirect URLs.
3. Add your Clerk keys to `.env.local`.

### Setting up Paystack

1. Login to your Paystack dashboard → **Settings > API Keys & Webhooks**.
2. Copy your **Secret Key** and **Public Key** into `.env.local`.
3. In **Webhooks**, add your endpoint (e.g. `https://your-domain.com/api/paystack/webhook`) with your **Webhook Secret**.
4. For local testing, expose your localhost via ngrok:

   ```bash
   ngrok http 3000
   ```

   Then use the generated URL in your Paystack webhook settings.

---

## Architecture

### Content Schema

- **Course**
  - Title, Description, Price, Image, Slug
  - Modules → ordered sub-documents

- **Module**
  - Title, Order, Lessons

- **Lesson**
  - Title, Rich Text, Video URL, Completion flag

- **Student**
  - Clerk ID, Profile, Enrollments, Progress data

- **Enrollment**
  - Student ID, Course ID, Payment ID, Amount

### Key Components

- **Course Management**: Sanity Studio → content modeling → live updates
- **Progress Tracking**: store completion flags, calculate percentages
- **Payment Processing**: Paystack initialize → redirect → webhook handler
- **Authentication**: Clerk for sign-up, sign-in, protected routes

---

## Usage

### Creating a Course

1. Open your Sanity Studio (e.g. `http://localhost:3333`)
2. Add a new Course document
3. Define Modules & Lessons
4. Write content, embed videos, upload images
5. Publish

### Student Workflow

1. Browse courses on the front end
2. Click **Buy Now** → redirected to Paystack checkout
3. Complete payment → Paystack webhook enrolls student
4. Access course content → track progress → mark complete
5. Return anytime to continue

---

## Development

### Project Structure

```
/app                     # Next.js App Router
  /(dashboard)           # Creator dashboard routes
  /(user)                # Student-facing routes
  /api                   # API and webhook routes
/components             # Shared React components
/lib                     # Utility functions (e.g. baseUrl, Paystack helper)
sanity/                  # Sanity config & Studio
  /schemas               # Document schemas
  /lib                   # Sanity client helpers
```

### Core Tech Stack

- Next.js 15 + App Router
- TypeScript
- Sanity CMS
- Clerk Auth
- Paystack Payments
- Tailwind CSS & shadcn/ui
- Lucide Icons

---

## Features in Detail

- **Course Management**: Flexible schema, real-time updates
- **Student Dashboard**: Progress bar, continue where you left off
- **Video Integration**: YouTube/Vimeo/Loom embeds with responsive player
- **Payment System**:
  - Initialize transactions via Paystack API
  - HMAC-SHA512 webhook verification
  - Automatic enrollment on `charge.success`

- **Authentication**: Clerk handles sign-in/up, session, roles

---

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

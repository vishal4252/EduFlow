import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Learn with Courses",
    description:
      "Explore structured courses and keep your learning organized in one place.",
  },
  {
    icon: ClipboardList,
    title: "Manage Assignments",
    description:
      "Create, track, and stay on top of assignments with a simple workflow.",
  },
  {
    icon: Users,
    title: "Built for Everyone",
    description:
      "A smooth experience for students, teachers, and administrators.",
  },
  {
    icon: Zap,
    title: "Simple & Fast",
    description:
      "Focus on learning instead of navigating through complicated interfaces.",
  },
];

const roles = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Discover courses, manage your enrolled learning, and keep track of assignments.",
  },
  {
    icon: BookOpen,
    title: "For Teachers",
    description:
      "Manage assigned courses and create assignments for your learners.",
  },
  {
    icon: Users,
    title: "For Administrators",
    description:
      "Manage courses, users, teachers, students, and assignments from one dashboard.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white shadow-lg shadow-slate-950/10">
              E
            </div>

            <span className="text-xl font-bold tracking-tight">EduFlow</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </a>

            <a
              href="#for-everyone"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              For Everyone
            </a>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 sm:px-4"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-240px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-slate-100 blur-3xl" />

          <div className="absolute right-[-180px] top-[180px] h-[380px] w-[380px] rounded-full bg-indigo-100/70 blur-3xl" />

          <div className="absolute left-[-180px] top-[420px] h-[350px] w-[350px] rounded-full bg-blue-100/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-6 sm:pt-40 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
                <Sparkles size={15} className="text-indigo-500" />A simpler way
                to manage learning
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Learning that
                <span className="block bg-gradient-to-r from-slate-950 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  flows naturally.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                EduFlow brings courses, assignments, teachers, and students
                together in one clean learning management experience.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start Learning
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <PlayCircle size={17} />
                  Sign in
                </Link>
              </div>

              {/* Trust points */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Simple dashboard
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Role-based access
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  One platform
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-100/70 via-transparent to-blue-100/70 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
                {/* Browser top */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                  <div className="ml-4 h-7 flex-1 rounded-lg bg-slate-50" />
                </div>

                {/* Dashboard preview */}
                <div className="grid grid-cols-[72px_1fr] overflow-hidden rounded-xl bg-slate-50">
                  <div className="border-r border-slate-100 bg-slate-950 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
                      E
                    </div>

                    <div className="mt-7 space-y-3">
                      <div className="h-8 rounded-lg bg-white/10" />
                      <div className="h-8 rounded-lg bg-white/10" />
                      <div className="h-8 rounded-lg bg-white/10" />
                      <div className="h-8 rounded-lg bg-white/10" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-3 w-24 rounded bg-slate-200" />
                        <div className="mt-2 h-6 w-40 rounded bg-slate-900" />
                      </div>

                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-slate-100" />
                        <div className="mt-4 h-3 w-16 rounded bg-slate-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-slate-900" />
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50" />
                        <div className="mt-4 h-3 w-16 rounded bg-slate-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-slate-900" />
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-slate-100" />
                        <div className="mt-4 h-3 w-16 rounded bg-slate-200" />
                        <div className="mt-2 h-5 w-10 rounded bg-slate-900" />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="h-4 w-28 rounded bg-slate-900" />
                            <div className="mt-2 h-3 w-40 rounded bg-slate-200" />
                          </div>

                          <div className="h-8 w-8 rounded-lg bg-slate-100" />
                        </div>

                        <div className="mt-5 space-y-3">
                          <div className="h-3 w-full rounded bg-slate-100" />
                          <div className="h-3 w-5/6 rounded bg-slate-100" />
                          <div className="h-3 w-4/6 rounded bg-slate-100" />
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-4 w-28 rounded bg-slate-900" />
                        <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-5 -left-5 hidden w-52 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ClipboardList size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Stay organized</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-950">
                      Assignments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-100 bg-slate-50/70"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Everything in one place
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to keep learning moving.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              EduFlow keeps the important parts of your learning workflow
              connected without unnecessary complexity.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:scale-105">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                How it works
              </span>

              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Less time managing. More time learning.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                EduFlow gives each role the tools they need while keeping the
                overall experience simple and easy to understand.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    number: "01",
                    title: "Create your account",
                    text: "Register and get access to your personalized LMS experience.",
                  },
                  {
                    number: "02",
                    title: "Access your workspace",
                    text: "Students, teachers, and administrators see the tools relevant to their role.",
                  },
                  {
                    number: "03",
                    title: "Keep everything organized",
                    text: "Courses and assignments stay connected throughout the learning workflow.",
                  },
                ].map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-950">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] bg-slate-950 p-6 shadow-2xl shadow-slate-950/15 sm:p-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Your workspace</p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        Keep learning organized
                      </p>
                    </div>

                    <Sparkles size={20} className="text-indigo-300" />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <BookOpen size={17} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="h-3 w-28 rounded bg-white/25" />
                        <div className="mt-2 h-2.5 w-20 rounded bg-white/10" />
                      </div>

                      <ArrowRight size={15} className="text-slate-400" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <ClipboardList size={17} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="h-3 w-32 rounded bg-white/25" />
                        <div className="mt-2 h-2.5 w-24 rounded bg-white/10" />
                      </div>

                      <ArrowRight size={15} className="text-slate-400" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <GraduationCap size={17} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="h-3 w-24 rounded bg-white/25" />
                        <div className="mt-2 h-2.5 w-28 rounded bg-white/10" />
                      </div>

                      <ArrowRight size={15} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Workflow</p>
                    <p className="text-sm font-semibold text-slate-950">
                      All connected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section
        id="for-everyone"
        className="border-t border-slate-100 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Made for your role
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              One platform. Different experiences.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {role.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {role.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700">
                    Explore your workspace
                    <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-950/10 sm:px-10">
            <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                <Sparkles size={13} />
                Start with EduFlow
              </span>

              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Make your learning experience simpler.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Create your account and get started with a cleaner way to manage
                courses and assignments.
              </p>

              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Create your account
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              E
            </div>

            <span className="text-sm font-bold text-slate-950">EduFlow</span>
          </Link>

          <p className="text-xs text-slate-500">
            A simple learning management experience.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/login" className="transition hover:text-slate-950">
              Login
            </Link>

            <Link href="/register" className="transition hover:text-slate-950">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

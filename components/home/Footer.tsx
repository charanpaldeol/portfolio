export default function Footer() {
  return (
    <footer className="border-t border-border pt-5 flex items-center justify-between text-xs text-muted-foreground">
      <div>© 2026 Charan Deol</div>
      <div className="flex items-center gap-2">
        <a href="mailto:hello@cpdeol.com">hello@cpdeol.com</a>
        <span aria-hidden="true">·</span>
        <a
          href="https://www.linkedin.com/in/cdeol"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  )
}


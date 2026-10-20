import { useCallback, useEffect, useRef, useState } from "react";
import pocketFoxPhoto from "./assets/pocket-fox.jpg";
import featuredCollectionPhoto from "./assets/featured-collection.png";
import astroCatPhoto from "./assets/astro-cat.jpg";
import pastelCastlePhoto from "./assets/pastel-castle.jpg";
import spiralTowerPhoto from "./assets/spiral-tower.png";
import cityTowerPhoto from "./assets/city-tower.jpg";
import luckyCatPhoto from "./assets/lucky-cat.jpg";
import lionCrestPhoto from "./assets/lion-crest.png";
import ironTuskPhoto from "./assets/iron-tusk.jpg";
import amethystClusterPhoto from "./assets/amethyst-cluster.png";
import silverFoxPhoto from "./assets/silver-fox.jpg";

type Project = {
  title: string;
  category: string;
  material: string;
  image: string;
  imagePosition?: string;
  modalImageFit?: "contain";
  description: string;
  index: string;
};

const projects: Project[] = [
  {
    title: "Pocket Fox",
    category: "Keychains",
    material: "Metallic PLA",
    image: pocketFoxPhoto,
    imagePosition: "center 48%",
    description:
      "A faceted little companion, printed in warm metallic gold and finished as an everyday bag charm.",
    index: "001",
  },
  {
    title: "Astro Cat",
    category: "Keychains",
    material: "Silver PLA",
    image: astroCatPhoto,
    imagePosition: "center 28%",
    description:
      "A pocket-sized astro cat in a chunky low-poly suit, ready to travel beyond the desk.",
    index: "002",
  },
  {
    title: "Pastel Castle",
    category: "Keychains",
    material: "Gradient PLA",
    image: pastelCastlePhoto,
    imagePosition: "center 48%",
    description:
      "A pocket castle with tiny towers, printed in a dreamy blue-to-pink gradient.",
    index: "003",
  },
  {
    title: "Spiral Tower",
    category: "Desk Print",
    material: "Gradient PLA",
    image: spiralTowerPhoto,
    imagePosition: "center 42%",
    modalImageFit: "contain",
    description:
      "A winding multilevel tower filled with tiny architectural details and shifting bands of color.",
    index: "004",
  },
  {
    title: "City Tower",
    category: "Keychains",
    material: "Silver PLA",
    image: cityTowerPhoto,
    imagePosition: "center 42%",
    description:
      "A miniature architectural tower that turns a familiar skyline into a carry-along keepsake.",
    index: "005",
  },
  {
    title: "Lucky Cat",
    category: "Keychains",
    material: "Chrome-finish PLA",
    image: luckyCatPhoto,
    imagePosition: "center 36%",
    description:
      "A tiny chrome cat with crisp geometric details and plenty of character.",
    index: "006",
  },
  {
    title: "Lion Crest",
    category: "Keychains",
    material: "Emerald PLA",
    image: lionCrestPhoto,
    imagePosition: "center 48%",
    description:
      "A bold, faceted lion portrait shaped into a compact emerald-green crest.",
    index: "007",
  },
  {
    title: "Iron Tusk",
    category: "Keychains",
    material: "Silver PLA",
    image: ironTuskPhoto,
    imagePosition: "center 72%",
    description:
      "A low-poly elephant study with an expressive pose and sculptural metallic finish.",
    index: "008",
  },
  {
    title: "Amethyst Cluster",
    category: "Keychains",
    material: "Purple PLA",
    image: amethystClusterPhoto,
    imagePosition: "center 46%",
    description:
      "A faceted crystal shard charm hanging right where it belongs—on the backpack zipper.",
    index: "009",
  },
  {
    title: "Silver Fox",
    category: "Keychains",
    material: "Silver PLA",
    image: silverFoxPhoto,
    imagePosition: "center 31%",
    description:
      "A bright silver woodland companion with oversized ears and faceted details.",
    index: "010",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef<HTMLElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement>(null);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    requestAnimationFrame(() => projectTriggerRef.current?.focus());
  }, []);

  const showAdjacentProject = useCallback((offset: number) => {
    setSelectedProject((currentProject) => {
      if (!currentProject) return currentProject;

      const currentIndex = projects.findIndex(
        (project) => project.title === currentProject.title,
      );
      const nextIndex =
        (currentIndex + offset + projects.length) % projects.length;

      return projects[nextIndex];
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showAdjacentProject(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showAdjacentProject(1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeProject, selectedProject, showAdjacentProject]);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Swee Ming dabbles in 3D prints, home">
          <span className="brand-mark" aria-hidden="true">
            SM
          </span>
          <span>Swee Ming Prints.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a className="nav-contact" href="#work">
            See the prints <ArrowIcon />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">
              <span aria-hidden="true" />
              Built on a build plate, made for fun.
            </p>
            <h1 id="hero-title">
              Swee Ming dabbles in <em>3D prints.</em>
            </h1>
            <p className="hero-intro">
              This is a running log of my 3D printing experiments, featuring
              everything from low-poly animals to desk trinkets. If it fits on
              a build plate and looks cool, it gets printed. ;D
            </p>
            <a className="primary-link" href="#work">
              Browse the prints <ArrowIcon />
            </a>
          </div>

          <div
            className="hero-art"
            aria-label="Featured collection of 3D-printed keychains"
            data-reveal
          >
            <div className="hero-frame">
              <img
                src={featuredCollectionPhoto}
                alt="A collection of colorful 3D-printed keychains displayed at home"
              />
            </div>
            <div className="hero-caption">
              <strong>Home Collection</strong>
            </div>
            <span className="edition-note">
              {String(projects.length).padStart(2, "0")} / home print shelf
            </span>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <div>
              <p className="kicker">The print shelf</p>
              <h2 id="work-title">Recent makes</h2>
            </div>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title} data-reveal>
                <button
                  className="project-card-trigger"
                  onClick={(event) => {
                    projectTriggerRef.current = event.currentTarget;
                    setSelectedProject(project);
                  }}
                  type="button"
                  aria-label={`View ${project.title} project`}
                />
                <div className="project-image">
                  <img
                    src={project.image}
                    alt=""
                    style={{ objectPosition: project.imagePosition }}
                  />
                  <span className="project-number">{project.index}</span>
                  <span className="view-tag">
                    View <ArrowIcon />
                  </span>
                </div>
                <div className="project-meta">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <p className="kicker" data-reveal>
            Behind the layers
          </p>
          <div className="about-grid">
            <h2 id="about-title" data-reveal>
              PROMPT TO PRINT.
            </h2>
            <div className="about-copy" data-reveal>
              <p>
                A running collection of small experiments. Every piece starts
                as a prompt in Gemini, gets converted to an STL via Hunyuan3D
                AI, and finishes up on my A1 build plate. Some turn out great,
                some go straight to the recycling bin.
              </p>
              <p className="micro-note">
                Prompted with curiosity / Generated with AI / Printed at home
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="footer-callout" data-reveal>
          <h2>MORE PRINTS ON THE WAY.</h2>
        </div>
        <div className="footer-base" data-reveal>
          <p>© {new Date().getFullYear()} Swee Ming</p>
          <p>AI-assisted design, printed at home.</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      {selectedProject && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeProject();
          }}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
          >
            <button
              className="modal-close"
              type="button"
              onClick={closeProject}
              aria-label="Close project"
              autoFocus
            >
              <CloseIcon />
            </button>
            <div
              className={`modal-image${selectedProject.modalImageFit ? " full-image" : ""}`}
            >
              {selectedProject.modalImageFit && (
                <img
                  className="modal-image-backdrop"
                  src={selectedProject.image}
                  alt=""
                  aria-hidden="true"
                />
              )}
              <img
                src={selectedProject.image}
                alt={`${selectedProject.title}, ${selectedProject.description}`}
                style={{
                  objectPosition: selectedProject.imagePosition,
                  objectFit: selectedProject.modalImageFit,
                }}
              />
            </div>
            <div className="modal-copy">
              <p className="kicker">
                Project {selectedProject.index} / {selectedProject.category}
              </p>
              <h2 id="modal-title">{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <span>{selectedProject.material}</span>
              <div className="modal-navigation" aria-label="Project navigation">
                <button
                  className="previous"
                  type="button"
                  onClick={() => showAdjacentProject(-1)}
                >
                  <ArrowIcon /> Previous
                </button>
                <button type="button" onClick={() => showAdjacentProject(1)}>
                  Next <ArrowIcon />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

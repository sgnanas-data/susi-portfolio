import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby'; // Removed withPrefix import
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const IMAGE_FRAME_HEIGHT = 320;
const IMAGE_MAX_WIDTH = 560;

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  width: 100%;

  &:not(:last-of-type) {
    margin-bottom: 120px;
  }

  .project-inner {
    display: flex;
    align-items: center;
    gap: 40px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }

  .project-inner.reverse {
    flex-direction: row-reverse;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .project-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .project-overline {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin: 0 0 8px;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(26px, 5vw, 30px);
    margin: 0 0 18px;

    a {
      &:hover,
      &:focus {
        color: var(--green);
      }
    }
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    background-color: var(--light-navy);
    padding: 24px;
    border-radius: var(--border-radius);
    color: var(--light-slate);
    font-size: var(--fz-lg);
    max-width: 520px;
    text-align: left;

    strong {
      color: var(--lightest-slate);
      display: inline-block;
      margin-top: 10px;
    }

    ul {
      margin: 12px 0 0;
      padding-left: 20px;
      list-style: disc;
      text-align: left;
    }

    li {
      margin: 6px 0;
    }

    @media (max-width: 1080px) {
      max-width: 480px;
    }

    @media (max-width: 768px) {
      max-width: 100%;
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    margin: 18px 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-right: 15px;
      margin-top: 8px;
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    margin-top: 10px;

    a {
      padding: 8px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .project-image {
    flex: 0 0 ${IMAGE_MAX_WIDTH}px;
    max-width: ${IMAGE_MAX_WIDTH}px;
    position: relative;

    @media (max-width: 768px) {
      width: 100%;
      max-width: 100%;
      flex: 0 0 auto;
    }
  }

  .project-image a {
    display: block;
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    height: ${IMAGE_FRAME_HEIGHT}px;
    background-color: var(--light-navy);
    ${({ theme }) => theme.mixins.boxShadow};
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background-color: var(--light-navy);
    display: block;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  @media (max-width: 768px) {
    .project-image a {
      height: 260px;
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges;
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some of my Ideas
      </h2>

      <StyledProjectsGrid>
        {featuredProjects.map(({ node }, i) => {
          const { frontmatter, html } = node;
          const { title, tech, github, external, cover, cta } = frontmatter;

          const reverse = i % 2 === 1;

          return (
            <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
              <div className={`project-inner ${reverse ? 'reverse' : ''}`}>
                <div className="project-content">
                  <p className="project-overline">Featured Project</p>

                  <h3 className="project-title">
                    <a 
                      href={external || github || '#'} 
                      target={external || github ? "_blank" : "_self"}
                      rel={external || github ? "noreferrer noopener" : ""}
                    >
                      {title}
                    </a>
                  </h3>

                  <div 
                    className="project-description" 
                    dangerouslySetInnerHTML={{ __html: html }} 
                  />

                  <ul className="project-tech-list">
                    {tech?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>

                  <div className="project-links">
                    {github && (
                      <a 
                        href={github} 
                        aria-label="GitHub"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && !cta && (
                      <a 
                        href={external} 
                        aria-label="External Link"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="project-image">
                  <a 
                    href={external || github || '#'} 
                    aria-label={title}
                    target={external || github ? "_blank" : "_self"}
                    rel={external || github ? "noreferrer noopener" : ""}
                  >
                    {/* CHANGED: Use __PATH_PREFIX__ for guaranteed path prefixing */}
                    <img 
                      src={`${__PATH_PREFIX__ || ''}${cover}`} 
                      alt={title} 
                      className="img" 
                      loading="lazy" 
                    />
                  </a>
                </div>
              </div>
            </StyledProject>
          );
        })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;